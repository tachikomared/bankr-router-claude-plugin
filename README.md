# bankr-router-claude-plugin

**The intelligent routing layer for Claude Code.**

Enhance your Claude Code experience with the full power of the [Bankr LLM Gateway](https://docs.bankr.bot/llm-gateway/overview). This plugin doesn't just proxy your requests; it embeds the **Bankr Smart Router engine** directly into your workflow to optimize every single prompt for model quality, latency, and cost.

---

## Why this plugin?

Most Claude Code configurations route everything to a single static model. This plugin changes that by injecting a **real-time decision engine** between Claude Code and the LLM Gateway.

- **Per-Prompt Intelligence**: Every single request is analyzed for "code-heaviness," tool-use requirements, and structure (JSON/YAML) before a model is selected.
- **Smart Model Reranking**: Automatically prioritizes the highest-performing models for the specific task at hand (e.g., routing complex TypeScript refactors to `qwen3-coder` or `claude-sonnet-4.6`).
- **Cost-Optimized**: Automatically favors more efficient models (e.g., `gpt-5-mini`, `gemini-3.1-flash-lite`) when the task complexity allows, saving your credits without sacrificing output quality.
- **Dependency-Free**: The entire intelligence engine is embedded within the plugin. No extra background daemons, no local proxy ports to manage.

---

## How it works: The "Smart Brain"

The plugin embeds the core `bankr-router` engine, which performs a multi-stage analysis on every outgoing request:

1. **Tier Classification**: Classifies your prompt into `SIMPLE`, `MEDIUM`, `COMPLEX`, or `REASONING` tiers based on real-time token estimation and rule-based signals.
2. **Affinity Scoring**: Uses a proprietary signal detector (detecting patterns like `dockerfile`, `stack trace`, `unit test`) to identify "Code-Heavy" prompts.
3. **Dynamic Reranking**:
   - **Code Affinity**: Prioritizes code-specialized models like `qwen3-coder` or `deepseek-v3.2` for programming tasks.
   - **Tool/Structured Output**: Detects JSON/YAML requirements and routes to models with the highest structured-output reliability (e.g., `claude-sonnet-4.6`, `gpt-5.4`).
4. **Cost-Efficiency**: Calculates a real-time `savings` score by comparing the cost of the chosen model against a high-cost baseline, ensuring you always get the best value for your tokens.

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

## Quick Configuration

1. Install the plugin.
2. Configure your API key:
   ```bash
   /bankr:setup bk_YOUR_API_KEY
   ```
3. Set your base URL to the Bankr Gateway (the plugin intercepts this):
   ```bash
   export ANTHROPIC_BASE_URL=https://llm.bankr.bot
   ```

Claude Code will now automatically route every prompt through the **Smart Router Engine** before reaching the gateway.

---

## Architecture

```
Claude Code
    │
    ▼  (Plugin Logic)
    │  [Per-Prompt Analysis Engine]
    │  1. Tier & Code Classification
    │  2. Dynamic Model Reranking
    │  3. Token & Cost Optimization
    ▼
llm.bankr.bot (Bankr LLM Gateway)
    │
    ├── Vertex AI (Claude, Gemini)
    └── OpenRouter (GPT, Kimi, Qwen + fallback)
```

---

## Contributing & Links

- **Core Router Intelligence**: [bankr-router repository](https://github.com/tachikomared/bankr-router)
- **Bankr LLM Gateway Docs**: [https://docs.bankr.bot/llm-gateway/overview](https://docs.bankr.bot/llm-gateway/overview)
- **API Key Console**: [https://bankr.bot/api](https://bankr.bot/api)
