import { NextRequest } from "next/server";
import { generateWorkflowFromPrompt } from "@/lib/generator";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const prompt: string = String(body?.prompt ?? "");
  const name: string = String(body?.name ?? "Generated Workflow");
  if (!prompt.trim()) {
    return new Response(JSON.stringify({ error: "prompt is required" }), { status: 400 });
  }
  const workflow = generateWorkflowFromPrompt(prompt, name);
  return new Response(JSON.stringify(workflow), { headers: { "Content-Type": "application/json" } });
}
