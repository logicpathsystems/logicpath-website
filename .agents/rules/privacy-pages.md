# Privacy Policy Pages Workflow

When the user provides a URL like `https://logicpathsystems.com/privacy/{appname}/` along with privacy policy content:

1. **Create the file** at `src/pages/privacy/{appname}.astro` (the appname from the URL maps directly to the filename).

2. **Use this exact template structure** (Astro page with Layout import):
   - `import Layout from '../../layouts/Layout.astro';`
   - Wrap in `<Layout title="...">` with `<section class="legal-page">`, `<div class="container reveal">`, `<div class="glass-card">`
   - Header: `<h1 class="gradient-text">Privacy Policy</h1>` + app name + effective date
   - Body: `<main class="legal-content">` with `<h2>` for sections, `<h3>` for subsections
   - Links use `style="color: var(--accent-secondary);"` and `target="_blank" rel="noopener noreferrer"`
   - Email links: `<a href="mailto:contact@logicpathsystems.com" style="color: var(--accent-secondary);"><strong>contact@logicpathsystems.com</strong></a>`
   - Footer line: effective date + © company name
   - Include the standard `<style>` block for `.legal-content` (h2, h3, p, ul, table, blockquote, li, code)

3. **Reference an existing privacy page** (e.g., `src/pages/privacy/southafricaconstitution.astro`) for the exact style block if needed.

4. **Deploy**: Git add, commit with message like "Add {App Name} privacy policy page", and `git push origin main`. Use semicolons (`;`) not `&&` in PowerShell.

5. **Be fast**: This is a straightforward templating task. Do NOT over-analyze or explore the project structure. Just create the file from template, commit, and push.
