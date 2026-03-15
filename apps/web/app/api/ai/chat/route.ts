// ─── AI Chat Streaming Endpoint ──────────────────────────
// Vercel AI SDK streaming for debrief conversations

import { type NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { MAX_DEBRIEF_MESSAGES } from "@efektif/shared";
import type { Locale, TestType, TestScores } from "@efektif/shared";
import { getModelForTask, getMaxTokensForTask } from "@efektif/ai/models";
import { buildDebriefSystemPrompt, buildDebriefOpeningPrompt } from "@efektif/ai/prompts/debrief";
import { determineProfile, type CameleonProfile } from "@efektif/ai/prompts/cameleon";

const anthropic = new Anthropic();

interface ChatRequestBody {
  messages: { role: "user" | "assistant"; content: string }[];
  testType: TestType;
  scores: TestScores;
  locale: Locale;
  studentName: string;
  schoolLevel?: string | null;
  birthDate?: string | null;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ChatRequestBody;
    const { messages, testType, scores, locale, studentName, schoolLevel, birthDate } = body;

    const userMessageCount = messages.filter((m) => m.role === "user").length;
    if (userMessageCount > MAX_DEBRIEF_MESSAGES) {
      return NextResponse.json({ error: "Maximum debrief messages reached" }, { status: 400 });
    }

    const profile: CameleonProfile = determineProfile(
      birthDate ? new Date(birthDate) : null,
      schoolLevel ?? null,
    );

    const isOpening = messages.length === 0;
    const taskType = isOpening ? "debrief_opening" : "debrief_continue";
    const model = getModelForTask(taskType);
    const maxTokens = getMaxTokensForTask(taskType);

    const systemPrompt = buildDebriefSystemPrompt(testType, scores, studentName, profile, locale);

    const anthropicMessages = isOpening
      ? [{ role: "user" as const, content: buildDebriefOpeningPrompt(testType, scores, locale) }]
      : messages.map((m) => ({ role: m.role, content: m.content }));

    const stream = anthropic.messages.stream({
      model,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: anthropicMessages,
    });

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(`0:${JSON.stringify(event.delta.text)}\n`));
          }
        }
        controller.close();
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "X-Vercel-AI-Data-Stream": "v1",
      },
    });
  } catch (error) {
    console.error("[AI Chat Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
