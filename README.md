# Outshift Design — Content Guide

Live site: **https://vaesposito.github.io/outshift-design/**  
Repository: **https://github.com/vaesposito/outshift-design**

---

## Project structure

```
outshift-design-main/
├── index.html                        # Homepage
├── hax.html                          # The Human-Agent Experience initiative
├── research.html                     # Research hub
├── blog.html                         # Blog listing page
├── making-room-for-agents.html       # Blog article (inline HTML)
├── building-accessible-interfaces.html
├── future-of-design-systems.html
├── foundational-principles.html
├── cognitive-frameworks.html
├── societal-impact.html
├── security-privacy.html
├── human-centered-ai-patterns.html
├── guiding-principles.html
├── agent-impact-map.html
├── cognitive-load-audit.html
├── foresight-canvas.html
├── assistant.js                      # Shared AI chat widget + nav JS
├── images/
│   ├── blog/                         # Blog cover images & article assets
│   │   ├── making-room-agents/       # Article images (SVG mockups)
│   │   ├── navigating-multi-agent-future.png
│   │   └── ai-ethics-and-design.svg
│   └── outshift_logo.svg / outshift_logo-white.svg
├── videos/                           # Hero videos (e.g. hax-hero.mp4)
├── files/                            # PDFs (e.g. ai-ethics-and-design.pdf)
├── robots.txt
└── sitemap.xml
```

---

## How to add a blog article

### 1. Create the article page

Copy an existing article as a template:

```bash
cp making-room-for-agents.html my-new-article.html
```

Key sections to update inside the file:

| Element | What to change |
|---|---|
| `<title>` | Article title — Outshift Design |
| `<meta name="description">` | 1–2 sentence summary |
| `<meta property="og:title/description/url/image">` | Social preview data |
| `<script type="application/ld+json">` | JSON-LD Article schema (headline, author, date, keywords) |
| `.breadcrumb` | Update the last breadcrumb item to the article title |
| `.article-meta` | Update tags and date |
| `<h1>` | Article title |
| `.author-name` / `.author-title` | Author details |
| `.author-avatar img` | Author headshot — place in `images/blog/<slug>/` |
| `.article-body` | Article content (HTML) |

### 2. Add images

Place article images in `images/blog/<article-slug>/`:

```
images/blog/my-new-article/
├── hero.png          # Cover image (used in blog card, 1200×630 recommended)
├── author.jpg        # Author headshot (square, min 80×80)
└── figure-01.png     # Any inline content images
```

Reference them in HTML as `src="images/blog/my-new-article/hero.png"`.

**Images are expandable in a lightbox modal** — add `class="article-img"` or wrap pairs in `<div class="article-img-pair">` to get click-to-expand automatically.

### 3. Add the blog card to `blog.html`

Inside `<!-- Blog Grid -->`, add a new card before the closing `</div>`:

```html
<a href="my-new-article.html" class="blog-card-item" data-tags="design,ai,product-design">
  <div class="blog-card-cover">
    <img src="images/blog/my-new-article/hero.png" alt="Article title">
  </div>
  <div class="blog-card-body">
    <div class="blog-card-tags">
      <span class="blog-card-tag">Design</span>
      <span class="blog-card-tag">AI</span>
    </div>
    <h3>My Article Title</h3>
    <p class="blog-card-desc">Short description of the article.</p>
    <div class="blog-card-meta">
      <span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
        Author Name
      </span>
      <span>Month Day, Year</span>
    </div>
    <div class="blog-card-footer">
      <span class="blog-read-time">X min read</span>
      <span class="blog-read-more">Read more →</span>
    </div>
  </div>
</a>
```

**`data-tags`** must use kebab-case and match the filter buttons: `research`, `ai`, `ai-ethics`, `product-design`, `design`.

### 4. Add the card to the homepage (optional)

In `index.html`, find the `<!-- Blog -->` section and add a `.blog-card` element matching the existing ones.

### 5. Update the sitemap

Add a new `<url>` entry to `sitemap.xml`:

```xml
<url>
  <loc>https://vaesposito.github.io/outshift-design/my-new-article.html</loc>
  <priority>0.8</priority>
</url>
```

---

## How to edit existing content

### Text content
All content is plain HTML — open the relevant `.html` file and edit directly.

### Navigation
The nav is **duplicated inline** in every page's `<style>` and bottom `<script>` block (no shared CSS file). To change a nav link across all pages, update each file or use a bulk find-and-replace.

### Theme / design tokens
CSS variables are defined in each page's `<style>` block under `:root` (light) and `[data-theme="dark"]` (dark). Key tokens:

| Variable | Use |
|---|---|
| `--color-bg` | Page background |
| `--color-text` | Primary text |
| `--color-text-muted` | Secondary text |
| `--color-accent` | Brand cyan (`#00BCEB`) |
| `--color-surface` | Header / card background |
| `--color-border` | Borders |

### Hero videos
Place `.mp4` files in `videos/` and reference them in the `<video>` tag of the relevant page.

---

## Deployment

The site deploys automatically to GitHub Pages on every push to `main`.  
Deployment takes ~1–2 minutes. Check status at:  
`https://github.com/vaesposito/outshift-design/actions`

```bash
git add .
git commit -m "Your message"
git push
```

---

## For AI agents

- All pages are crawlable (`robots.txt` allows all)
- `sitemap.xml` lists all public pages
- Key pages have Open Graph, Twitter Card, and JSON-LD structured data
- The site is static HTML/CSS/JS — no build step required
- To add a page: copy an existing `.html` file, edit content, add a blog card, update `sitemap.xml`, commit and push
- There is no CMS — all content lives directly in the HTML files in this repository
