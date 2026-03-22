---
description: "Check the health of the Bankr LLM Gateway, local bankr-router, API key validity, and credit balance. Usage: /bankr:status"
---

# /bankr:status

Diagnose the full Bankr stack for Claude Code.

Runs all checks from the `bankr-router-status` skill:
- Gateway health at `llm.bankr.bot`
- API key validity
- Local router at `127.0.0.1:8787` (if configured)
- Credit balance
- End-to-end request test

Reports what's working and what needs fixing.
