"""Check collection navigation, direct previews, curation and responsive layouts."""
import os
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright

URL = os.getenv("PROJECTS_URL", "http://127.0.0.1:8947/projects")
BASE = URL.rsplit("/projects", 1)[0]
MEMBERS = {
    "products": ["aashinyra", "signalizeai", "stoccoin"],
    "apps": ["boardeject"],
    "productivity-apps": ["pennyrush", "tiny-day", "holdfast", "kabootar", "agentday"],
    "games": ["bumblecrate", "megoblin", "jollybound", "revlap", "tablewink", "hushmallow"],
    "web3": ["ack", "delegate-inspector", "hookview", "paylint", "settled", "solana-authority-inspector", "txray", "v1check"],
    "browser-extensions": ["pagefold", "stowlane", "glasswing", "bellrope", "cribsheet"],
    "editor-tools": ["water"],
    "drupal": ["text-generation"],
    "d-language": ["d-simple-server", "phobos-nogc-checker", "toy-compiler", "d-errors-docs"],
    "open-source": ["drupal-chatbot", "dent-docs"],
}
GROUPS = {
    "websites": {"studios": 4, "products": 5, "places": 5, "culture": 5},
    "experiments": {"3d-scenes": 7, "physics": 5, "generative": 7, "interactions": 5},
    "agentpostmortem": {"agents": 9, "tooling": 11, "resources": 6},
    "web3": {"token-permissions": 3, "payments-transactions": 5},
}

def check_layout(page):
    assert page.evaluate("document.documentElement.scrollWidth <= innerWidth"), page.url
    assert page.locator("a a").count() == 0
    assert page.locator('a[href="#"]').count() == 0


def previews(page):
    for item in page.locator("[data-project-id]").all():
        assert item.locator(".project-preview-caption :is(h3,h4)").inner_text().strip()
        assert item.locator(".project-preview-caption p").inner_text().strip()
        links = item.locator("a.project-preview-link")
        if links.count():
            assert links.count() == 1
            assert links.get_attribute("href").startswith(("https://", "/stoccoin"))
            assert links.get_attribute("target") == "_blank"
            assert "noopener" in links.get_attribute("rel")
        else:
            assert item.locator(".preview-only").inner_text() == "Preview only"
    assert page.locator("a.project-collage").count() == 0


with sync_playwright() as p:
    browser = p.chromium.launch(executable_path="/usr/bin/google-chrome")
    errors = []
    for width in [320, 390, 768, 1440, 1920]:
        page = browser.new_page(viewport={"width": width, "height": 900}, reduced_motion="reduce")
        page.on("pageerror", lambda error: errors.append(str(error)))
        assert page.goto(URL, wait_until="networkidle").status == 200
        assert page.locator("[data-project-category]").count() == 13
        assert page.locator("#packages").count() == 0
        for category, groups in GROUPS.items():
            section = page.locator(f"[data-project-category='{category}']")
            assert section.locator("[data-project-group]").count() == len(groups)
            for group, count in groups.items():
                board = section.locator(f"[data-project-group='{group}']")
                assert board.locator("[data-project-id]").count() == min(count, 4)
                assert board.locator(".collage-group-heading a").get_attribute("href").endswith("#" + group)
        for category, ids in MEMBERS.items():
            shown = page.locator(f"#{category} [data-project-id]").evaluate_all("ns=>ns.map(n=>n.dataset.projectId)")
            assert set(shown) <= set(ids)
        assert page.locator('#products [data-project-id="signalizeai"] a').get_attribute("href") == "https://signalizeai.org"
        assert page.locator('#products [data-project-id="stoccoin"] a').get_attribute("href").rstrip("/").endswith("/stoccoin")
        assert page.locator('#productivity-apps [data-project-id="agentday"]').count() == 0  # retained in View all
        assert page.locator('#websites .collection-all').get_attribute("href") == "https://royalpinto007.com/facetworks/designs"
        assert page.locator('#experiments .collection-all').get_attribute("href") == "https://royalpinto007.com/facetworks/graphics"
        assert page.locator('#agentpostmortem .collection-all').get_attribute("href") == "https://www.agentpostmortem.com/tools"
        previews(page)
        check_layout(page)
        page.locator("img").evaluate_all("ns=>ns.forEach(n=>n.loading='eager')")
        page.wait_for_function("Array.from(document.images).every(i=>i.complete)")
        assert page.locator("img").evaluate_all("ns=>ns.every(n=>n.naturalWidth>0)")
        if width in [390, 1440] and os.getenv("PROJECTS_SCREENSHOTS"):
            page.screenshot(path=f"{os.environ['PROJECTS_SCREENSHOTS']}/projects-{width}.png", full_page=True)
        page.close()
    page = browser.new_page(viewport={"width": 390, "height": 900})
    page.on("pageerror", lambda error: errors.append(str(error)))
    for category, ids in MEMBERS.items():
        assert page.goto(f"{BASE}/projects/{category}", wait_until="networkidle").status == 200
        shown = page.locator("[data-project-id]").evaluate_all("ns=>ns.map(n=>n.dataset.projectId)")
        assert set(shown) == set(ids) and len(shown) == len(ids), category
        previews(page)
        check_layout(page)
        if category == "games":
            assert page.locator("a.project-preview-link").count() == 0
        if category == "productivity-apps":
            assert page.locator('[data-project-id="agentday"] a.project-preview-link').get_attribute("href") == "https://agentday.live"
            for name in ["holdfast", "kabootar", "pennyrush", "tiny-day"]:
                assert "github.com/" in page.locator(f'[data-project-id="{name}"] a.project-preview-link').get_attribute("href")
    for collection, category, count in [("designs", "websites", 19), ("graphics", "experiments", 24)]:
        assert page.goto(f"{BASE}/facetworks/{collection}", wait_until="networkidle").status == 200
        assert page.locator("[data-facetworks-project]").count() == count
        for group, size in GROUPS[category].items():
            assert page.locator(f'[data-facetworks-group="{group}"] [data-facetworks-project]').count() == size
        check_layout(page)
    # The full list and a project are distinct navigation targets, even without JS.
    context = browser.new_context(java_script_enabled=False, viewport={"width": 390, "height": 900})
    plain = context.new_page()
    assert plain.goto(URL).status == 200
    assert plain.locator('#experiments [data-project-id="abyss"] a').get_attribute("href").rstrip("/").endswith("/facetworks/graphics/abyss")
    plain.locator('#products .collection-all').click()
    assert urlsplit(plain.url).path == "/projects/products"
    assert plain.locator("[data-project-id]").count() == 3
    check_layout(plain)
    context.close()
    assert not errors, errors
    browser.close()
print("PASS: 13 collections; named direct previews; separate View all; full membership; grouped galleries; private boundaries; images; five responsive widths; no-JS navigation.")
