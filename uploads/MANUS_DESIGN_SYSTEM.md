# MANUS.IM DESIGN SYSTEM — CHEATCODE
**Professional app design extracted directly from Manus brand**

---

## 1. COLOR PALETTE (minimal = luxury)

**Manus uses 3-color only system:**

```css
/* Primary Colors */
--color-black: #34322D;      /* Logo, dark text, primary elements */
--color-gray: #F8F8F8;       /* Light backgrounds, surfaces */
--color-white: #FFFFFF;      /* Pure white - backgrounds */
```

**Usage rules:**
- Black text on white/gray backgrounds (high contrast)
- White backgrounds with gray accents for subtle depth
- NO additional colors needed for basic UI
- Think: minimalist, timeless, trust

**RGB Values (for reference):**
- Black: RGB(43, 7, 18)
- Gray: RGB(0, 0, 97) [near-white]
- White: RGB(0, 0, 100)

---

## 2. TYPOGRAPHY (2 fonts only)

### Display Font: **DM Sans** (Google Fonts)
- Geometric clarity, modern character
- Use for: headings, titles, bold contrast
- Weights: Regular (400), Bold (700)
- Letter spacing: tight, confident

### Body Font: **Libre Baskerville** (Google Fonts)
- Elegant serif for refinement
- Use for: long-form content, promotional materials
- Weights: Regular (400), Bold (700), Italic
- Pairs beautifully with DM Sans

### Asian/Global: **Noto Sans** + **Noto Serif** (Google Fonts)
- Fallback for wide language support
- Maintains brand consistency worldwide

### Size Scale (start here):
```
H1: 32px / 700 / DM Sans   (page titles)
H2: 24px / 700 / DM Sans   (section headers)
H3: 18px / 600 / DM Sans   (subsections)
Body: 16px / 400 / Libre Baskerville  (default text)
Small: 14px / 400 / DM Sans  (captions, labels)
Tiny: 12px / 400 / DM Sans   (metadata, timestamps)
```

**Line Height:**
- Headings: 1.2
- Body text: 1.6 (elegant, breathing room)

---

## 3. SPACING (8px grid system)

Manus uses consistent 8px grid. All spacing = multiple of 8.

```css
/* Margin / Padding */
--spacing-xs: 4px;       /* tight micro-spacing */
--spacing-sm: 8px;       /* small gaps */
--spacing-md: 16px;      /* standard padding */
--spacing-lg: 24px;      /* card/section padding */
--spacing-xl: 32px;      /* major section breaks */
--spacing-2xl: 48px;     /* page-level gaps */
--spacing-3xl: 64px;     /* hero sections */
```

**Real-world usage:**
```css
.card {
  padding: 24px;           /* lg spacing = premium feel */
  margin-bottom: 32px;     /* xl between sections */
  border-radius: 8px;
}

.container {
  padding: 24px;
}

.section-gap {
  margin-bottom: 48px;
}

.micro-gap {
  gap: 8px;
}
```

---

## 4. BORDER RADIUS (subtle, not rounded)

Manus aesthetic: minimal rounding

```css
--radius-sm: 4px;       /* buttons, small components */
--radius-md: 8px;       /* cards, containers */
--radius-lg: 12px;      /* large containers, modals */
--radius-full: 50%;     /* circles/avatars only */
```

**Rule:** Most elements use 8px. Never go above 16px (too bubble-like).

---

## 5. BUTTONS (ghost style)

Manus uses **transparent buttons with borders**, not filled.

```html
<button class="btn-primary">Action</button>
<button class="btn-secondary">Cancel</button>
```

```css
.btn-primary {
  padding: 10px 20px;
  background: transparent;
  border: 1.5px solid #34322D;  /* black border */
  color: #34322D;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: #F8F8F8;  /* light gray fill on hover */
  border-color: #34322D;
}

.btn-primary:active {
  transform: scale(0.98);
  background: #f0f0f0;
}

.btn-secondary {
  padding: 10px 20px;
  background: transparent;
  border: 1.5px solid #d0d0d0;  /* light gray border */
  color: #666;
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
}

.btn-secondary:hover {
  background: #fafafa;
  border-color: #999;
}
```

---

## 6. CARDS & CONTAINERS

Manus style: clean white with subtle gray background behind.

```css
.card {
  background: #FFFFFF;
  border: 1px solid #e8e8e8;  /* barely-there border */
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);  /* subtle shadow */
}

.card-header {
  font-size: 18px;
  font-weight: 700;
  font-family: 'DM Sans', sans-serif;
  margin-bottom: 16px;
  color: #34322D;
}

.card-body {
  font-size: 16px;
  font-family: 'Libre Baskerville', serif;
  color: #34322D;
  line-height: 1.6;
}

.surface-background {
  background: #F8F8F8;  /* light gray for depth */
  padding: 32px;
  border-radius: 12px;
}
```

---

## 7. TYPOGRAPHY HIERARCHY (in practice)

```html
<h1>Dashboard</h1>  <!-- 32px / bold / DM Sans -->
<p>Weekly overview</p>  <!-- 14px / regular / muted gray -->

<h2>Recent Activity</h2>  <!-- 24px / bold / DM Sans -->
<p>Curated insights from your workspace</p>  <!-- 16px serif -->

<h3>Q4 Revenue</h3>  <!-- 18px / bold / DM Sans -->
<p class="label">Performance metric</p>  <!-- 12px / uppercase / gray -->
```

**CSS:**
```css
h1, h2, h3 { font-family: 'DM Sans', sans-serif; font-weight: 700; }
h1 { font-size: 32px; line-height: 1.2; }
h2 { font-size: 24px; line-height: 1.3; }
h3 { font-size: 18px; line-height: 1.4; }

p { font-family: 'Libre Baskerville', serif; font-size: 16px; line-height: 1.6; }
p.label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #999; }
p.muted { color: #999; font-size: 14px; }
```

---

## 8. BORDERS & DIVIDERS

Manus aesthetic: LIGHT borders only, not heavy

```css
/* Border colors */
--border-primary: 1px solid #e8e8e8;   /* light gray */
--border-secondary: 1px solid #f0f0f0; /* very light */
--border-dark: 1.5px solid #34322D;    /* only for emphasis */

/* Dividers between sections */
.divider {
  height: 1px;
  background: #e8e8e8;
  margin: 32px 0;
}

.divider-light {
  height: 1px;
  background: #f0f0f0;
}
```

---

## 9. FORMS & INPUTS

Manus style: minimal, clean input fields

```css
input[type="text"],
input[type="email"],
textarea,
select {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  background: #FFFFFF;
  color: #34322D;
  transition: border-color 0.2s;
}

input:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: #34322D;
  box-shadow: 0 0 0 3px rgba(52, 50, 45, 0.1);
}

input::placeholder {
  color: #d0d0d0;
}

label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  color: #666;
  margin-bottom: 8px;
  letter-spacing: 0.5px;
}
```

---

## 10. ICONS & VISUAL ELEMENTS

Manus uses **minimal, geometric icons** (no filled emojis/cartoons).

**Recommended icon libraries that match Manus style:**
- **Feather Icons** (perfect minimalist style)
- **Heroicons** (clean, geometric)
- **System UIcons** (ultra-minimal)
- **Tabler Icons** (modern, consistent)

**Icon usage:**
```html
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#34322D" stroke-width="1.5">
  <!-- icon path -->
</svg>
```

**Style rules:**
- Stroke width: 1.5px (not too thin)
- Size: 16px (small), 24px (standard), 32px (large)
- Color: Always match text color (#34322D or muted gray)
- No filled icons
- No emoji

---

## 11. SHADOWS (extremely subtle)

Manus doesn't use heavy shadows. Minimal depth.

```css
/* Subtle elevation */
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 2px 4px rgba(0, 0, 0, 0.08);
--shadow-lg: 0 4px 8px rgba(0, 0, 0, 0.10);

/* Usage */
.card {
  box-shadow: var(--shadow-md);
}

.modal {
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
}
```

---

## 12. RESPONSIVE BREAKPOINTS

```css
/* Mobile first */
--breakpoint-sm: 640px;   /* small devices */
--breakpoint-md: 768px;   /* tablets */
--breakpoint-lg: 1024px;  /* desktops */
--breakpoint-xl: 1280px;  /* large screens */
```

**Spacing adjustments for mobile:**
```css
@media (max-width: 768px) {
  .container {
    padding: 16px;  /* reduce from 24px */
  }
  
  h1 { font-size: 24px; }  /* reduce from 32px */
  h2 { font-size: 18px; }  /* reduce from 24px */
}
```

---

## 13. COMPLETE STARTER CSS

```css
/* Imports */
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&family=Libre+Baskerville:wght@400;700&display=swap');

/* Root variables */
:root {
  /* Colors */
  --color-black: #34322D;
  --color-gray: #F8F8F8;
  --color-white: #FFFFFF;
  --color-text-muted: #999999;
  --color-border: #e8e8e8;
  
  /* Typography */
  --font-display: 'DM Sans', sans-serif;
  --font-body: 'Libre Baskerville', serif;
  
  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  
  /* Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 2px 4px rgba(0, 0, 0, 0.08);
}

/* Reset */
* { margin: 0; padding: 0; box-sizing: border-box; }

/* Base */
html { font-size: 16px; }
body {
  font-family: var(--font-body);
  color: var(--color-black);
  background: var(--color-white);
  line-height: 1.6;
}

/* Typography */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-display);
  font-weight: 700;
  margin-bottom: var(--spacing-md);
}
h1 { font-size: 32px; line-height: 1.2; }
h2 { font-size: 24px; line-height: 1.3; }
h3 { font-size: 18px; line-height: 1.4; }

p { margin-bottom: var(--spacing-md); }

/* Buttons */
button {
  padding: 10px 20px;
  background: transparent;
  border: 1.5px solid var(--color-black);
  color: var(--color-black);
  font-family: var(--font-display);
  font-weight: 600;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s;
}

button:hover {
  background: var(--color-gray);
}

button:active {
  transform: scale(0.98);
}

/* Cards */
.card {
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-md);
}

/* Container */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-lg);
}

/* Utilities */
.text-muted { color: var(--color-text-muted); }
.text-small { font-size: 12px; }
.text-label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
.gap-sm { gap: var(--spacing-sm); }
.gap-md { gap: var(--spacing-md); }
.divider { border-top: 1px solid var(--color-border); margin: var(--spacing-xl) 0; }
```

---

## 14. QUICK CHECKLIST ✓

Before shipping your app:

- [ ] Only 3 colors used (black, gray, white)
- [ ] DM Sans for headings, Libre Baskerville for body
- [ ] All spacing = 8px multiples (8, 16, 24, 32, etc.)
- [ ] Border radius = 8px or 4px (no 16px unless circles)
- [ ] Buttons are ghost style (border only)
- [ ] Shadows are subtle (not bold)
- [ ] Line height ≥ 1.6 for body text
- [ ] Icons are geometric, 1.5px stroke
- [ ] No heavy borders
- [ ] Cards have white bg + light gray border + subtle shadow

---

## 15. LIVE EXAMPLES

See professional Manus-style components in action:
- https://manus.im/brand
- https://manus.im/pricing
- https://manus.im/app/agents

---

**Manus Design Philosophy:**
*"Less structure, more intelligence."*

Minimal colors. Elegant typography. Generous spacing. Trust the whitespace.
Clean, timeless, professional. That's Manus.
