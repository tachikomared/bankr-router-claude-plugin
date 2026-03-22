# bankr-router-claude-plugin

**Seamless Bankr LLM Gateway routing and smart model selection for Claude Code.**

Routes Claude Code through the [Bankr LLM Gateway](https://docs.bankr.bot/llm-gateway/overview) (`llm.bankr.bot`) with native smart model selection.

---

## Why this plugin?

- **Local-first routing**: Embeds the smart model selector directly into Claude Code.
- **Dependency-free**: No extra daemon processes required.
- **Auto-Bankr**: Simplified configuration for the Bankr LLM Gateway.
- **Open Source**: Free and community-driven.

---

## Installation

### Via Plugin Registry
```bash
/plugin marketplace add tachikomared/bankr-router-claude-plugin
/plugin install bankr-router-claude-plugin
```

### Local Development
```bash
claude --plugin-dir ./bankr-router-claude-plugin
```

---

## Features

### Smart Routing
Automatically routes prompts to the best model (Claude, Gemini, GPT, Kimi, Qwen) based on Bankr's intelligent model selector.

### Slash Commands
| Command | Description |
|---|---|
| `/bankr:setup [key]` | Configure your Bankr gateway credentials. |
| `/bankr:status` | Check gateway latency and active route. |

---

## Configuration

Set your credentials via the setup command:

```bash
/bankr:setup bk_YOUR_API_KEY
```

---

## How it works

```
Claude Code
    │
    ▼  (Plugin Logic)
    │  Picks model per-prompt
    │  Forwards with your bk_ key
    ▼
llm.bankr.bot (Bankr LLM Gateway)
    │
    ├── Vertex AI (Claude, Gemini)
    └── OpenRouter (GPT, Kimi, Qwen + fallback)
```

---

## Contributing

Pull requests are welcome. This plugin is standalone—maintained specifically for the Claude Code ecosystem.

## Links

- Bankr LLM Gateway: https://docs.bankr.bot/llm-gateway/overview
- API key: https://bankr.bot/api
- Credits: https://bankr.bot/llm
