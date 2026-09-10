"""Capture public project pages only. Never log in or capture private user data."""
import io
import json
import subprocess
from pathlib import Path
from PIL import Image
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
data = subprocess.check_output(["node", "--experimental-strip-types", "-e", "import('./data/site.ts').then(({siteConfig:s})=>console.log(JSON.stringify(s.projects)))"], cwd=ROOT, text=True)
projects = json.loads(data)
with sync_playwright() as p:
    browser = p.chromium.launch(executable_path="/usr/bin/google-chrome")
    page = browser.new_page(viewport={"width":1440,"height":1000})
    for project in projects:
        url = project["liveUrl"]
        target = ROOT / "public/work" / (project["id"] + ".webp")
        if target.exists() or project["section"] == "Frontend & Design" or not url.startswith("https://") or any(host in url for host in ["npmjs", "pypi", "mcp.agentpostmortem", "hire.agentpostmortem"]):
            continue
        try:
            response = page.goto(url, wait_until="networkidle", timeout=20000)
            if response.status != 200 or len(page.locator("body").inner_text()) < 100:
                print(project["id"], "skipped: not a usable public page", flush=True)
                continue
            page.wait_for_timeout(750)
            Image.open(io.BytesIO(page.screenshot())).resize((1008,700)).save(target, quality=82)
            print(project["id"], "captured", flush=True)
        except Exception as error:
            print(project["id"], type(error).__name__, flush=True)
    browser.close()
