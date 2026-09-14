import { NextResponse } from "next/server";

type IncomingPayload = {
  language?: string;
  answers?: Record<string, string>;
  details?: Record<string, string>;
  suggestion?: string;
  submittedAt?: string;
};

function labelLanguage(language?: string) {
  return language === "zh" ? "中文" : "English";
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as IncomingPayload;
    const webhook = process.env.SURVEY_WEBHOOK_URL;

    if (!webhook) {
      return NextResponse.json(
        { error: "Submission endpoint is not configured." },
        { status: 503 }
      );
    }

    const answers = payload.answers ?? {};
    const details = payload.details ?? {};
    const submittedAt = payload.submittedAt || new Date().toISOString();
    const submissionId = `SG-${Date.now()}`;

    const powerAutomatePayload = {
      submissionId,
      submittedAt,
      language: labelLanguage(payload.language),
      greetedSignedIn: answers.q1 || "",
      visitorBadge: answers.q2 || "",
      campusSafety: answers.q3 || "",
      unsafeArea: answers.q4 || "",
      unsafeAreaDetails: details.q4 || "",
      concerningBehaviour: answers.q5 || "",
      concernDetails: details.q5 || "",
      staffAvailable: answers.q6 || "",
      overallExperience: answers.q7 || "",
      safetySuggestions: payload.suggestion || "",
    };

    const response = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(powerAutomatePayload),
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      console.error("Power Automate rejected submission", response.status, errorText);
      return NextResponse.json(
        { error: "Submission service rejected the response." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true, submissionId });
  } catch (error) {
    console.error("Invalid survey submission", error);
    return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
  }
}
