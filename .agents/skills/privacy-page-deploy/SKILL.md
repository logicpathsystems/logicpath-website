---
name: privacy-page-deploy
description: >-
  Create or update an app privacy policy page on logicpathsystems.com and
  deploy it in one pass. Use whenever the user gives a URL like
  logicpathsystems.com/privacy/{appname} (or asks for a privacy policy or
  privacy notice page for an Android app) together with the policy content.
  Writes src/pages/privacy/{appname}.astro from the house template, builds,
  verifies the route, commits and pushes — without asking "should I deploy?".
---

# Privacy Page: Create & Deploy

One pass, no check-ins. The user supplies the URL and the content once; you
produce a live page and report back.

## 1. Resolve the slug

`logicpathsystems.com/privacy/{appname}` → `src/pages/privacy/{appname}.astro`
→ live at `https://logicpathsystems.com/privacy/{appname}/`

Slug rules: lowercase, no spaces. Keep the user's spelling exactly — the Play
Console listing already points at that URL, so `wififtpserver` must not become
`wifi-ftp-server`.

**Check whether the file already exists first** (`ls src/pages/privacy/`). If it
does, this is an *update*: read it, keep the sections the user is not changing,
and use "Update …" in the commit message.

## 2. Write the page

Copy [template.astro](template.astro) and replace every `__PLACEHOLDER__`.
Do not hand-assemble the markup from memory — the template carries inline
styles that the page breaks without (see House style).

The template's section wording is house boilerplate for an AdMob + Firebase
app. Replace it with the user's content, section by section.

> [!WARNING]
> A privacy policy is a legal document and must match the app's Play Console
> Data Safety declaration. Never invent a data practice the user's content does
> not state, and never leave template wording that contradicts it — e.g. do not
> keep the Analytics section for an app with no Firebase, and do not keep "no
> sign-in" for an app that has accounts. If the content is silent on something
> material (ads? analytics? on-device storage? children's audience?), ship the
> page without that section and flag the gap in your final report. Flagging is
> not asking — still deploy.

### Canonical section order

Overview · Data kept on your device · Advertising · App usage analytics ·
Your choices · Children · Sharing and security · Changes to this policy ·
Contact

Drop any section that does not apply; add app-specific ones (e.g. Permissions,
Camera, Local network) in a sensible position. Use `<h3>` for subsections.

## 3. House style (pinned — the repo has drifted, do not copy older pages)

| Element | Exact form |
| --- | --- |
| Brand name | `Logicpath Systems` (not "LogicPath", not "Logic Path") |
| Page title | `<App Name> Privacy Policy - Logicpath Systems` |
| `<h1>` | `Privacy Policy` (never "Privacy Notice") |
| Date line | `Logicpath Systems &middot; <strong>Last updated:</strong> 5 November 2026` |
| Date value | **Today's real date**, `D Month YYYY` — never the template's date |
| `description` prop | Always pass one; most existing pages wrongly inherit the generic site meta description |
| Links | `style="color: var(--accent-secondary);"` + `target="_blank" rel="noopener noreferrer"` |
| Email | `contact@logicpathsystems.com`, bolded inside the link |
| Dividers | `<hr style="margin: 2.5rem 0; border-color: rgba(255, 255, 255, 0.1);" />` between sections |
| Disclaimer divider | `<hr style="margin: 4rem 0; border-color: rgba(255, 255, 255, 0.2);" />` + `<h2 style="text-align: center; margin-bottom: 2rem;">` |

Non-negotiable inline styles (the header in `Layout.astro` is `position: fixed`,
so without the first one the content sits under the navbar):

- `<section class="legal-page" style="padding-top: 120px; min-height: 100vh;">`
- `<div class="container reveal">` — `reveal` drives the fade-in; without it the
  page still shows, but it will not match the rest of the site
- `<div class="glass-card" style="padding: clamp(2rem, 5vw, 4rem);">`

Entities: `&ldquo;`/`&rdquo;` for smart quotes, `&rsquo;` for apostrophes,
`&mdash;`, `&middot;`, `&gt;` for `>`, `&rarr;` for →, `&amp;` for `&`.

### Astro gotchas

- `{` and `}` in body text are parsed as expressions — escape as `&#123;` /
  `&#125;`, or the build fails with a cryptic error.
- The `<style>` block is scoped and must stay at the end of the file, outside
  `<Layout>`.
- CSP (`astro.config.mjs`) allows inline `style=""` attributes and `'self'`
  scripts only. Never add an external script, font or stylesheet to a legal page.
- Non-English pages work fine (see `cpchindi.astro`); keep the markup identical
  and translate only the text.

## 4. Build and verify

```bash
npm run build
```

Then confirm the route actually emitted — a green build alone does not prove it:

```bash
ls dist/privacy/{appname}/index.html && grep -c "Last updated" dist/privacy/{appname}/index.html
```

Do not wait for user confirmation at any point here.

## 5. Commit and push

```powershell
git add src/pages/privacy/{appname}.astro; git commit -m "Add {App Display Name} privacy policy page"; git push origin main
```

- Use `Update {App Display Name} privacy policy page` when the file existed.
- **Stage only that one file.** The working tree often holds other unfinished
  pages — never `git add -A` or `git add .`.
- `dist/` is gitignored; never commit build output.
- PowerShell: separate commands with `;`, not `&&`.
- `git push` needs `dangerouslyDisableSandbox: true`.

Pushing to `main` triggers `.github/workflows/deploy.yml`, which rebuilds and
publishes to GitHub Pages. The page is live roughly 1–2 minutes later, so an
immediate `curl` can still 404 — if you verify, wait and retry once:

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://logicpathsystems.com/privacy/{appname}/
```

## 6. Report

Give the user:

- the live URL,
- the commit hash and whether it was an add or an update,
- the sections included,
- any material gap you flagged in step 2,
- a reminder to paste the URL into Play Console → App content → Privacy policy
  if this is a new app.

> [!IMPORTANT]
> Everything above happens in one pass. Do not ask "should I deploy?" or "does
> this look right?" — write, build, verify, push, then report.
