# Dishtail MCP server (API-key argument auth)

Expose Dishtail's recipe tools over MCP so Claude Code can call them, using a shared API key passed as a tool argument instead of OAuth.

## What gets built

An MCP server built with the `@lovable.dev/mcp-js` SDK, authored under `src/lib/mcp/` and compiled by a Vite plugin into a backend function served over HTTP at the app's `/mcp` endpoint (full URL: the backend functions host + `/mcp`; Claude Code connects to it as an HTTP MCP server).

### Auth model

- No OAuth, no login. The endpoint itself is open, and each tool takes a required `api_key` string argument.
- The key is compared server-side against a securely stored backend secret (`MCP_API_KEY`), using a constant-time comparison. Wrong or missing key returns an auth error before any work is done.
- The secret is generated and stored in the backend secret store — never committed to the codebase, never returned by any tool. It is shown to you once so you can paste it into Claude Code's MCP config.
- Shared validation lives in one helper (`src/lib/mcp/auth.ts`) so every tool enforces it identically.

### Tools exposed

1. `search_recipes` — ingredients (required), optional cuisine and serving size; returns matching recipes with ingredients, steps, prep time, diet type.
2. `analyze_nutrition` — takes a recipe title + ingredient list and a serving size; returns the nutrition breakdown.

Both reuse the existing AI-backed logic already in the app's `search-recipes` and `analyze-nutrition` functions.

### Important limitation on saved recipes

A shared API key identifies the caller as "whoever holds the key", not as a specific Dishtail user. Saved recipes are per-user and protected by row-level security, so they cannot be read or written safely through a shared-key tool. This plan therefore leaves saved-recipe tools out. If you want Claude Code to read or save your recipes, that needs the OAuth path (each caller signs in as a real user) — say the word and I'll plan that instead or in addition.

## Technical notes

- Install `@lovable.dev/mcp-js`; add `mcpPlugin()` to `vite.config.ts` (existing plugins untouched).
- Files: `src/lib/mcp/index.ts` (server definition: name `dishtail`, title `Dishtail`, instructions), `src/lib/mcp/auth.ts` (key check), `src/lib/mcp/tools/search-recipes.ts`, `src/lib/mcp/tools/analyze-nutrition.ts`. Zod schemas for input validation.
- Nutrition logic currently requires a signed-in user in its function; the MCP tool will call the AI gateway directly from the tool handler instead of proxying that JWT-protected function, so the existing app behaviour is unchanged.
- The generated backend function is registered with JWT verification disabled (auth is the `api_key` argument), then deployed.
- Secrets read lazily inside handlers so the module stays import-safe.
- Add a favicon if none exists, so the connector shows the app icon.
- After the change: regenerate the MCP manifest and deploy the function.

## Verification

- List tools over HTTP and confirm both appear.
- Call a tool with a wrong key (expect auth error) and with the correct key (expect recipes).
- Provide the exact Claude Code MCP config snippet with the endpoint URL.
