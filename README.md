# bankr-router-claude-plugin

**Seamless Bankr LLM Gateway routing and smart model selection for Claude Code.**

Routes Claude Code through the [Bankr LLM Gateway](https://docs.bankr.bot/llm-gateway/overview) (`llm.bankr.bot`) with native smart model selection.

---

## Why this plugin?

- **Smart Model Selection**: Automatically routes prompts to the best model (Claude, Gemini, GPT, Kimi, Qwen) based on Bankr's intelligent model selector.
- **Unified Proxy**: Acts as a local smart proxy running on `http://127.0.0.1:8787`.
- **Zero-Config Routing**: If your `ANTHROPIC_BASE_URL` is already configured for the Bankr Gateway, this plugin adds the intelligent "model-switching" layer on top.
- **Dependency-free**: No extra daemon processes required—the routing logic is embedded.

---

## Installation

### Via Plugin Registry
```bash
/plugin install github:tachikomared/bankr-router-claude-plugin
```

### Local Development
```bash
claude --plugin-dir ./bankr-router-claude-plugin
```

---

## Intelligent Routing (What it does)

The `bankr-router` (embedded in this plugin) intelligently parses your Claude Code prompts and automatically selects the optimal provider:

1. **Context-Aware**: Routes standard coding tasks to the best available Claude/Gemini model.
2. **Cost/Performance**: Automatically switches to OpenRouter (GPT/Kimi/Qwen) for specific tasks to optimize performance vs. cost.
3. **Automatic Fallback**: If a primary route fails, the router seamlessly falls back to pre-configured backups.

### How it compares to raw Gateway configuration

| Feature | Raw Gateway Config | With Bankr Router Plugin |
|---|---|---|
| Routing | Static (all to one) | **Intelligent (Per-Prompt)** |
| Model Choice | Manual | **Automated** |
| Fallback | None | **Automatic** |

---

## Configuration

Set your credentials via the setup command:

```bash
/bankr:setup bk_YOUR_API_KEY
```

Once set, ensure your Claude Code environment uses the router as its base URL:

```bash
export ANTHROPIC_BASE_URL=http://127.0.0.1:8787
```

---

## Architecture

```
Claude Code
    │
    ▼  (Plugin Logic)
    │  Picks model per-prompt
    │  Injects BK_API_KEY
    ▼
llm.bankr.bot (Bankr LLM Gateway)
    │
    ├── Vertex AI (Claude, Gemini)
    └── OpenRouter (GPT, Kimi, Qwen + fallback)
```

---

## Links

- Bankr LLM Gateway: https://docs.bankr.bot/llm-gateway/overview
- Core Router Repo: https://github.com/tachikomared/bankr-router
- API key: https://bankr.bot/api
