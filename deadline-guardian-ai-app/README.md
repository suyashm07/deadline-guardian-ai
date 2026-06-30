# 🚀 Deadline Guardian AI

> An AI-powered productivity assistant that transforms deadlines into intelligent execution plans using Large Language Models (LLMs). Deadline Guardian AI helps users break down complex goals into actionable phases while providing timeline planning, risk analysis, workload distribution, and AI-powered recommendations.

---

## 🌐 Live Demo

**Live Application:** https://deadline-guardian-ai-app.vercel.app

---

# 📖 Overview

Managing deadlines manually often leads to poor planning, missed milestones, and unnecessary stress.

**Deadline Guardian AI** solves this problem by generating a complete execution roadmap from a simple mission description and deadline.

Instead of creating a basic to-do list, the application generates:

- Intelligent execution timeline
- Risk analysis
- Time allocation
- Phase-wise planning
- AI recommendations
- Progress analytics
- Completion probability

---

# ✨ Features

## 🤖 AI Mission Planning

Generate structured execution plans from natural language using Groq LLM.

Example:

> "Research Paper Deadline"

↓

Automatically generates

- Research
- Introduction
- Writing
- Review
- Buffer Time

---

## 📅 Smart Timeline Generation

Automatically divides the mission into manageable execution phases.

Each phase contains:

- Task Name
- Date
- Estimated Hours
- Description

---

## ⚠️ Risk Analysis

AI estimates project risk based on:

- Deadline pressure
- Complexity
- Scope
- Dependencies
- Available buffer

Displayed using:

- Risk Radar
- Risk Score
- Completion Confidence

---

## 📊 Analytics Dashboard

Real-time analytics including:

- Total Missions
- Active Missions
- Completed Missions
- Average Completion
- Average Risk
- Planned Hours
- Remaining Hours
- Daily Workload

---

## 🧠 AI Recommendations

Provides personalized recommendations such as:

- Critical path alerts
- Buffer suggestions
- Priority adjustments
- Daily focus guidance

---

## 📈 Progress Tracking

Track project progress through:

- Mission Timeline
- Phase Completion
- Success Probability
- Completion Percentage

---

## 🔍 Search

Quickly search previously generated missions.

---

## 📝 Mission History

All generated missions are stored locally for future access.

Users can revisit previous execution plans anytime.

---

## 🎨 Modern UI

Designed with a premium dark interface featuring:

- Glassmorphism
- Neon accents
- Smooth cards
- Professional dashboard layout
- Responsive design

---
# 🖥 Screenshots

## Dashboard

![Dashboard](/screenshots/Screenshot%202026-06-30%20at%2023.38.03.png)

---

## AI Risk Analysis & Recommendations

![Risk Analysis](/screenshots/Screenshot%202026-06-30%20at%2023.39.02.png)

---

## Mission Timeline

![Timeline](/screenshots/Screenshot%202026-06-30%20at%2023.39.19.png)
---

# ⚙️ Tech Stack

### Frontend

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS

### AI

- Groq API
- Llama Model

### Backend

- Next.js API Routes

### Deployment

- Vercel

---

# 🧩 Project Workflow

```
User enters Mission + Deadline
            │
            ▼
     AI Prompt Generation
            │
            ▼
       Groq LLM Response
            │
            ▼
 Timeline + Risk + Analytics
            │
            ▼
 Dashboard Visualization
```

---

# 📂 Project Structure

```
app/
components/
lib/
public/

API
│
└── /api/generate-plan
```

---

# 🚀 Installation

Clone the repository

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/deadline-guardian-ai-app.git
```

Move into the project

```bash
cd deadline-guardian-ai-app
```

Install dependencies

```bash
npm install
```

Create a `.env.local`

```env
GROQ_API_KEY=YOUR_GROQ_API_KEY
```

Run the project

```bash
npm run dev
```

Open

```
http://localhost:3000
```

---

# 📌 Example Workflow

1. Enter your mission title.
2. Select a deadline.
3. Click **Generate Mission Plan**.
4. AI creates:
   - Timeline
   - Risk Analysis
   - Daily Workload
   - Execution Phases
   - AI Recommendations
5. Track progress from the dashboard.

---

# 🎯 Problem Statement

Students, professionals, and researchers often struggle to convert deadlines into realistic execution plans.

Deadline Guardian AI bridges this gap by combining AI planning with productivity analytics, allowing users to stay organized and improve the likelihood of completing their goals on time.

---

# 🌟 Future Scope

- User Authentication
- Cloud Database
- Calendar Integration
- Email Notifications
- Team Collaboration
- Mobile Application
- AI Chat Assistant
- Multi-language Support

---

# 💻 Developer

**Suyash Mishra**

B.Tech Information Technology

Government Engineering College, Azamgarh

---

# 📄 License

This project is developed for educational purposes and hackathon participation.

MIT License.