// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://logicpathsystems.com',
  integrations: [sitemap()],
  security: {
    // Emitted as a <meta> CSP; script/style hashes are generated at build time.
    // Only testable with `npm run build && npm run preview` (not in dev).
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self' https://fonts.gstatic.com",
        "connect-src 'self' https://formspree.io",
        "form-action 'self' https://formspree.io",
        "base-uri 'self'",
        "object-src 'none'",
        "upgrade-insecure-requests"
      ],
      scriptDirective: {
        resources: ["'self'"]
      },
      styleDirective: {
        resources: [
          { resource: "'self'", kind: 'element' },
          { resource: 'https://fonts.googleapis.com', kind: 'element' },
          // Legal pages use inline style="" attributes
          { resource: "'unsafe-inline'", kind: 'attribute' }
        ]
      }
    }
  }
});
