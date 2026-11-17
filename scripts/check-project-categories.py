"""Check collection navigation, direct previews, curation and responsive layouts."""
import os
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright

URL = os.getenv("PROJECTS_URL", "http://127.0.0.1:8947/projects")
BASE = URL.rsplit("/projects", 1)[0]
MEMBERS = {
    "resources": ["awesome-mcp-security", "awesome-context-engineering", "awesome-agent-memory", "awesome-agent-skills", "ship-skills", "distro-skills"],
    "apps": ["signalizeai", "aashinyra", "stoccoin", "boardeject", "pennyrush", "tiny-day", "holdfast", "kabootar", "agentday", "pagefold", "stowlane", "glasswing", "bellrope", "cribsheet", "water"],
    "games": ["bumblecrate", "revlap", "tablewink", "megoblin", "jollybound", "hushmallow"],
    "web3": ["ack", "delegate-inspector", "hookview", "paylint", "settled", "solana-authority-inspector", "txray", "v1check"],
    "open-source": ["d-errors-docs", "dent-docs", "text-generation", "d-simple-server", "phobos-nogc-checker", "toy-compiler"],
}
GROUPS = {
    "websites": {"studios": 4, "products": 5, "places": 5, "culture": 5},
    "experiments": {"3d-scenes": 7, "physics": 5, "generative": 7, "interactions": 5},
    "agentpostmortem": {"agents": 9, "tooling": 11},
}

def check_layout(page):
    assert page.evaluate("document.documentElement.scrollWidth <= innerWidth"), page.url
    assert page.locator("a a").count() == 0
    assert page.locator('a[href="#"]').count() == 0


def previews(page):
    assert page.locator(".project-overview").count() == 0, "A project is missing its preview image"
    for item in page.locator("[data-project-id]").all():
        assert item.locator(".project-window-image img").count() == 1
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


def loaded_images(page):
    page.locator("img").evaluate_all("ns=>ns.forEach(n=>n.loading='eager')")
    page.wait_for_function("Array.from(document.images).every(i=>i.complete)")
    assert page.locator("img").evaluate_all("ns=>ns.every(n=>n.naturalWidth>0)")


with sync_playwright() as p:
    browser = p.chromium.launch(executable_path="/usr/bin/google-chrome")
    errors = []
    for width in [320, 390, 768, 1440, 1920]:
        page = browser.new_page(viewport={"width": width, "height": 900}, reduced_motion="reduce")
        page.on("pageerror", lambda error: errors.append(str(error)))
        assert page.goto(URL, wait_until="networkidle").status == 200
        assert page.locator("[data-project-category]").count() == 8
        order = page.locator("[data-project-category]").evaluate_all("ns=>ns.map(n=>n.dataset.projectCategory)")
        assert order == ["apps", "open-source", "websites", "experiments", "games", "web3", "agentpostmortem", "resources"], order
        assert page.locator("[data-project-category='productivity-apps'], [data-project-category='drupal']").count() == 0
        assert page.locator("#packages").count() == 0
        menu = page.locator(".category-menu")
        summary = menu.locator("summary")
        summary.focus()
        page.keyboard.press("Enter")
        page.wait_for_function("document.querySelector('.category-menu').dataset.side !== undefined")
        links = menu.get_by_role("link")
        assert links.count() == 8
        assert "Directories & skills" in links.last.inner_text()
        assert menu.locator("nav").evaluate("n=>{const b=n.getBoundingClientRect();return b.left>=0&&b.right<=innerWidth&&b.top>=0&&b.bottom<=innerHeight+1}")
        page.keyboard.press("Escape")
        assert not menu.evaluate("n=>n.open")
        assert summary.evaluate("n=>n===document.activeElement")
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
        assert page.locator('#apps [data-project-id="signalizeai"] a').get_attribute("href") == "https://signalizeai.org"
        assert page.locator('#apps [data-project-id]').evaluate_all("ns=>ns.map(n=>n.dataset.projectId)") == ["boardeject", "kabootar", "signalizeai", "aashinyra"]
        assert page.locator('#games [data-project-id]').evaluate_all("ns=>ns.map(n=>n.dataset.projectId)") == MEMBERS["games"]
        assert page.locator('#open-source [data-project-id]').evaluate_all("ns=>ns.map(n=>n.dataset.projectId)") == MEMBERS["open-source"][:3]
        assert page.locator('[data-project-id="drupal-chatbot"]').count() == 0
        for link in page.locator('.collection-view-all').all():
            assert link.get_attribute('target') == '_blank'
            assert 'noopener' in link.get_attribute('rel')
        assert page.locator('.project-chapter .projects-scenery img').count() == 8
        assert page.locator('#web3 [data-project-group]').count() == 1
        assert page.locator('#web3 [data-project-id]').evaluate_all("ns=>ns.map(n=>n.dataset.projectId)") == ["delegate-inspector", "txray", "paylint", "solana-authority-inspector", "settled", "hookview"]
        assert page.locator('#apps [data-project-id="signalizeai"] img').get_attribute('src') == '/work/signalizeai-light.webp'
        assert page.locator('#agentpostmortem [data-project-group="resources"]').count() == 0
        assert page.locator('#resources .collection-all').get_attribute('href') == '/projects/resources'
        assert page.locator('#apps [data-project-id="agentday"]').count() == 0  # retained in View all
        assert page.locator('#websites .collection-all').get_attribute("href") == "https://royalpinto007.com/facetworks/designs"
        assert page.locator('#experiments .collection-all').get_attribute("href") == "https://royalpinto007.com/facetworks/graphics"
        assert page.locator('#agentpostmortem .collection-all').get_attribute("href") == "https://www.agentpostmortem.com/tools"
        previews(page)
        check_layout(page)
        loaded_images(page)
        if width in [390, 1440] and os.getenv("PROJECTS_SCREENSHOTS"):
            page.screenshot(path=f"{os.environ['PROJECTS_SCREENSHOTS']}/projects-{width}.png", full_page=True)
        page.close()
    page = browser.new_page(viewport={"width": 390, "height": 900})
    page.on("pageerror", lambda error: errors.append(str(error)))
    for category, ids in MEMBERS.items():
        assert page.goto(f"{BASE}/projects/{category}", wait_until="networkidle").status == 200
        shown = page.locator("[data-project-id]").evaluate_all("ns=>ns.map(n=>n.dataset.projectId)")
        assert set(shown) == set(ids) and len(shown) == len(ids), category
        if category == "open-source":
            assert shown == ids, "Open-source work is not in the requested order"
        previews(page)
        loaded_images(page)
        check_layout(page)
        if category == "open-source":
            expected = 4
            assert page.locator(".project-window-bar", has_text="Workflow preview").count() == expected
        if category == "apps":
            assert page.locator('[data-project-id="tiny-day"] .project-window-bar').inner_text() == "Design reference"
        if category == "games":
            assert page.locator("a.project-preview-link").count() == 0
        if category == "apps":
            assert page.locator('[data-project-id="agentday"] a.project-preview-link').get_attribute("href") == "https://agentday.live"
            for name in ["holdfast", "kabootar", "pennyrush", "tiny-day"]:
                assert "github.com/" in page.locator(f'[data-project-id="{name}"] a.project-preview-link').get_attribute("href")
    for alias, target in [("productivity-apps", "apps"), ("products", "apps"), ("browser-extensions", "apps"), ("editor-tools", "apps"), ("drupal", "open-source"), ("d-language", "open-source")]:
        assert page.goto(f"{BASE}/projects/{alias}", wait_until="networkidle").status == 200
        assert page.locator('link[rel="canonical"]').get_attribute("href").endswith("/projects/" + target)
        assert page.locator("[data-project-id]").count() == len(MEMBERS[target])
        check_layout(page)
    for collection, category, count in [("designs", "websites", 19), ("graphics", "experiments", 24)]:
        assert page.goto(f"{BASE}/facetworks/{collection}", wait_until="networkidle").status == 200
        assert page.locator("[data-facetworks-project]").count() == count
        for group, size in GROUPS[category].items():
            assert page.locator(f'[data-facetworks-group="{group}"] [data-facetworks-project]').count() == size
        loaded_images(page)
        check_layout(page)
    # The full list and a project are distinct navigation targets, even without JS.
    context = browser.new_context(java_script_enabled=False, viewport={"width": 390, "height": 900})
    plain = context.new_page()
    assert plain.goto(URL).status == 200
    assert plain.locator('#experiments [data-project-id="abyss"] a').get_attribute("href").rstrip("/").endswith("/facetworks/graphics/abyss")
    with plain.expect_popup() as popup:
        plain.locator('#apps .collection-all').click()
    all_apps = popup.value
    all_apps.wait_for_load_state("networkidle")
    assert urlsplit(all_apps.url).path == "/projects/apps"
    assert all_apps.locator("[data-project-id]").count() == len(MEMBERS["apps"])
    assert urlsplit(plain.url).path == "/projects"
    check_layout(all_apps)
    context.close()
    assert not errors, errors
    browser.close()
print("PASS: 8 collections; named direct previews; separate View all; full membership; grouped galleries; private boundaries; images; five responsive widths; no-JS navigation.")
