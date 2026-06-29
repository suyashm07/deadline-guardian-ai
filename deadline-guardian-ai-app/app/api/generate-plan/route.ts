import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { NextResponse } from "next/server";

import type { GeneratedPlan, MissionInput } from "@/components/generated-plan";

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

function normalizePlan(value: unknown): GeneratedPlan {
  if (!value || typeof value !== "object") {
    throw new Error("Gemini returned an invalid plan.");
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
    throw new Error("Gemini returned an incomplete plan.");
  }

  return {
    summary: asString(plan.summary, "Mission plan generated."),
    riskLevel: asString(plan.riskLevel, "Medium"),
    estimatedHours: Math.max(1, asNumber(plan.estimatedHours, 1)),
    confidence: Math.min(100, Math.max(0, asNumber(plan.confidence, 75))),
    timeline,
    recommendations,
  };
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          message: "GEMINI_API_KEY is not configured.",
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

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            summary: { type: SchemaType.STRING },
            riskLevel: { type: SchemaType.STRING },
            estimatedHours: { type: SchemaType.NUMBER },
            confidence: { type: SchemaType.NUMBER },
            timeline: {
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  day: { type: SchemaType.STRING },
                  task: { type: SchemaType.STRING },
                  hours: { type: SchemaType.NUMBER },
                },
                required: ["day", "task", "hours"],
              },
            },
            recommendations: {
              type: SchemaType.ARRAY,
              items: { type: SchemaType.STRING },
            },
          },
          required: [
            "summary",
            "riskLevel",
            "estimatedHours",
            "confidence",
            "timeline",
            "recommendations",
          ],
        },
      },
    });

    const prompt = `
You are Deadline Guardian AI, a mission-specific planning system.

Create a practical execution plan for this exact user mission. The plan must be tailored to the mission name and description, not a generic productivity template.

Mission name: ${body.missionName}
Mission description: ${body.description || "No extra description provided."}
Deadline date: ${body.deadline}
Priority: ${body.priority}
Available focused hours per day: ${body.hoursPerDay}
Current date: ${new Date().toISOString().slice(0, 10)}

Planning rules:
- Generate realistic daily tasks from now until the deadline, using the available hours per day as a hard planning constraint.
- Each timeline item must be a concrete action the user can perform that day.
- Use mission-specific nouns and deliverables in every task.
- Do not use vague phase names such as "Research", "Drafting", "Review", "Planning", "Execution", or "Finalization" unless that exact activity genuinely fits the mission.
- If a task involves learning, specify what topic, skill, chapter, module, workout, prototype, customer segment, dataset, model, feature, or artifact is being worked on.
- Allocate hours intelligently: harder or higher-priority work can take more hours, lighter checkpoints can take fewer hours, and no day should exceed the available focused hours per day.
- estimatedHours must be the realistic total effort for the generated timeline.
- confidence must reflect how likely the user is to finish on time, from 0 to 100.
- riskLevel must be exactly one of: Low, Medium, High.

Risk rules:
- Low: deadline has enough time, daily workload is comfortably below the user's available hours, and dependencies are limited.
- Medium: workload is achievable but requires consistency, scope control, or skill-building.
- High: deadline is tight, the mission is broad, daily workload is near the limit, or the description implies hard dependencies.

Recommendation rules:
- recommendations must be practical, mission-specific actions.
- Avoid generic advice like "stay consistent", "manage your time", or "track progress" unless tied to a specific mission artifact or measurable checkpoint.
- Include 3 to 6 recommendations.

Return strict JSON only. Do not include markdown, prose, code fences, comments, or extra keys.
The JSON must match this exact TypeScript shape:
{
  "summary": "string",
  "riskLevel": "Low | Medium | High",
  "estimatedHours": 0,
  "confidence": 0,
  "timeline": [
    {
      "day": "string",
      "task": "string",
      "hours": 0
    }
  ],
  "recommendations": ["string"]
}
`;

       const result = await model.generateContent(prompt);
const text = result.response.text();
const plan = normalizePlan(JSON.parse(text));

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
