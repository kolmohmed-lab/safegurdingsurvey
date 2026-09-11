import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const webhook = process.env.SURVEY_WEBHOOK_URL;

    if (!webhook) {
      return NextResponse.json({ error: "Submission endpoint is not configured." }, { status: 503 });
    }

    const response = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        survey: "Safeguarding Survey",
        school: "Dalian American International School",
        ...payload,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Submission service rejected the response." }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
  }
}
