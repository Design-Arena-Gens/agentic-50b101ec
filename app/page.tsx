"use client";

import { useCallback, useMemo, useState } from "react";

export default function HomePage() {
  const [name, setName] = useState("Generated Workflow");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);

  const canGenerate = useMemo(() => prompt.trim().length > 0, [prompt]);

  const onGenerate = useCallback(async () => {
    if (!canGenerate || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, name }),
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const data = await res.json();
      setResult(data);
    } catch (e: any) {
      setError(e?.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [canGenerate, loading, prompt, name]);

  const onCopy = useCallback(async () => {
    if (!result) return;
    await navigator.clipboard.writeText(JSON.stringify(result, null, 2));
  }, [result]);

  const onDownload = useCallback(() => {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name || "workflow"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [result, name]);

  return (
    <main>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>n8n JSON Generator</h1>
      <p style={{ opacity: 0.85, marginBottom: 24 }}>Turn a natural language prompt into an n8n workflow JSON.</p>

      <div style={{
        display: "grid",
        gap: 16,
        gridTemplateColumns: "1fr",
        marginBottom: 24,
      }}>
        <label style={{ display: "grid", gap: 8 }}>
          <span style={{ fontSize: 14, opacity: 0.9 }}>Workflow name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My workflow"
            style={{
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "#0f1630",
              color: "#eef2ff",
              padding: "12px 14px",
              outline: "none",
            }}
          />
        </label>

        <label style={{ display: "grid", gap: 8 }}>
          <span style={{ fontSize: 14, opacity: 0.9 }}>Prompt</span>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={"e.g. When a webhook receives a request, call https://api.example.com/users, if status is 200 set a field and respond to the webhook with the JSON."}
            rows={8}
            style={{
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "#0f1630",
              color: "#eef2ff",
              padding: "12px 14px",
              outline: "none",
              resize: "vertical",
            }}
          />
        </label>

        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={onGenerate}
            disabled={!canGenerate || loading}
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.12)",
              background: canGenerate && !loading ? "#6366f1" : "#2a2f5a",
              color: "white",
              cursor: canGenerate && !loading ? "pointer" : "not-allowed",
              fontWeight: 600,
            }}
          >
            {loading ? "Generating..." : "Generate JSON"}
          </button>
          <button
            onClick={onCopy}
            disabled={!result}
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.12)",
              background: result ? "#334155" : "#2a2f5a",
              color: "white",
              cursor: result ? "pointer" : "not-allowed",
              fontWeight: 600,
            }}
          >Copy</button>
          <button
            onClick={onDownload}
            disabled={!result}
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.12)",
              background: result ? "#334155" : "#2a2f5a",
              color: "white",
              cursor: result ? "pointer" : "not-allowed",
              fontWeight: 600,
            }}
          >Download</button>
        </div>

        {error && (
          <div style={{ color: "#fecaca" }}>Error: {error}</div>
        )}

        {result && (
          <div style={{
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 8,
            overflow: "hidden",
          }}>
            <div style={{
              padding: "8px 12px",
              background: "#0f1630",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              fontSize: 13,
              opacity: 0.85,
            }}>Generated JSON</div>
            <pre style={{ margin: 0, padding: 16, background: "#0b1020", overflowX: "auto" }}>
{JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <div style={{ opacity: 0.7, fontSize: 12, lineHeight: 1.5 }}>
        Tip: Mention triggers like "webhook" or "cron", actions like "HTTP request", "set", "if", "code", "respond", or integrations like "email" and "slack". URLs will be auto-detected.
      </div>
    </main>
  );
}
