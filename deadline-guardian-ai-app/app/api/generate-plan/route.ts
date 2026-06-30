import OpenAI from "openai";
import { NextResponse } from "next/server";

import type { GeneratedPlan, MissionInput } from "@/components/generated-plan";
import {
  buildPlanningPrompt,
  clampPlanToDeadline,
  parseModelJson,
} from "@/lib/plan-utils";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY || "placeholder",
  baseURL: "https://api.groq.com/openai/v1",
});

function isMissionInput(value: unknown): value is MissionInput {
  if (!value || typeof value !== "object") {
    return false;
  }

  const input = value as Partial<MissionInput>;

  return (
    typeof input.missionName === "string" &&
    typeof input.deadline === "string" &&
    typeof input.description === "string" &&
    typeof input.priority === "string" &&
    typeof input.hoursPerDay === "number" &&
    Number.isFinite(input.hoursPerDay)
  );
}

function asNumber(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function asString(value: unknown, fallback: string) {
  return typeof value === "string" ? value : fallback;
}

function normalizePlan(value: unknown, input: MissionInput): GeneratedPlan {
  if (!value || typeof value !== "object") {
    throw new Error("Groq returned an invalid plan.");
  }

  const plan = value as Partial<GeneratedPlan>;
  const timeline = Array.isArray(plan.timeline)
    ? plan.timeline.map((item, index) => ({
        day: asString(item?.day, `Day ${index + 1}`),
        task: asString(item?.task, "Mission task"),
        hours: asNumber(item?.hours, 1),
      }))
    : [];

  const recommendations = Array.isArray(plan.recommendations)
    ? plan.recommendations
        .filter((item): item is string => typeof item === "string")
        .slice(0, 6)
    : [];

  if (timeline.length === 0 || recommendations.length === 0) {
    throw new Error("Groq returned an incomplete plan.");
  }

  const basePlan: GeneratedPlan = {
    summary: asString(plan.summary, "Mission plan generated."),
    riskLevel: asString(plan.riskLevel, "Medium"),
    estimatedHours: Math.max(1, asNumber(plan.estimatedHours, 1)),
    confidence: Math.min(100, Math.max(0, asNumber(plan.confidence, 75))),
    timeline,
    recommendations,
  };

  return clampPlanToDeadline(basePlan, input.deadline, input.hoursPerDay);
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          message: "GROQ_API_KEY is not configured.",
        },
        {
          status: 500,
        }
      );
    }

    const body = await req.json();

    if (!isMissionInput(body)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid mission input.",
        },
        {
          status: 400,
        }
      );
    }

    const prompt = buildPlanningPrompt(body);

    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: "Return ONLY valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const text = completion.choices[0]?.message?.content;

    if (!text) {
      throw new Error("Groq returned an empty response.");
    }

    const plan = normalizePlan(parseModelJson(text), body);

    return NextResponse.json({
      success: true,
      plan,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate plan.",
      },
      {
        status: 500,
      }
    );
  }
}
