# Security Audit — logicpathsystems.com

A comprehensive review of your Astro static site deployed on GitHub Pages.

> [!NOTE]
> This is a **static site** (Astro SSG on GitHub Pages), so many server-side attack vectors (SQL injection, auth bypasses, etc.) don't apply. The focus below is on **client-side security, HTTP headers, supply-chain, and best practices**.

---

## 🔴 High Priority

### 1. No Security Headers

Your site is missing **all critical HTTP security headers**. GitHub Pages doesn't let you set custom headers, but you can work around this:

| Header | Purpose | Status |
|---|---|---|
| `Content-Security-Policy` | Prevents XSS, injection attacks | ❌ Missing |
| `X-Content-Type-Options` | Prevents MIME-type sniffing | ❌ Missing |
| `X-Frame-Options` | Prevents clickjacking | ❌ Missing |
| `Referrer-Policy` | Controls referrer leakage | ❌ Missing |
| `Permissions-Policy` | Restricts browser APIs | ❌ Missing |

> [!IMPORTANT]
> **GitHub Pages does not support custom HTTP headers.** To add them, you'd need to either:
> - Put **Cloudflare** (free tier) in front of your domain and configure headers via Page Rules / Transform Rules
> - Migrate hosting to **Vercel** or **Netlify**, which support header configuration via `vercel.json` / `_headers`
> - Add `<meta>` tags for limited CSP support (see fix below)

**Quick win — add meta-based CSP to** [`Layout.astro`](file:///c:/Users/agrik/Documents/logicpath/src/layouts/Layout.astro):
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net; 
               font-src 'self' https://fonts.gstatic.com; 
               img-src 'self' data: https:; 
               connect-src 'self' https://formspree.io; 
               frame-ancestors 'none';">
```

---

### 2. Contact Form — No Rate Limiting or CAPTCHA

Your contact form at [`index.astro:204`](file:///c:/Users/agrik/Documents/logicpath/src/pages/index.astro#L204) posts directly to Formspree with **no bot protection**:

```html
<form id="contactForm" action="https://formspree.io/f/mqelryww" method="POST">
```

**Risks:** Spam floods, Formspree quota exhaustion, email bombing.

**Fixes:**
- Enable **Formspree's built-in reCAPTCHA** from your [Formspree dashboard](https://formspree.io)
- Or add a **honeypot field** (hidden field that only bots fill):
```html
<input type="text" name="_gotcha" style="display:none" tabindex="-1" autocomplete="off">
```
- Consider **client-side rate limiting** (disable button for 30s after submit)

---

### 3. Subresource Integrity (SRI) Missing on CDN Resources

You load external resources without integrity checks in [`Layout.astro`](file:///c:/Users/agrik/Documents/logicpath/src/layouts/Layout.astro#L37-L40):

```html
<!-- No SRI hash — if CDN is compromised, malicious code runs on your site -->
<link href="https://fonts.googleapis.com/css2?family=..." rel="stylesheet">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css">
```

> [!WARNING]
> The **Devicon CDN link uses `@latest`**, meaning the content can change at any time. Pin to a specific version and add an SRI hash:
> ```html
> <link rel="stylesheet" 
>       href="https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/devicon.min.css"
>       integrity="sha384-<hash>" crossorigin="anonymous">
> ```

---

## 🟡 Medium Priority

### 4. No `robots.txt`

Your [`public/`](file:///c:/Users/agrik/Documents/logicpath/public) directory has no `robots.txt`. While not strictly a security issue, it means crawlers have no guidance. Create `public/robots.txt`:

```
User-agent: *
Allow: /
Sitemap: https://logicpathsystems.com/sitemap-index.xml

# Block sensitive paths if any exist
Disallow: /api/
```

### 5. `innerHTML` Usage in Form Handler

The form handler in [`index.astro:655-661`](file:///c:/Users/agrik/Documents/logicpath/src/pages/index.astro#L655-L661) uses `innerHTML` with hardcoded strings:

```javascript
msgDiv.innerHTML = '<div style="...">Message sent successfully!</div>';
```

While these are **hardcoded strings** (not user input), using `innerHTML` is a bad habit. Safer approach using `textContent` + DOM API:

```javascript
const successDiv = document.createElement('div');
successDiv.textContent = 'Message sent successfully! We will get back to you soon.';
successDiv.style.cssText = 'color:var(--accent-secondary); margin-top:1rem; padding:1rem; background:rgba(34,211,238,0.1); border-radius:8px;';
msgDiv.replaceChildren(successDiv);
```

### 6. Formspree Endpoint Exposed in Source

Your Formspree form ID (`mqelryww`) is visible in [`index.astro:204`](file:///c:/Users/agrik/Documents/logicpath/src/pages/index.astro#L204). This is inherent to client-side forms, but:
- Enable **domain restriction** on Formspree (only accept submissions from `logicpathsystems.com`)
- This prevents attackers from using your form endpoint from their own pages

### 7. Missing `crossorigin` on Preconnect

In [`Layout.astro:35-36`](file:///c:/Users/agrik/Documents/logicpath/src/layouts/Layout.astro#L35-L36):
```html
<link rel="preconnect" href="https://fonts.googleapis.com">           <!-- missing crossorigin -->
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>  <!-- ✅ correct -->
```
The first preconnect should also have `crossorigin` for proper CORS:
```html
<link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>
```

---

## 🟢 Low Priority (Best Practices)

### 8. Pin GitHub Actions Versions

Your [`deploy.yml`](file:///c:/Users/agrik/Documents/logicpath/.github/workflows/deploy.yml) uses tag-based versions:
```yaml
uses: actions/checkout@v4
uses: actions/setup-node@v4
```
**Pin to full commit SHAs** to prevent supply-chain attacks:
```yaml
uses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11  # v4.1.1
uses: actions/setup-node@60edb5dd545a775178f52524783378180af0d1f8  # v4.0.2
```

### 9. External Link Security ✅

All `target="_blank"` links already have `rel="noopener noreferrer"` — this is correctly implemented across all pages. No action needed.

### 10. Add `X-Content-Type-Options` via Meta (Limited)

While meta tags can't set `X-Content-Type-Options`, you can at least enforce type hints:
```html
<meta http-equiv="X-UA-Compatible" content="IE=edge">
```

---

## 📋 Action Checklist

| # | Action | Effort | Impact |
|---|--------|--------|--------|
| 1 | Add meta CSP to `Layout.astro` | 5 min | 🔴 High |
| 2 | Enable reCAPTCHA on Formspree + add honeypot | 10 min | 🔴 High |
| 3 | Pin Devicon CDN to specific version | 5 min | 🔴 High |
| 4 | Create `public/robots.txt` | 2 min | 🟡 Medium |
| 5 | Replace `innerHTML` with DOM API | 15 min | 🟡 Medium |
| 6 | Enable domain restriction on Formspree | 5 min | 🟡 Medium |
| 7 | Add `crossorigin` to fonts preconnect | 1 min | 🟡 Medium |
| 8 | Pin GitHub Actions to commit SHAs | 10 min | 🟢 Low |
| 9 | Consider Cloudflare/Vercel for full header control | 30 min | 🔴 High |

> [!TIP]
> The **single biggest improvement** you can make is putting **Cloudflare** (free) in front of your GitHub Pages site. This gives you proper HTTP security headers, DDoS protection, SSL management, and caching — all without changing hosts.

Would you like me to implement any of these fixes?
