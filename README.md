# Bifrost Portal

Public documentation site for the ForgeStack CMS. Separate from the CMS admin.

- Pink accent `#EA0A8E` on docs chrome
- Bear, Compass, Synapse, Grid Table, Lingo, Anvil
- Docs, API Explorer (Postman export), MCP, Figma MCP, demo, Ask AI
- Dark mode via Bear

## Sprint

Portal sprint **1.0.0** (`release/1.0.0`). Tickets: CMS-127 epic, CMS-128 chrome, CMS-129 API Explorer, CMS-130 docs.

## Local

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local`. Put `OPENAI_API_KEY` and `FIGMA_ACCESS_TOKEN` there when you enable live Ask AI or Figma MCP. Never commit tokens.

Copy `.cursor/mcp.json.example` to Cursor MCP settings. The Figma remote MCP uses `https://mcp.figma.com/mcp` — authenticate in Cursor, do not put a Figma token in git.

## Install as CMS content

After Bifrost installment, this site can be hosted as a Bifrost collection. Until then it is a standalone Vite app.
