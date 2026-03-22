---
name: bankr-setup
description: >
  Auto Bankr + Bankr Smart Router setup for Claude Code. Use this skill whenever
  the user wants to configure Claude Code to use the Bankr LLM Gateway, set up the
  bankr-router smart proxy, install the bankr-agent Claude Code plugin, check their
  Bankr LLM credits, troubleshoot gateway connectivity, or switch Claude Code's
  backend to llm.bankr.bot. Triggers on: "bankr", "bankr gateway", "bankr router",
  "llm.bankr.bot", "bk_ key", "bankr credits", "bankr setup", "route claude code
  through bankr", "smart router", "bankr-agent plugin".
---

# Auto Bankr + Bankr Smart Router — Claude Code Setup

This skill handles two things:
1. **Auto Bankr** — configure Claude Code to route through `llm.bankr.bot` (env vars, validation)
2. **Bankr Smart Router** — optionally install and wire `bankr-router` (local model-selection proxy)

---

## Prerequisites checklist

Before starting, confirm the user has:
- [ ] A Bankr API key (`bk_...`) — get one at https://bankr.bot/api
- [ ] LLM Gateway toggled ON for that key (in key settings)
- [ ] Credits loaded: https://bankr.bot/llm?tab=credits
- [ ] Node.js 20+ (for the smart router)

If the user doesn't have a key yet, send them to https://bankr.bot/api first and pause.

---

## Part 1 — Auto Bankr (always do this first)

Claude Code speaks native Anthropic API format. Bankr's gateway is a drop-in replacement — just two env vars:

```bash
export ANTHROPIC_BASE_URL=https://llm.bankr.bot
export ANTHROPIC_API_KEY=bk_YOUR_KEY
```

### Step 1a — Detect current shell profile

```bash
# Check which profile file to use
echo "Shell: $SHELL"
ls -1 ~/.bashrc ~/.zshrc ~/.profile 2>/dev/null | head -5
```

Use whichever exists: `~/.zshrc` → `~/.bashrc` → `~/.profile`.

### Step 1b — Write env vars to profile

```bash
# Remove any previous Bankr block (idempotent)
sed -i.bak '/# ── Bankr LLM Gateway/,/# ──────────────/d' ~/.zshrc 2>/dev/null || true

# Append the new block
cat >> ~/.zshrc << 'EOF'

# ── Bankr LLM Gateway for Claude Code ──────────
export ANTHROPIC_BASE_URL=https://llm.bankr.bot
export ANTHROPIC_API_KEY=bk_YOUR_KEY_HERE
# ───────────────────────────────────────────────
EOF

echo "✓ Written. Now run: source ~/.zshrc"
```

Ask the user for their actual `bk_...` key and substitute it before running.

### Step 1c — Validate the key works

```bash
curl -s -o /dev/null -w "HTTP %{http_code}" \
  https://llm.bankr.bot/v1/models \
  -H "X-API-Key: $ANTHROPIC_API_KEY"
# Expect: HTTP 200
```

If 401 → key is wrong or LLM Gateway not enabled at https://bankr.bot/api.
If 402 → credits are empty, top up at https://bankr.bot/llm?tab=credits.

### Step 1d — Quick smoke test with Claude Code

```bash
source ~/.zshrc
claude -p "say hello" --model claude-sonnet-4.6
```

If this returns a response, Auto Bankr is live. Done for Part 1.

---

## Part 2 — Bankr Smart Router (optional, but recommended)

The smart router (`bankr-router`) is a local HTTP server that receives Claude Code's requests and picks the best Bankr model automatically based on the prompt. Inference still goes through Bankr — the router just decides *which* model.

Source: https://github.com/tachikomared/bankr-router

### Step 2a — Clone and build

```bash
git clone https://github.com/tachikomared/bankr-router ~/bankr-router
cd ~/bankr-router
npm install
npm run build
```

### Step 2b — Test the router binary

```bash
cd ~/bankr-router
node dist/index.js &
sleep 1
curl -s http://127.0.0.1:8787/health
# Expect: {"status":"ok"} or similar
kill %1
```

### Step 2c — Point Claude Code at the router

Override the base URL to the local router instead of `llm.bankr.bot` directly:

```bash
# In ~/.zshrc (replace the earlier block, or add below it):
export ANTHROPIC_BASE_URL=http://127.0.0.1:8787
export ANTHROPIC_API_KEY=bk_YOUR_KEY_HERE
# The router forwards to llm.bankr.bot using your key
```

### Step 2d — Start the router before using Claude Code

```bash
# One-liner to start router in background:
cd ~/bankr-router && node dist/index.js &
echo "Router PID: $! — running on http://127.0.0.1:8787"
```

Or add a shell alias for convenience:

```bash
echo "alias bankr-router='cd ~/bankr-router && node dist/index.js'" >> ~/.zshrc
```

Then: `bankr-router &` before launching Claude Code.

### Step 2e — Verify end-to-end

```bash
curl -s http://127.0.0.1:8787/health
# Then launch:
claude -p "say hello"
```

---

## Part 3 — Install bankr-agent Claude Code plugin (bonus)

The `bankr-agent` plugin gives Claude Code live crypto trading, price queries, and Polymarket integration:

```
# In a Claude Code session:
/plugin marketplace add BankrBot/claude-plugins
/plugin install bankr-agent
```

Then try:
```
"what is the price of ETH?"
"buy $10 of BNKR on base"
```

This is separate from the gateway setup — it adds DeFi tools, not LLM routing.

---

## Credit management

```bash
bankr llm credits                     # check balance
bankr llm credits add 25              # add $25 USDC
bankr llm credits auto --enable \
  --amount 25 --threshold 5 \
  --tokens USDC                       # auto top-up
```

Or manage at https://bankr.bot/llm?tab=credits.

---

## Supported models (use with `--model` flag or in settings)

| Model | Use case |
|---|---|
| `claude-opus-4.6` | Complex reasoning, architecture |
| `claude-sonnet-4.6` | Balanced default |
| `claude-haiku-4.5` | Fast, cheap tasks |
| `gemini-3-pro` | 2M context window |
| `gpt-5.2-codex` | Code generation |
| `kimi-k2.5` | Long context reasoning |
| `qwen3-coder` | Code debugging |

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `401 Unauthorized` | Key missing `bk_` prefix or LLM Gateway not enabled at https://bankr.bot/api |
| `402` / credits error | Top up at https://bankr.bot/llm?tab=credits |
| Router not starting | Port 8787 in use → kill the process or set a different port |
| `model not found` | Use exact IDs like `claude-opus-4.6`, not `claude-3-opus` |
| Router bypassed | Check `ANTHROPIC_BASE_URL` — must be `http://127.0.0.1:8787` not `llm.bankr.bot` |
| Claude Code ignoring env vars | Run `source ~/.zshrc` and relaunch `claude` |
