# Group Sense — Design System Reference
> Restrained, content-first dashboard aesthetic on a warm neutral canvas

Dark mode is activated by adding `.dark` to `<html>`. All semantic tokens below switch automatically.

---

## Primitive Palette (`--color-*`)

These are raw values — never use them directly in components. Reference them only inside `:root` / `:root.dark` blocks.

| Name | Token | Value |
|------|-------|-------|
| Pitch Black | `--color-pitch-black` | `#08090a` |
| Graphite | `--color-graphite` | `#0f1011` |
| Deep Slate | `--color-deep-slate` | `#161718` |
| Charcoal Grey | `--color-charcoal-grey` | `#23252a` |
| Muted Ash | `--color-muted-ash` | `#323334` |
| Gunmetal | `--color-gunmetal` | `#383b3f` |
| Porcelain | `--color-porcelain` | `#f7f8f8` |
| Light Steel | `--color-light-steel` | `#d0d6e0` |
| Storm Cloud | `--color-storm-cloud` | `#8a8f98` |
| Fog Grey | `--color-fog-grey` | `#62666d` |
| Alabaster | `--color-alabaster` | `#e5e5e6` |
| Neon Lime | `--color-neon-lime` | `#e4f222` |
| Aether Blue | `--color-aether-blue` | `#5e6ad2` |
| Forest Green | `--color-forest-green` | `#008d2c` |
| Cyan Spark | `--color-cyan-spark` | `#02b8cc` |
| Emerald | `--color-emerald` | `#27a644` |
| Warning Red | `--color-warning-red` | `#eb5757` |
| Deep Violet | `--color-deep-violet` | `#6366f1` |
| Amethyst | `--color-amethyst` | `#8b5cf6` |

---

## Light Theme — `:root`

> Default. Active when no `.dark` class is on `<html>`.

### Core

| Token | Value | Role |
|-------|-------|------|
| `--ink` | `#111111` | Primary text, icons |
| `--ink-2` | `#6d6c6b` | Secondary text |
| `--muted` | `#6d6c6b` | Muted/placeholder text |
| `--faint` | `#ecebea` | Subtle fills, input placeholder |
| `--surface` | `#f4f3ef` | Page panels, sidebar |
| `--surface-2` | `#ecebea` | Nested surfaces, hover bg |
| `--white` | `#ffffff` | Cards, modal backgrounds |
| `--border` | `rgba(17, 17, 17, 0.08)` | Default borders |
| `--border-light` | `rgba(17, 17, 17, 0.04)` | Subtle dividers |
| `--ink-hover` | `#0067ff` | Hovered ink (buttons, links) |
| `--focus-ring` | `rgba(17, 17, 17, 0.08)` | Input focus ring |
| `--modal-backdrop` | `rgba(17, 17, 17, 0.35)` | Modal overlay |

### Accent / Status

| Token | Value | Role |
|-------|-------|------|
| `--accent-success` | `#47d096` | Success states |
| `--accent-warn` | `#e16540` | Warnings, destructive |
| `--accent-info` | `#328efa` | Info, primary CTA blue |
| `--accent-gold` | `#fbc768` | Highlights, engagement |
| `--color-success-soft` | `rgba(71, 208, 150, 0.1)` | Success badge bg |
| `--color-warning-soft` | `rgba(225, 101, 64, 0.1)` | Warning badge bg |
| `--color-info-soft` | `rgba(50, 142, 250, 0.1)` | Info badge bg |
| `--color-destructive-accent` | `#e16540` | Destructive action text/icon |
| `--color-destructive-soft` | `rgba(225, 101, 64, 0.1)` | Destructive badge bg |

### Semantic Shorthand

| Token | Value | Role |
|-------|-------|------|
| `--page-bg` | `#f8f8f7` | App body background |
| `--card-bg` | `#ffffff` | Card background |
| `--text-primary` | `#34322d` | Body text in data views |
| `--text-secondary` | `#858481` | Sub-labels, meta text |
| `--hover-bg` | `#37352f0a` | Hover state bg |
| `--active-bg` | `#37352f0f` | Active/selected bg |
| `--input-bg` | `#ffffff` | Input background |
| `--placeholder-color` | `#858481` | Input placeholder |
| `--divider` | `rgba(0, 0, 0, 0.06)` | Table/list row dividers |
| `--card-border` | `rgba(0, 0, 0, 0.12)` | Dashboard card borders |

### Nav / Sidebar

| Token | Value |
|-------|-------|
| `--nav-bg` | `#EBEBEB` |
| `--nav-icon-color` | `#34322d` |
| `--nav-text-color` | `#34322D` |
| `--nav-hover-bg` | `#37352f0a` |
| `--nav-active-bg` | `#37352f0f` |

### Shadows

| Token | Value |
|-------|-------|
| `--shadow-subtle` | `rgba(17, 17, 17, 0.05) 0px 0px 0px 1px inset` |
| `--shadow-sm` | `rgba(17, 17, 17, 0.02) 0px -6px 6px 0px, rgba(17, 17, 17, 0.01) 0px -23px 9px 0px` |
| `--shadow-md` | `rgba(17, 17, 17, 0.04) 0px 4px 8px 0px, rgba(17, 17, 17, 0.04) 0px 0px 1px 0px` |
| `--shadow-lg` | `rgba(17, 17, 17, 0.12) 0px 26px 60px -6px, rgba(17, 17, 17, 0.02) 0px 28px 28px -14px` |

### Quick Reference CSS

```css
:root {
  --ink: #111111;
  --ink-2: #6d6c6b;
  --muted: #6d6c6b;
  --faint: #ecebea;
  --surface: #f4f3ef;
  --surface-2: #ecebea;
  --white: #ffffff;
  --border: rgba(17, 17, 17, 0.08);
  --border-light: rgba(17, 17, 17, 0.04);
  --ink-hover: #272625;
  --focus-ring: rgba(17, 17, 17, 0.08);
  --modal-backdrop: rgba(17, 17, 17, 0.35);

  --accent-success: #47d096;
  --accent-warn: #e16540;
  --accent-info: #328efa;
  --accent-gold: #fbc768;
  --color-success-soft: rgba(71, 208, 150, 0.1);
  --color-warning-soft: rgba(225, 101, 64, 0.1);
  --color-info-soft: rgba(50, 142, 250, 0.1);
  --color-destructive-accent: #e16540;
  --color-destructive-soft: rgba(225, 101, 64, 0.1);

  --page-bg: #f8f8f7;
  --card-bg: #ffffff;
  --text-primary: #34322d;
  --text-secondary: #858481;
  --hover-bg: #37352f0a;
  --active-bg: #37352f0f;
  --input-bg: #ffffff;
  --placeholder-color: #858481;
  --divider: rgba(0, 0, 0, 0.06);
  --card-border: rgba(0, 0, 0, 0.12);

  --nav-bg: #EBEBEB;
  --nav-icon-color: #34322d;
  --nav-text-color: #34322D;
  --nav-hover-bg: #37352f0a;
  --nav-active-bg: #37352f0f;

  --shadow-subtle: rgba(17, 17, 17, 0.05) 0px 0px 0px 1px inset;
  --shadow-sm: rgba(17, 17, 17, 0.02) 0px -6px 6px 0px, rgba(17, 17, 17, 0.01) 0px -23px 9px 0px;
  --shadow-md: rgba(17, 17, 17, 0.04) 0px 4px 8px 0px, rgba(17, 17, 17, 0.04) 0px 0px 1px 0px;
  --shadow-lg: rgba(17, 17, 17, 0.12) 0px 26px 60px -6px, rgba(17, 17, 17, 0.02) 0px 28px 28px -14px;
}
```

---

## Dark Theme — `:root.dark`

> Active when `<html class="dark">`. Only overridden tokens are listed — everything else inherits from `:root`.

### Core

| Token | Value | Resolves to |
|-------|-------|-------------|
| `--ink` | `var(--color-porcelain)` | `#f7f8f8` |
| `--ink-2` | `var(--color-light-steel)` | `#d0d6e0` |
| `--muted` | `var(--color-storm-cloud)` | `#8a8f98` |
| `--faint` | `var(--color-gunmetal)` | `#383b3f` |
| `--surface` | `var(--color-charcoal-grey)` | `#23252a` |
| `--surface-2` | `var(--color-graphite)` | `#0f1011` |
| `--white` | `var(--color-deep-slate)` | `#161718` |
| `--border` | `rgba(255, 255, 255, 0.08)` | — |
| `--border-light` | `rgba(255, 255, 255, 0.04)` | — |
| `--ink-hover` | `var(--color-porcelain)` | `#f7f8f8` |
| `--focus-ring` | `rgba(255, 255, 255, 0.12)` | — |
| `--modal-backdrop` | `rgba(8, 9, 10, 0.85)` | — |

### Accent / Status

| Token | Value | Resolves to |
|-------|-------|-------------|
| `--accent-success` | `var(--color-emerald)` | `#27a644` |
| `--accent-warn` | `var(--color-warning-red)` | `#eb5757` |
| `--accent-info` | `var(--color-aether-blue)` | `#5e6ad2` |
| `--accent-gold` | `var(--color-neon-lime)` | `#e4f222` |
| `--color-success-soft` | `rgba(39, 166, 68, 0.15)` | — |
| `--color-warning-soft` | `rgba(235, 87, 87, 0.15)` | — |
| `--color-info-soft` | `rgba(94, 106, 210, 0.15)` | — |
| `--color-destructive-accent` | `var(--color-warning-red)` | `#eb5757` |
| `--color-destructive-soft` | `rgba(235, 87, 87, 0.15)` | — |

### Semantic Shorthand

| Token | Value | Resolves to |
|-------|-------|-------------|
| `--page-bg` | `var(--color-deep-slate)` | `#161718` |
| `--card-bg` | `var(--color-charcoal-grey)` | `#23252a` |
| `--text-primary` | `var(--color-porcelain)` | `#f7f8f8` |
| `--text-secondary` | `var(--color-storm-cloud)` | `#8a8f98` |
| `--hover-bg` | `rgba(255, 255, 255, 0.05)` | — |
| `--active-bg` | `rgba(255, 255, 255, 0.09)` | — |
| `--input-bg` | `var(--color-muted-ash)` | `#323334` |
| `--placeholder-color` | `var(--color-fog-grey)` | `#62666d` |
| `--divider` | `rgba(255, 255, 255, 0.07)` | — |
| `--card-border` | `var(--color-gunmetal)` | `#383b3f` |

### Nav / Sidebar

| Token | Value | Resolves to |
|-------|-------|-------------|
| `--nav-bg` | `var(--color-graphite)` | `#0f1011` |
| `--nav-icon-color` | `var(--color-storm-cloud)` | `#8a8f98` |
| `--nav-text-color` | `var(--color-light-steel)` | `#d0d6e0` |
| `--nav-hover-bg` | `rgba(255, 255, 255, 0.05)` | — |
| `--nav-active-bg` | `rgba(255, 255, 255, 0.09)` | — |

### Shadows

| Token | Value |
|-------|-------|
| `--shadow-sm` | `rgba(0, 0, 0, 0.4) 0px -6px 6px 0px, rgba(0, 0, 0, 0.2) 0px -23px 9px 0px` |
| `--shadow-md` | `rgba(0, 0, 0, 0.5) 0px 4px 8px 0px` |
| `--shadow-lg` | `rgba(0, 0, 0, 0.7) 0px 26px 60px -6px` |

### Quick Reference CSS

```css
:root.dark {
  --ink: var(--color-porcelain);        /* #f7f8f8 */
  --ink-2: var(--color-light-steel);    /* #d0d6e0 */
  --muted: var(--color-storm-cloud);    /* #8a8f98 */
  --faint: var(--color-gunmetal);       /* #383b3f */
  --surface: var(--color-charcoal-grey); /* #23252a */
  --surface-2: var(--color-graphite);   /* #0f1011 */
  --white: var(--color-deep-slate);     /* #161718 */
  --border: rgba(255, 255, 255, 0.08);
  --border-light: rgba(255, 255, 255, 0.04);
  --ink-hover: var(--color-porcelain);
  --focus-ring: rgba(255, 255, 255, 0.12);
  --modal-backdrop: rgba(8, 9, 10, 0.85);

  --accent-success: var(--color-emerald);       /* #27a644 */
  --accent-warn: var(--color-warning-red);      /* #eb5757 */
  --accent-info: var(--color-aether-blue);      /* #5e6ad2 */
  --accent-gold: var(--color-neon-lime);        /* #e4f222 */
  --color-success-soft: rgba(39, 166, 68, 0.15);
  --color-warning-soft: rgba(235, 87, 87, 0.15);
  --color-info-soft: rgba(94, 106, 210, 0.15);
  --color-destructive-accent: var(--color-warning-red);
  --color-destructive-soft: rgba(235, 87, 87, 0.15);

  --page-bg: var(--color-deep-slate);
  --card-bg: var(--color-charcoal-grey);
  --text-primary: var(--color-porcelain);
  --text-secondary: var(--color-storm-cloud);
  --hover-bg: rgba(255, 255, 255, 0.05);
  --active-bg: rgba(255, 255, 255, 0.09);
  --input-bg: var(--color-muted-ash);
  --placeholder-color: var(--color-fog-grey);
  --divider: rgba(255, 255, 255, 0.07);
  --card-border: var(--color-gunmetal);

  --nav-bg: var(--color-graphite);
  --nav-icon-color: var(--color-storm-cloud);
  --nav-text-color: var(--color-light-steel);
  --nav-hover-bg: rgba(255, 255, 255, 0.05);
  --nav-active-bg: rgba(255, 255, 255, 0.09);

  --shadow-sm: rgba(0, 0, 0, 0.4) 0px -6px 6px 0px, rgba(0, 0, 0, 0.2) 0px -23px 9px 0px;
  --shadow-md: rgba(0, 0, 0, 0.5) 0px 4px 8px 0px;
  --shadow-lg: rgba(0, 0, 0, 0.7) 0px 26px 60px -6px;
}
```

---

## Typography

**Typeface:** `Inter` via Google Fonts — token `--font`
**Fallback:** `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
**Body defaults:** 14px, line-height 1.3, letter-spacing 0.25px, `-webkit-font-smoothing: antialiased`

### Type Scale

| Role | Token | Size | Line Height | Letter Spacing | Weight |
|------|-------|------|-------------|----------------|--------|
| caption | `--text-caption` | 10px | — | — | — |
| body | `--text-body` | 14px | 1.3 | 0.25px | — |
| subheading | `--text-subheading` | 20px | 1.1 | -0.2px | 600 |
| heading-sm | `--text-heading-sm` | 24px | 1.1 | -0.26px | 600 |
| heading | `--text-heading` | 28px | 1.1 | -0.48px | 600 |

**Special:** Hero/empty-state title — `Georgia, serif`, 40px, weight 400, letter-spacing -0.8px

---

## Shape & Layout

### Border Radius

| Token | Value | Used for |
|-------|-------|----------|
| `--r-sm` | `4px` | Badges, tiny chips |
| `--r-md` | `8px` | Buttons, tabs, icon buttons |
| `--r-lg` | `12px` | Cards, inputs, modals, dialogs |
| *(hardcoded)* | `10px` | Nav items, modal secondary buttons |
| *(hardcoded)* | `18px` | Dashboard data cards (`.mgc`, `.nlv-card`) |
| *(hardcoded)* | `22px` | Composer / chat input |

### Layout

| Token | Value |
|-------|-------|
| `--sidebar-w` | `260px` |
| `--sidebar-w-collapsed` | `52px` |
| Page max-width | `1100px` (`.page`), `760px` (chat) |
| Page padding | `32px 28px 64px` |
| Card padding | `20px` |

---

## Components

### Buttons

| Class | Background | Border | Color | Padding | Radius |
|-------|-----------|--------|-------|---------|--------|
| `.btn` | transparent | `1.5px solid --ink` | `--ink` | `9px 16px` | `--r-md` |
| `.btn-primary` | `--ink` | `--ink` | `--white` | `9px 16px` | `--r-md` |
| `.btn-ghost` | transparent | `--border` | `--ink-2` | `9px 16px` | `--r-md` |
| `.btn-sm` | — | — | — | `6px 12px` | — |
| `.mgc-btn-sync` | `#0067ff` | none | white | `12px 20px` | `10px` |
| `.mgc-btn-later` | white | `1px solid #e8e6e0` | `#34322d` | `12px 15px` | `10px` |
| `.send-btn` (active) | `#34322d` | — | white | — | 50px |

### Badges

Sizes: `.badge-lg` (28px tall) · `.badge-md` (24px) · `.badge-sm` (20px) · `.badge-xs` (16px)

| Variant | Filled bg | Light bg | Ghost |
|---------|-----------|----------|-------|
| primary | `--ink` / white | `--surface` / `--ink` | `--ink` text |
| success | `--accent-success` / white | `--color-success-soft` / `--accent-success` | `--accent-success` text |
| warning | `--accent-warn` / white | `--color-warning-soft` / `--accent-warn` | `--accent-warn` text |
| info | `--accent-info` / white | `--color-info-soft` / `--accent-info` | `--accent-info` text |
| destructive | `--color-destructive-accent` / white | `--color-destructive-soft` / `--color-destructive-accent` | `--color-destructive-accent` text |
| outline | transparent | border `--border` | `--ink-2` text |

### Cards

| Class | Background | Border | Radius | Shadow |
|-------|-----------|--------|--------|--------|
| `.card` | `--white` | `1px solid --border` | `--r-lg` | `--shadow-sm` |
| `.mgc` | `#f8f8f7` | `1px solid rgba(0,0,0,0.12)` | `18px` | `0px 8px 16px rgba(0,0,0,0.06)` |

### Input (`.input`)
- Padding: `11px 14px`, border-radius `--r-lg`, border `1px solid --border`
- Focus: border `--ink`, box-shadow `0 0 0 3px --focus-ring`
- Placeholder color: `--faint`

### Modal
- Backdrop: `--modal-backdrop`, `backdrop-filter: blur(2px)`
- Card: max-width 560px (`720px` for `.modal-lg`), background `--white`, radius `--r-lg`, shadow `--shadow-lg`
- Head: padding `22px 24px 14px` · Body: `8px 24px 20px` · Foot: `14px 24px`, border-top `--border`

### Sidebar
- Width 260px / collapsed 52px · background `--nav-bg` · border-right `1px solid --border`
- Nav items: 36px tall, 10px radius, 14px/500 font

### Avatar (`.avatar`)
- 36×36px circle · background `#0067ff` · white text · font 16px/600
- `.avatar-lg`: 64×64px

### Tabs
- Container: background `--surface`, 3px padding, radius `--r-md`
- Tab: `7px 14px` padding, 13px font, 6px radius
- Active: background `--white`, shadow `--shadow-subtle`

### Composer
- Border `1px solid #e8e6e0`, radius 22px
- Focus: border `rgba(0,0,0,0.18)`, glow `0 0 0 3px rgba(0,0,0,0.04)`
- Textarea: 16px/500, placeholder `#b9b9b7`

### Tooltips
- Sidebar collapsed items: appears to the **right**
- Footer action buttons: appears **above**
- Style: bg `--ink`, color `--white`, `4px 10px` padding, 6px radius, 12px font
- Fade-in animation: 0.1s delay, 0.15s duration

---

## Do's and Don'ts

### Do
- Use semantic tokens in all new components — they switch automatically for dark mode.
- Use `--r-md` (8px) for buttons, `--r-lg` (12px) for cards/inputs, 18px for data cards.
- Use `#0067ff` for primary interactive CTAs in data-dense views (tables, modals).
- Keep hover states subtle: `rgba` at 4–9% opacity.
- Add `data-loading` to `<html>` on all authenticated pages to suppress first-paint transition flicker.

### Don't
- Don't use primitive `--color-*` tokens directly in components — only in `:root` / `:root.dark`.
- Don't hardcode `#34322d` or `#858481` in new components — use `--text-primary` / `--text-secondary`.
- Don't exceed `0.12` shadow opacity in light mode.
- Don't invent border-radius values — stick to the defined scale (4 / 8 / 12 / 18 / 22px).
