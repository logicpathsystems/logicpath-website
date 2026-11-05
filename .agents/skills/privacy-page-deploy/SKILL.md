---
name: privacy-page-deploy
description: >-
  Use this skill when the user provides a URL like
  logicpathsystems.com/privacy/{appname} along with privacy policy content.
  It creates or updates the Astro page, builds, commits, and pushes to deploy
  — all in one shot without waiting for the user to say "deploy".
---

# Privacy Page: Create & Deploy

When the user provides a URL like `logicpathsystems.com/privacy/{appname}` and
privacy policy content, do **all** of these steps in one go — do NOT stop and
wait for the user to say "deploy".

## Steps

### 1. Extract the app name
The `{appname}` from the URL maps directly to the filename:
`src/pages/privacy/{appname}.astro`

### 2. Create or overwrite the `.astro` file
Use the template structure below. Convert the user's markdown/plain-text
content into the HTML body. Apply these formatting rules:

- **Layout import**: `import Layout from '../../layouts/Layout.astro';`
- **Wrapper**: `<Layout title="...">` → `<section class="legal-page">` →
  `<div class="container reveal">` → `<div class="glass-card">`
- **Header**: `<h1 class="gradient-text">Privacy Policy</h1>` + app name in
  `<strong>` + effective/last-updated date
- **Body**: `<main class="legal-content">` with `<h2>` for sections, `<h3>`
  for subsections
- **Section dividers**: `<hr style="margin: 2.5rem 0; border-color: rgba(255, 255, 255, 0.1);" />`
  between each section
- **Disclaimer divider** (if present): `<hr style="margin: 4rem 0; border-color: rgba(255, 255, 255, 0.2);" />`
  with `<h2 style="text-align: center; margin-bottom: 2rem;">`
- **Links**: `style="color: var(--accent-secondary);"` and
  `target="_blank" rel="noopener noreferrer"`
- **Email**: `<a href="mailto:contact@logicpathsystems.com" style="color: var(--accent-secondary);"><strong>contact@logicpathsystems.com</strong></a>`
- **HTML entities**: Use `&ldquo;`/`&rdquo;` for smart quotes, `&mdash;` for
  em-dashes, `&middot;` for middle dots, `&gt;` for `>`, `&rarr;` for →,
  `&amp;` for &
- **Style block**: Include the standard `.legal-content` style block (h2, h3,
  p, ul, li — see the template reference below)

Reference an existing page for exact style if needed:
[periodictable.astro](../../src/pages/privacy/periodictable.astro)

### 3. Build
```
npm run build
```
Verify the build succeeds and the new route appears in the output
(e.g., `/privacy/{appname}/index.html`). Do NOT wait for user confirmation.

### 4. Commit and push
```powershell
git add src/pages/privacy/{appname}.astro
git commit -m "Add {App Display Name} privacy policy page"
# or "Update ..." if the file already existed
git push origin main
```
Use `BypassSandbox: true` for git push. Use semicolons (`;`) not `&&` in
PowerShell.

### 5. Confirm to the user
Report the live URL, commit hash, and a brief summary of sections included.

## Style Block Reference

```html
<style>
    .legal-content h2 {
        color: var(--text-primary);
        margin-top: 2.5rem;
        margin-bottom: 1rem;
        font-size: 1.5rem;
    }

    .legal-content h3 {
        color: var(--text-primary);
        margin-top: 1.5rem;
        margin-bottom: 0.75rem;
        font-size: 1.25rem;
    }

    .legal-content p, .legal-content ul {
        color: var(--text-secondary);
        margin-bottom: 1.25rem;
        font-size: 1.05rem;
        line-height: 1.7;
    }

    .legal-content ul {
        padding-left: 2rem;
        margin-bottom: 2rem;
    }

    .legal-content li {
        margin-bottom: 0.5rem;
    }
</style>
```

> [!IMPORTANT]
> Do everything in one pass. The user should only need to provide the URL and
> content once. Do not ask "should I deploy?" — just do it.
