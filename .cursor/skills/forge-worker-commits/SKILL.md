---
name: forge-worker-commits
description: Commit as a named .cursor worker. Never add Made with Cursor or Cursor co-author trailers. Use when committing bifrost-portal work.
---

# Worker commits

Do not add `Made with [Cursor](https://cursor.com)`.
Do not add `Co-authored-by: Cursor <cursoragent@cursor.com>`.

Every commit ends with a worker trailer. Pick the worker that did the change from `.cursor/workers/`.

```
Worker: cms-ui
```

| Worker | Owns |
|--------|------|
| `cms-live` | Presence, chat, health socket, live location |
| `cms-ui` | Portal chrome, Marketing, Settings, Users, topbar |
| `cms-docs` | CHANGELOG, Jira copy, 1.1.1x notes |
| `cms-reviewer` | `/bifrost-code-review` fixes |
