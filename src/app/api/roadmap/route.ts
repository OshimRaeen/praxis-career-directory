import { NextResponse } from "next/server";
import { z } from "zod";
import rolesData from "@/data/roles.json";
import type { CareerRoadmap, RoleProfile } from "@/types/career";

const RequestSchema = z.object({
  currentBackground: z.string().trim().min(3).max(400),
  targetRole: z.string().trim().min(2).max(120),
  experienceLevel: z.enum([
    "Beginner",
    "Student / Fresher",
    "Career Switcher",
    "Junior (1–2 yrs)",
  ]),
  weeklyHours: z.number().int().min(5).max(40),
  market: z.enum(["India", "International"]),
});

const RoadmapResponseSchema = z.object({
  targetRole: z.string(),
  summary: z.string(),
  estimatedTimeline: z.string(),
  milestones: z
    .array(
      z.object({
        phase: z.string(),
        duration: z.string(),
        focus: z.string(),
        deliverables: z.array(z.string()).min(2).max(4),
        skills: z.array(z.string()).min(2).max(6),
      })
    )
    .min(3)
    .max(5),
  praxisAlignment: z.string(),
});

const roles = rolesData as RoleProfile[];

function buildPrompt(
  input: z.infer<typeof RequestSchema>,
  matchedRole?: RoleProfile
): string {
  const roleContext = matchedRole
    ? `
Role Context from Praxis Career Atlas:
- Job Family: ${matchedRole.jobFamily}
- Core Skills: ${matchedRole.guidance.coreSkills.join(", ")}
- Tech Named in Live Titles: ${matchedRole.observedSkills.join(", ") || "N/A"}
- Typical Responsibilities: ${matchedRole.guidance.responsibilities.join("; ")}
- Possible Next Roles: ${matchedRole.guidance.nextRoles.join(", ")}
`
    : "";

  return `You are a practical career mentor for Praxis (a hands-on apprenticeship & mentorship platform).
Build a concrete, realistic career roadmap in JSON only (no markdown fences).

Candidate details:
- Current background: ${input.currentBackground}
- Experience level: ${input.experienceLevel}
- Target role: ${input.targetRole}
- Weekly commitment: ${input.weeklyHours} hours/week
- Target market: ${input.market}
${roleContext}

Return strictly valid JSON matching this exact shape:
{
  "targetRole": string,
  "summary": string (2 concise sentences tailored to their background),
  "estimatedTimeline": string (e.g. "16–20 weeks at 15 hrs/week"),
  "milestones": [
    {
      "phase": string (e.g. "Phase 1 · Core Foundations"),
      "duration": string (e.g. "Weeks 1–4"),
      "focus": string (1 crisp sentence),
      "deliverables": [string, string, string] (concrete portfolio/work outputs, not vague study tips),
      "skills": [string, string, string]
    }
  ],
  "praxisAlignment": string (1–2 sentences explaining how a Praxis 12-month apprenticeship or mentor review accelerates this path)
}

Include 4 progressive milestones. Keep language direct, grounded, and free of hype.`;
}

function buildGroundedFallback(
  input: z.infer<typeof RequestSchema>,
  matchedRole?: RoleProfile
): CareerRoadmap {
  const coreSkills = matchedRole
    ? matchedRole.guidance.coreSkills.map((s) => s.replace(/\.$/, ""))
    : ["Core domain fundamentals", "Tooling & workflows", "Portfolio delivery"];

  const observed = matchedRole?.observedSkills.length
    ? matchedRole.observedSkills
    : coreSkills.slice(0, 4);

  const isTech =
    matchedRole?.jobFamily === "Full-Stack Development" ||
    /developer|engineer|stack|frontend|backend/i.test(input.targetRole);

  const totalWeeks = input.weeklyHours >= 20 ? 16 : input.weeklyHours >= 12 ? 22 : 28;
  const phaseWeeks = Math.round(totalWeeks / 4);

  return {
    targetRole: input.targetRole,
    summary: `A ${totalWeeks}-week practical transition plan from your current background (${input.experienceLevel}) toward ${input.targetRole} roles in the ${input.market} market. Focuses on verifiable portfolio evidence rather than passive coursework.`,
    estimatedTimeline: `~${totalWeeks} weeks at ${input.weeklyHours} hrs/week`,
    milestones: [
      {
        phase: "Phase 1 · Core Foundations",
        duration: `Weeks 1–${phaseWeeks}`,
        focus: `Close foundational gaps required for ${input.targetRole} day-to-day workflows.`,
        deliverables: isTech
          ? [
              "Build and deploy one clean CRUD application with proper Git commit hygiene",
              "Document architecture decisions and edge cases in a public README",
              "Complete 20 targeted fundamentals exercises aligned with the core stack",
            ]
          : [
              "Draft a standard end-to-end hiring & onboarding checklist template",
              "Build a clean candidate tracking sheet with structured evaluation rubrics",
              "Document 3 core HR/recruitment workflows relevant to startups",
            ],
        skills: coreSkills.slice(0, 4),
      },
      {
        phase: "Phase 2 · Applied Production Work",
        duration: `Weeks ${phaseWeeks + 1}–${phaseWeeks * 2}`,
        focus: "Ship realistic, multi-part work that mirrors startup team expectations.",
        deliverables: isTech
          ? [
              "Ship a full-featured project incorporating auth, validation, and responsive UI",
              "Add automated checks, error handling, and clean API documentation",
              "Run a peer or mentor code review and resolve all structural feedback",
            ]
          : [
              "Design a full role scorecard and structured interview guide for two startup roles",
              "Simulate a sourcing pipeline with boolean search strings and outreach templates",
              "Prepare a short compliance and employee-relations case brief",
            ],
        skills: observed.slice(0, 4),
      },
      {
        phase: "Phase 3 · Specialization & Proof of Work",
        duration: `Weeks ${phaseWeeks * 2 + 1}–${phaseWeeks * 3}`,
        focus: `Align your portfolio directly with ${input.market} employer requirements.`,
        deliverables: [
          "Publish a concise case study walking through one complex problem you solved",
          "Benchmark your skills against 10 live listings in the Praxis Job Board",
          "Refine your resume/CV to highlight measurable outcomes over tool lists",
        ],
        skills: [...new Set([...observed.slice(0, 2), ...coreSkills.slice(-2)])],
      },
      {
        phase: "Phase 4 · Interview Readiness & Applications",
        duration: `Weeks ${phaseWeeks * 3 + 1}–${totalWeeks}`,
        focus: "Convert proof of work into interviews and structured offers.",
        deliverables: [
          "Complete 3 timed mock interviews with structured mentor feedback",
          "Apply selectively to 15–20 well-matched roles with tailored project links",
          "Prepare compensation and equity negotiation notes using Career Atlas ranges",
        ],
        skills: ["Structured communication", "Portfolio presentation", "Offer evaluation"],
      },
    ],
    praxisAlignment: `Within the Praxis Apprenticeship, Phases 2 and 3 map directly to real client/team modules—giving you mentor code/workflow reviews and verifiable work samples before you enter the ${input.market} hiring pipeline.`,
  };
}

async function callGroq(prompt: string): Promise<string | null> {
  const apiKey = process.env.GROQ_API_KEY?.trim();
  if (!apiKey) return null;

  const model = process.env.GROQ_MODEL?.trim() || "llama-3.3-70b-versatile";
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "You output strictly valid JSON with no extra commentary.",
        },
        { role: "user", content: prompt },
      ],
    }),
    signal: AbortSignal.timeout(15_000),
  });

  if (!res.ok) return null;
  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  return data.choices?.[0]?.message?.content ?? null;
}

async function callGemini(prompt: string): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) return null;

  const model = process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.4,
        responseMimeType: "application/json",
      },
    }),
    signal: AbortSignal.timeout(15_000),
  });

  if (!res.ok) return null;
  const data = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload." },
      { status: 400 }
    );
  }

  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Please fill in your current background and target role.",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const input = parsed.data;
  const matchedRole = roles.find(
    (r) => r.roleCategory.toLowerCase() === input.targetRole.toLowerCase()
  );

  const prompt = buildPrompt(input, matchedRole);

  try {
    const raw = (await callGroq(prompt)) ?? (await callGemini(prompt));
    if (raw) {
      const cleaned = raw.replace(/^```json\s*|\s*```$/g, "").trim();
      const candidate = RoadmapResponseSchema.safeParse(JSON.parse(cleaned));
      if (candidate.success) {
        return NextResponse.json({
          roadmap: candidate.data,
          engine: "ai",
        });
      }
    }
  } catch {
    // Fall through to grounded deterministic plan
  }

  return NextResponse.json({
    roadmap: buildGroundedFallback(input, matchedRole),
    engine: "structured-template",
  });
}