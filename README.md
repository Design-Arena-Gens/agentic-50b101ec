# n8n JSON Generator

Generate n8n workflow JSON from a natural language prompt.

- Next.js App Router
- API endpoint at `/api/generate`
- No external keys required

## Local

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Build

```bash
npm run build && npm start
```

## Deploy (Vercel)

```bash
vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-50b101ec
```
