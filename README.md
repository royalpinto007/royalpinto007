### Royal Simpson Pinto

AI engineer. I build agentic systems and the infrastructure to trust them: permission-aware retrieval, agent observability, human-in-the-loop approval, and evals that fail CI when behaviour regresses. Building continuously.

**Open source**: Google Summer of Code, Linux Foundation (LFX), and Symmetry Autumn of Code. 3+ years shipping in production.

#### Projects

**Agent infrastructure**
- [vaultrag](https://github.com/royalpinto007/vaultrag) — Permission-aware RAG: access control enforced inside the retrieval query, CI fails on any leak.
- [agentrace](https://github.com/royalpinto007/agentrace) — Observability for Claude Code subagents: flags the agent results you should not trust.
- [voiceeval](https://github.com/royalpinto007/voiceeval) — Evaluation for voice agents: catches the failures a text eval scores as a perfect call.
- [Tracecase](https://tracecase.agentpostmortem.com) — CI for AI agents: replay runs against prompt changes, catch regressions before they ship.
- [Bridgekit](https://bridgekit.agentpostmortem.com) — Scoped MCP server with per-client permission boundaries and an append-only audit log.
- [casebook-mcp](https://mcp.agentpostmortem.com) — Remote MCP server over AgentPostmortem, a public registry of real AI-agent failures.
- [casebook-chat](https://chat.agentpostmortem.com) — Streaming chat that investigates agent failures and answers with cited case IDs.

**Agents in production**
- [Resolvd](https://resolvd.agentpostmortem.com) — End-to-end inbox operator: auto-resolves within policy, escalates the rest with a proposed action.
- [Greenlite](https://greenlite.agentpostmortem.com) — Approve your agents from your phone: one-tap human-in-the-loop for escalations.
- [Webhands](https://webhands.agentpostmortem.com) — Computer-use agent for tools with no API: refuses any write unless you confirm it.
- [relayg](https://relayg.agentpostmortem.com) — Support triage as a LangGraph state machine, paused mid-run by a human-in-the-loop interrupt.
- [AgentPostmortem](https://agentpostmortem.com) — Every AI agent failure, documented: a public case registry.

**Products**
- [SignalizeAI](https://github.com/royalpinto007/signalizeai) — An extension for agentic signal analysis.
- [PennyRush](https://pennyrush.agentpostmortem.workers.dev) — A private money hub: receipts and statements parsed in memory, only extracted fields stored.
- [ProofClip](https://proofclip.agentpostmortem.com) — Testimonial walls and social-proof cards for creators and small SaaS, embedded with one script tag.

**Roots**
- [cpp](https://github.com/royalpinto007/cpp) — The code I wrote while learning C++ at the very start, kept detailed on purpose: datatypes through graphs and DP.

📫 royalpinto007@gmail.com
