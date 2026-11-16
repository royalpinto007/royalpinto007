"""Check category placement and screenshots on a local or deployed portfolio."""
import os
from playwright.sync_api import sync_playwright

URL = os.getenv("PROJECTS_URL", "http://127.0.0.1:8947/projects")
with sync_playwright() as p:
    browser = p.chromium.launch(executable_path="/usr/bin/google-chrome")
    for width in [360, 768, 1440]:
        page = browser.new_page(viewport={"width":width,"height":900})
        errors = []
        page.on("pageerror", lambda error: errors.append(str(error)))
        assert page.goto(URL, wait_until="networkidle").status == 200
        assert page.locator("[data-project-category]").count() == 13
        assert page.locator("#websites .facetworks-collage").count() == 1
        assert page.locator("#experiments .facetworks-collage").count() == 1
        assert page.locator("#websites .collage-screen").count() == 19
        assert page.locator("#experiments .collage-screen").count() == 24
        assert page.locator("#websites .design-tile, #experiments .design-tile").count() == 0
        assert page.locator('#websites a[href="https://royalpinto007.com/facetworks/designs"]').count() == 1
        assert page.locator('#experiments a[href="https://royalpinto007.com/facetworks/graphics"]').count() == 1
        assert page.locator('a[href="https://internetceo.lol"]').count() == 0
        assert page.locator("#agentpostmortem .agentpostmortem-collage").count() == 1
        assert page.locator("#agentpostmortem .collage-screen").count() == 26
        assert page.locator('#agentpostmortem a[href="https://www.agentpostmortem.com/tools"]').count() == 1
        assert page.locator('#agentpostmortem [data-project-id],#packages').count() == 0
        for category, ids in {
            "apps":["boardeject"],
            "products":["aashinyra"],
            "productivity-apps":["pennyrush", "tiny-day", "holdfast", "kabootar", "agentday"],
            "games":["bumblecrate", "megoblin", "jollybound", "revlap", "tablewink", "hushmallow"],
            "web3":["ack", "delegate-inspector", "hookview", "paylint", "settled", "solana-authority-inspector", "txray", "v1check"],
            "drupal":["text-generation"],
            "d-language":["d-simple-server", "phobos-nogc-checker", "toy-compiler", "d-errors-docs"],
            "browser-extensions":["signalizeai", "pagefold", "stowlane", "glasswing", "bellrope", "cribsheet"],
            "editor-tools":["water"],
            "open-source":["drupal-chatbot", "dent-docs"],
        }.items():
            for project in ids:
                assert page.locator(f'#{category} [data-project-id="{project}"]').count() == 1, project
        ids = page.locator("[data-project-id]").evaluate_all("nodes=>nodes.map(n=>n.dataset.projectId)")
        assert len(ids) == len(set(ids))
        page.locator("img").evaluate_all("images=>images.forEach(i=>i.loading='eager')")
        page.wait_for_function("Array.from(document.images).every(i=>i.complete)")
        assert page.locator("img").evaluate_all("images=>images.every(i=>i.naturalWidth>0)")
        assert page.evaluate("document.documentElement.scrollWidth<=innerWidth")
        assert not errors, errors
        page.close()
    browser.close()
print("PASS: thirteen categories, correct grouping, unique entries, images and responsive layouts.")
