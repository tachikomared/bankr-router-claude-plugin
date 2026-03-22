---
name: bankr-router-status
description: >
  Check the health and status of the Bankr LLM Gateway and local bankr-router proxy
  for Claude Code. Use this skill when the user asks if Bankr is working, wants to
  check their router status, sees connection errors, wants to restart the router,
  or wants to verify their credits and current model routing. Triggers on: "is bankr
  working", "check gateway", "router status", "bankr health", "restart router",
  "bankr not working", "check credits", "which model is bankr using".
---

# Bankr Router Status Check

Run these in sequence to diagnose the full stack.

## 1. Gateway health (no auth needed)

```bash
curl -s https://llm.bankr.bot/health | python3 -m json.tool
```

All three providers should show `true`. If all are `false`, check https://bankr.bot for outages.

## 2. API key validity

```bash
curl -s -o /dev/null -w "HTTP %{http_code}\n" \
  https://llm.bankr.bot/v1/models \
  -H "X-API-Key: $ANTHROPIC_API_KEY"
```

- `200` = key works
- `401` = bad key or LLM Gateway disabled at https://bankr.bot/api

## 3. Local router health (if using bankr-router)

```bash
curl -s http://127.0.0.1:8787/health
```

If this fails: router is not running. Start it:

```bash
cd ~/bankr-router && node dist/index.js &
```

## 4. Check which URL Claude Code is hitting

```bash
echo "Base URL: $ANTHROPIC_BASE_URL"
echo "Key prefix: ${ANTHROPIC_API_KEY:0:10}..."
```

- Direct: `https://llm.bankr.bot`
- Via router: `http://127.0.0.1:8787`

## 5. Check credits

```bash
# With Bankr CLI installed:
bankr llm credits

# Or via API:
curl -s "https://llm.bankr.bot/v1/usage?days=1" \
  -H "X-API-Key: $ANTHROPIC_API_KEY" | python3 -m json.tool
```

## 6. Quick end-to-end test

```bash
curl -s -X POST https://llm.bankr.bot/v1/messages \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $ANTHROPIC_API_KEY" \
  -d '{"model":"claude-haiku-4.5","max_tokens":32,"messages":[{"role":"user","content":"ping"}]}' \
  | python3 -m json.tool
```

A successful response confirms the full chain is working.

## Common fixes

| Symptom | Fix |
|---|---|
| Router PID unknown | `lsof -i :8787` to find it, `kill <PID>` to stop |
| Router crashes on start | `cd ~/bankr-router && npm run build` to rebuild |
| Credits at zero | https://bankr.bot/llm?tab=credits |
| Wrong base URL in session | Re-export: `export ANTHROPIC_BASE_URL=http://127.0.0.1:8787` |
