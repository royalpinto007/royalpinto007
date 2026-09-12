"""Check category placement and screenshots on a local or deployed portfolio."""
import os
from playwright.sync_api import sync_playwright

URL = os.getenv("PROJECTS_URL", "http://localhost:8891/projects.html")
with sync_playwright() as p:
    browser = p.chromium.launch(executable_path="/usr/bin/google-chrome")
    for width in [360, 768, 1440]:
        page = browser.new_page(viewport={"width":width,"height":900})
        errors = []
        page.on("pageerror", lambda error: errors.append(str(error)))
        assert page.goto(URL, wait_until="networkidle").status == 200
        assert page.locator("[data-project-category]").count() == 7
        assert page.locator("#websites .design-tile").count() == 18
        assert page.locator("#experiments .design-tile").count() == 17
        for domain in ['rentmyscreen.xyz', 'internetceo.lol']:
            assert page.locator(f'#experiments a[href="https://{domain}"]').count() == 1
        for category, ids in {
            "apps":["aashinyra", "pennyrush", "tiny-day", "holdfast", "kabootar"],
            "browser-extensions":["signalizeai", "pagefold", "stowlane", "glasswing", "bellrope", "cribsheet"],
            "packages":["ctxtrim", "tokencut", "ctxlens", "distro-skills"],
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
print("PASS: seven categories, correct grouping, unique entries, images and responsive layouts.")
