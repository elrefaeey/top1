import type { AiChatMessage, AiGenerateResult, AiProviderName } from "@/lib/seo/ai/types";

function env(name: string): string {
  return (process.env[name] ?? "").trim();
}

export function resolveAiProviderName(): AiProviderName {
  const forced = env("SEO_AI_PROVIDER").toLowerCase();
  if (forced === "openai" || forced === "anthropic" || forced === "template") {
    return forced;
  }
  if (env("OPENAI_API_KEY")) return "openai";
  if (env("ANTHROPIC_API_KEY")) return "anthropic";
  return "template";
}

export function hasLlmConfigured(): boolean {
  const name = resolveAiProviderName();
  return name === "openai" || name === "anthropic";
}

async function generateOpenAi(messages: AiChatMessage[]): Promise<string> {
  const apiKey = env("OPENAI_API_KEY");
  if (!apiKey) throw new Error("OPENAI_API_KEY غير مُعد على السيرفر");
  const model = env("OPENAI_MODEL") || "gpt-4o-mini";

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.55,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    }),
  });

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
    error?: { message?: string };
  };

  if (!res.ok) {
    throw new Error(data.error?.message || `OpenAI فشل (${res.status})`);
  }

  const text = data.choices?.[0]?.message?.content?.trim() ?? "";
  if (!text) throw new Error("OpenAI أعاد رداً فارغاً");
  return text;
}

async function generateAnthropic(messages: AiChatMessage[]): Promise<string> {
  const apiKey = env("ANTHROPIC_API_KEY");
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY غير مُعد على السيرفر");
  const model = env("ANTHROPIC_MODEL") || "claude-3-5-haiku-latest";

  const system = messages
    .filter((m) => m.role === "system")
    .map((m) => m.content)
    .join("\n\n");
  const userMessages = messages.filter((m) => m.role !== "system");

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model,
      max_tokens: 4096,
      temperature: 0.55,
      system: system || undefined,
      messages: userMessages.map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      })),
    }),
  });

  const data = (await res.json()) as {
    content?: Array<{ type?: string; text?: string }>;
    error?: { message?: string };
  };

  if (!res.ok) {
    throw new Error(data.error?.message || `Anthropic فشل (${res.status})`);
  }

  const text = (data.content ?? [])
    .filter((c) => c.type === "text" && c.text)
    .map((c) => c.text!)
    .join("\n")
    .trim();
  if (!text) throw new Error("Anthropic أعاد رداً فارغاً");
  return text;
}

/**
 * Provider-agnostic text generation. Never logs API keys.
 * Falls back to empty string only when caller handles template mode.
 */
export async function generateAiText(messages: AiChatMessage[]): Promise<AiGenerateResult> {
  const provider = resolveAiProviderName();
  if (provider === "openai") {
    return { text: await generateOpenAi(messages), provider };
  }
  if (provider === "anthropic") {
    return { text: await generateAnthropic(messages), provider };
  }
  throw new Error("SEO_AI_PROVIDER=template — استخدم مولّد القوالب بدلاً من LLM");
}
