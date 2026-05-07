import { SYSTEM_INSTRUCTION } from "../constants";
import { AnalysisResult } from "../types";

type AnalyzeRequestBody = {
  messages?: string[];
  imageBase64?: string;
  systemInstruction?: string;
};

function buildUserContent(messages: string[], imageBase64?: string) {
  const userContent: any[] = [
    {
      type: "text",
      text: `请分析以下聊天记录，判断是否为诈骗：\n${messages.join("\n")}`,
    },
  ];

  if (imageBase64) {
    userContent.push({
      type: "image_url",
      image_url: {
        url: `data:image/jpeg;base64,${imageBase64}`,
      },
    });
  }

  return userContent;
}

function extractJson(text: string) {
  const trimmed = text.trim();
  const fencedMatch = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return fencedMatch ? fencedMatch[1].trim() : trimmed;
}

export default async function handler(req: any, res: any) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const apiKey = process.env.SILICONFLOW_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Server is missing SILICONFLOW_API_KEY" });
  }

  let body: AnalyzeRequestBody;
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: "Invalid JSON body" });
  }

  const messages = Array.isArray(body?.messages) ? body.messages.filter(Boolean) : [];
  if (messages.length === 0) {
    return res.status(400).json({ error: "messages is required" });
  }

  try {
    const response = await fetch("https://api.siliconflow.cn/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-ai/DeepSeek-V3.2",
        messages: [
          {
            role: "system",
            content: body.systemInstruction || SYSTEM_INSTRUCTION || "你是一个反诈专家，分析聊天记录中的诈骗特征。",
          },
          {
            role: "user",
            content: buildUserContent(messages, body.imageBase64),
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.2,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(502).json({ error: "Upstream AI request failed", details: errorText });
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;

    if (!content || typeof content !== "string") {
      return res.status(502).json({ error: "Upstream AI response missing content" });
    }

    const parsed = JSON.parse(extractJson(content)) as AnalysisResult;
    return res.status(200).json({ result: parsed });
  } catch (error: any) {
    return res.status(500).json({
      error: "Analysis failed",
      details: error?.message || String(error),
    });
  }
}