# Orbit AI

Orbit is a focused AI workspace for turning half-formed thoughts into useful output. It combines a calm, keyboard-friendly interface with a small OpenAI-compatible API that can run in demo mode locally or connect to your preferred model provider.

## Highlights

- **Ask Orbit** with answer, draft, brainstorm, and summarize modes
- Prompt library with reusable starting points
- Persistent local activity feed and lightweight usage stats
- Responsive dark interface designed for focus, not dashboard noise
- Secure-by-default provider configuration through environment variables
- Tests for API health, validation, and demo mode

## Run locally

```bash
npm install
cp .env.example .env
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). Demo mode works without an API key. To use a provider, add `OPENAI_API_KEY` (and optionally `OPENAI_API_BASE` / `OPENAI_MODEL`) to `.env`.

## Scripts

- `npm run dev` — Vite UI + API server
- `npm run build` — production UI build
- `npm test` — API test suite
- `npm start` — API server only

## Architecture

`src/` contains the React UI and its stateful workspace experience. `server/index.js` is a dependency-light Node HTTP API that exposes `/api/ask` and `/api/health`, keeping provider credentials server-side. The browser talks to the API through Vite's `/api` proxy during development.

## License

MIT
