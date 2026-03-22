---
description: "Auto Bankr + Bankr Smart Router full setup for Claude Code. Configures the Bankr LLM Gateway and optionally installs bankr-router. Usage: /bankr:setup [your-bk-api-key]"
---

# /bankr:setup

Run the full **Auto Bankr + Smart Router** setup for Claude Code.

$ARGUMENTS

## What this does

1. Configures `ANTHROPIC_BASE_URL=https://llm.bankr.bot` and `ANTHROPIC_API_KEY` in your shell profile
2. Validates your API key against the gateway
3. (Optional) Clones, builds, and wires up `bankr-router` as a local smart model selector
4. (Optional) Installs the `bankr-agent` Claude Code plugin for DeFi/trading tools

## How to use

If you passed your key as an argument above, Claude will use it directly.
If not, Claude will ask for it before proceeding.

Follow the `bankr-setup` skill — it walks through all steps interactively.

**Need a key?** → https://bankr.bot/api (enable LLM Gateway on the key)
**Need credits?** → https://bankr.bot/llm?tab=credits
