export const metadata = {
  title: "n8n JSON Generator",
  description: "Generate n8n workflow JSON from natural language prompts",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{
        margin: 0,
        fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, Apple Color Emoji, Segoe UI Emoji",
        background: "#0b1020",
        color: "#eef2ff",
      }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px 16px" }}>
          {children}
        </div>
      </body>
    </html>
  );
}
