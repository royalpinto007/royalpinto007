"""Verify the Home reading order, project discovery and one-line hero typing."""
import json
import os
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE = os.getenv("PORTFOLIO_URL", "http://127.0.0.1:8947").rstrip("/")
OUT = Path(os.getenv("FLOW_ARTIFACTS", "/tmp/portfolio-home-flow"))
OUT.mkdir(parents=True, exist_ok=True)
errors, checks = [], []

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path="/usr/bin/google-chrome")
    for width in [320, 390, 768, 1024, 1440, 1920]:
        page = browser.new_page(viewport={"width": width, "height": 900}, reduced_motion="no-preference")
        page.on("pageerror", lambda error: errors.append(str(error)))
        assert page.goto(BASE, wait_until="networkidle").status == 200
        page.wait_for_function("document.querySelector('.hero-cinema').dataset.effectsEnabled==='true'")
        assert page.locator(".intro-name strong").inner_text() == "Software engineer"
        assert "Indie dev" in page.locator(".intro-name").inner_text()
        assert "Freelancer" in page.locator(".intro-name").inner_text()
        assert page.locator(".hero-cinema .skill-rail, .hero-proof-row").count() == 0
        assert page.locator(".typing-visual").evaluate("""n=>{
          const a=n.firstElementChild.getBoundingClientRect(), b=n.lastElementChild.getBoundingClientRect();
          return Math.abs(a.top-b.top)<4 && a.right<b.left && b.right<=innerWidth-8;
        }"""), (width, "Working across wraps or clips")
        headings = page.locator(".home-page h2").all_text_contents()
        headings = [" ".join(text.split()) for text in headings]
        assert headings[:4] == ["Code in motion.", "Open by default.", "Selectedprojects.", "Under thehood."], headings
        assert page.locator(".work-meta h3").all_text_contents() == ["BoardEject ", "SignalizeAI ", "AashiNyra "]
        assert page.locator("main a[href*='agentpostmortem']").count() == 0
        assert page.locator(".playground, .gallery-heading").count() == 0
        assert page.locator("[data-home-collection]").evaluate_all("ns=>ns.map(n=>n.dataset.homeCollection)") == ["experiments", "games", "apps", "websites", "web3"]
        assert page.locator(".home-web3 .web3-preview").count() == 2
        assert page.locator(".web3-copy a").get_attribute("href") == "/projects/web3"
        assert page.locator(".discovery-more a").last.get_attribute("href") == "/projects/browser-extensions"
        assert page.locator(".home-discovery .project-collage").count() == 0
        page.screenshot(path=str(OUT/f"hero-{width}.png"))
        page.emulate_media(reduced_motion="reduce")
        page.locator("#explore").scroll_into_view_if_needed()
        page.locator("#explore img").evaluate_all("ns=>ns.forEach(n=>n.loading='eager')")
        page.wait_for_function("Array.from(document.querySelectorAll('#explore img')).every(n=>n.complete&&n.naturalWidth>0)")
        assert page.evaluate("document.documentElement.scrollWidth<=innerWidth")
        first = page.locator(".discovery-shelf").first
        first.focus()
        assert first.evaluate("n=>getComputedStyle(n).outlineStyle!=='none'")
        assert first.evaluate("n=>n.getAnimations({subtree:true}).every(a=>a.playState!=='running')")
        for suffix, selector in [("explorer", ".discovery-shelves"), ("web3", ".home-web3")]:
            if width in [390, 1440]:
                page.locator(selector).screenshot(path=str(OUT/f"{suffix}-{width}.png"))
        checks.append({"width": width, "hero": True, "section_order": True, "discovery": True})
        page.close()
    context = browser.new_context(java_script_enabled=False, viewport={"width":390,"height":900})
    page = context.new_page()
    assert page.goto(BASE).status == 200
    assert page.locator(".intro-name strong").is_visible()
    assert page.locator(".typing-static").is_visible()
    page.locator('[data-home-collection="apps"]').click()
    page.wait_for_load_state("networkidle")
    assert page.url == BASE + "/projects#apps"
    assert page.locator("#apps .collection-all").get_attribute("href") == "/projects/apps"
    page.locator("#apps .collection-all").click()
    page.wait_for_load_state("networkidle")
    assert page.locator("[data-project-id]").count() == 6
    page.goto(BASE)
    page.locator(".web3-copy a").click()
    page.wait_for_load_state("networkidle")
    assert page.url == BASE + "/projects/web3"
    assert page.locator("[data-project-id]").count() == 8
    context.close()
    browser.close()
assert not errors, errors
(OUT/"verification.json").write_text(json.dumps({"ok":True,"checks":checks,"no_js_navigation":True},indent=2)+"\n")
print("PASS: Home identity/order, one-line typing, no hero dock, category explorer, Web3, focus, six widths and no-JS navigation.")
