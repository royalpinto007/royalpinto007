### Royal Simpson Pinto

AI engineer. I build agentic systems and the infrastructure to trust them: permission-aware retrieval, agent observability, human-in-the-loop approval, and evals that fail CI when behaviour regresses. Building continuously.

**Open source**: Google Summer of Code, Linux Foundation (LFX), and Symmetry Autumn of Code. 3+ years shipping in production.

#### Projects

**Agent infrastructure**
- [Tenantq](https://github.com/royalpinto007/Tenantq): Multi-tenant hybrid search on Qdrant: payload tenant isolation, dense+sparse RRF, HNSW tuning, and benchmarks.
- [VaultRAG](https://github.com/royalpinto007/VaultRAG): Permission-aware RAG: access control enforced inside the retrieval query, CI fails on any leak.
- [MCP-audit](https://github.com/royalpinto007/MCP-audit): Security scanner for MCP servers: 18 rules, SARIF output, `npx mcp-audit <target>`.
- [Skill-audit](https://github.com/royalpinto007/Skill-audit): Security scanner for agent skills: 31 rules, prompt-injection and exfil detection, SARIF output, `npx @royalpinto007/skill-audit <path>`.
- [Answerproof](https://github.com/royalpinto007/Answerproof): Verifiable receipts for RAG answers: Merkle inclusion proofs and Ed25519 signatures.
- [Agentrace](https://github.com/royalpinto007/Agentrace): Observability for Claude Code subagents: flags the agent results you should not trust.
- [Ctxlens](https://github.com/royalpinto007/Ctxlens): Context-window profiler for agents: shows what is eating your tokens and cuts the waste.
- [Ctxtrim](https://github.com/royalpinto007/Ctxtrim): Trims AI-context bloat: finds the files ballooning your Claude Code, Cursor, and Codex token cost and writes the ignore files to cut it. `npx ctxtrim`.
- [Evalgate](https://github.com/royalpinto007/Evalgate): Prompt regression CI: the build fails when your prompt gets dumber.
- [Voiceeval](https://github.com/royalpinto007/Voiceeval): Evaluation for voice agents: catches the failures a text eval scores as a perfect call.
- [Injection-arena](https://github.com/royalpinto007/Injection-arena): A self-hostable prompt-injection challenge game: beat stacked AI defenses, climb the leaderboard.
- [Tracecase](https://github.com/royalpinto007/Tracecase): CI for AI agents: replay runs against prompt changes, catch regressions before they ship.
- [Bridgekit](https://github.com/royalpinto007/Bridgekit): Scoped MCP server with per-client permission boundaries and an append-only audit log.
- [Casebook MCP](https://github.com/royalpinto007/Casebook-MCP): Remote MCP server over AgentPostmortem, a public registry of real AI-agent failures.
- [Casebook Chat](https://github.com/royalpinto007/Casebook-Chat): Streaming chat that investigates agent failures and answers with cited case IDs.

**Agents in production**
- [Resolvd](https://github.com/royalpinto007/Resolvd): End-to-end inbox operator: auto-resolves within policy, escalates the rest with a proposed action.
- [Greenlite](https://github.com/royalpinto007/Greenlite): Approve your agents from your phone: one-tap human-in-the-loop for escalations.
- [Webhands](https://github.com/royalpinto007/Webhands): Computer-use agent for tools with no API: refuses any write unless you confirm it.
- [RelayG](https://github.com/royalpinto007/RelayG): Support triage as a LangGraph state machine, paused mid-run by a human-in-the-loop interrupt.
- [AgentPostmortem](https://github.com/royalpinto007/agent-postmortem): Every AI agent failure, documented: a public case registry.

**Systems & apps**
- [Kabootar](https://github.com/royalpinto007/Kabootar): Offline mesh messenger: chat with no internet, no servers, no SIM. Messages hop phone-to-phone over Bluetooth and Wi-Fi (delay-tolerant network, epidemic routing, end-to-end acks). Flutter.
- [Tiny Day](https://github.com/royalpinto007/Tiny-Day): A cozy, offline-first daily planner for Android: gentle scheduling, focus, replanning, no accounts.
- [Auralis](https://github.com/royalpinto007/Auralis): A real-time interactive aurora rendered on the GPU in the browser, WebGPU with a WebGL2 fallback, no server. Move your cursor to bend the light.

**Products**
- [SignalizeAI](https://github.com/SignalizeAI/SignalizeAI): AI prospecting as a Chrome extension, featured on the Chrome Web Store.
- [PennyRush](https://github.com/royalpinto007/PennyRush): A private money hub: receipts and statements parsed in memory, only extracted fields stored.

**Awesome lists**
- [awesome-agent-evals](https://github.com/royalpinto007/awesome-agent-evals): Curated, auto-updating directory of tools, frameworks, and benchmarks for evaluating AI agents. Filterable site.
- [awesome-llm-guardrails](https://github.com/royalpinto007/awesome-llm-guardrails): Curated, auto-updating directory of open-source LLM guardrails: injection defense, PII, content safety, structured output, red-teaming.

**Roots**
- [cpp](https://github.com/royalpinto007/cpp): The code I wrote while learning C++ at the very start, kept detailed on purpose: datatypes through graphs and DP.

📫 royalpinto007@gmail.com
