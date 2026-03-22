---
description: "Start, stop, or restart the local bankr-router smart proxy for Claude Code. Usage: /bankr:router [start|stop|restart|install]"
---

# /bankr:router

Manage the local **bankr-router** smart model selection proxy.

$ARGUMENTS

## Actions

- `start` — start the router in background (`node dist/index.js &`)
- `stop` — find and kill the router process on port 8787
- `restart` — stop then start
- `install` — clone, build, and configure bankr-router from scratch

## Router repo

https://github.com/tachikomared/bankr-router

The router runs on `http://127.0.0.1:8787` and automatically picks the best Bankr model per prompt. Set `ANTHROPIC_BASE_URL=http://127.0.0.1:8787` to route Claude Code through it.
