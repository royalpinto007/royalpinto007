# Royal Simpson Pinto

🤖 AI Product Engineer · LLMs · agents · automation · full-stack · open source<br>
🎓 NITK Surathkal · Class of 2025<br>
🌍 Google Summer of Code · Linux Foundation · Symmetry Autumn of Code<br>
🚀 3+ years building and shipping production software

🌅 [Portfolio](https://royalpinto007.com) · [Hire me](https://hire.royalpinto007.com)

## Projects

- [BoardEject](https://boardeject.dev) | Apple Freeform → editable Excalidraw
- [SignalizeAI](https://github.com/SignalizeAI/SignalizeAI) | AI prospecting Chrome extension
- [Stoccoin](https://royalpinto007.com/stoccoin/) | stock and cryptocurrency project demo
- [AashiNyra Deals](https://aashinyra.com) | fashion deals + cashback platform
- [Kabootar](https://github.com/royalpinto007/Kabootar) | offline Bluetooth/Wi-Fi mesh messenger
- [Tiny Day](https://github.com/royalpinto007/Tiny-Day) | offline-first Android planner
- [PennyRush](https://github.com/royalpinto007/PennyRush) | private money hub
- [AgentPostmortem](https://github.com/AgentPostmortem/agentpostmortem) | AI agent failure registry + tooling
- [Facetworks](https://royalpinto007.com/facetworks) | 43 web design and interactive experiments

## I also build

🧪 AI evals · agent security · MCP tooling · RAG · agent memory · token optimization · local-first apps · Chrome extensions

🌐 [Facetworks](https://royalpinto007.com/facetworks) · ☕ [Buy me a coffee](https://buymeacoffee.com/royalpinto007) · ✉️ [royalpinto007@gmail.com](mailto:royalpinto007@gmail.com)

## Facetworks collections

- [Designs](https://royalpinto007.com/facetworks/designs): 19 website concepts.
- [Graphics](https://royalpinto007.com/facetworks/graphics): 24 experiments in physics, 3D, light and sound.

The portfolio Projects page links to these collections through two preview collages. Individual builds use `/facetworks/designs/<name>/` or `/facetworks/graphics/<name>/`. The shared catalogue is in `data/facetworks.json`; deployment tooling rebases independent static builds and redirects the previous demo paths.

## Stoccoin hosting

`deployment/stoccoin-policy.mjs` scopes the independent Stoccoin SPA to `/stoccoin/` in the shared domain Worker. Known app pages receive the Stoccoin shell on refresh, missing assets retain their 404 responses, and portfolio holding routes remain separate. The source build uses Vite's `--base=/stoccoin/`; the combined deployment manifest stages its `dist/` at that path. Run `npm test` to check path boundaries and request methods.
