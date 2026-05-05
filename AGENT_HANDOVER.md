# AGENT HANDOVER — Zotok Agent v2

**Read this first.** Concise context for any agent picking up this project.
**IMPORTANT RULE FOR AI AGENTS**: Update this `AGENT_HANDOVER.md` file whenever there are major changes or updates to the project architecture, features, or layout.

---

## What this is
A static, multi-page HTML prototype for **Zotok** — a SaaS dashboard offering AI insights over WhatsApp groups. Inspired by ChatGPT-style chat UI but ORIGINAL design (do not recreate WhatsApp/ChatGPT trade dress).

## Stack constraints (hard rules)
- **HTML5 + CSS3 only.** Vanilla JS allowed ONLY for UI toggles (modal show/hide, sidebar collapse, tab switching, group selection).
- **No frameworks.** No React, no build tools, no backend. Static files served directly.
- **Fonts:** `Inter` loaded via Google Fonts, falling back to the system stack (`ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`). Google Fonts ARE permitted for this project following the Amplemarket redesign.
- **Icons:** ONLY Lucide icons, inline SVG. 1.5 stroke. No emoji, no other icon set.

## Design system (from `DESIGN.md` — Amplemarket redesign)
- Premium palette: `#111111` (midnight ink), `#f4f3ef` (whisper gray surface), `#ffffff` (canvas white).
- Accents: Deliver Green (`#47d096`), LeadGen Red (`#e16540`), Intelligence Blue (`#328efa`), Engagement Gold (`#fbc768`).
- Borders: `rgba(17, 17, 17, 0.08)`.
- 4px base spacing grid (comfortable density).
- Radii: 12px for cards, inputs, dialogs. 8px for buttons and nav items.
- Shadows: Multi-layer soft shadows (e.g., `rgba(17, 17, 17, 0.12) 0px 26px 60px -6px...`) to replace flat shadows.
- Typography: Inter (Google Fonts) with tight negative tracking on headings and 1.3 line-height on body text.

## File structure
```
/index.html              → meta-refresh redirect to login.html
/login.html              → mobile OTP login (2-step: phone → OTP)
/dashboard.html          → chat UI (default landing after login)
/agents.html             → Kamdari agent grid
/category-view.html      → 3-pane view for a deployed Categorise agent
/leads-view.html         → date-grouped leads table (New Leads Kamdari output)
/groups-to-sheets.html   → group-grouped actionable messages table (Groups to Sheets Kamdari output)
/whatsapp.html           → connection + synced groups
/profile.html            → user profile + plan
/styles/main.css         → ALL styles (includes :root.dark vars, shimmer, data-loading)
/scripts/app.js          → vanilla JS: sidebar, modals, tabs, chat, OTP, category modal logic
/scripts/sidebar.js      → injects sidebar HTML into #sidebar-host
/AGENT_HANDOVER.md       → this file
/uploads/...             → user-uploaded reference, do not ship
```

## Shared layout pattern
Every authenticated page uses the same shell:
- Fixed left sidebar (`.sidebar`), collapsible via `.sidebar.collapsed` toggled by `#sidebar-toggle`.
- Sidebar nav: Chat / Kamdari / WhatsApp Sync. Footer: avatar, theme toggle, logout.
- Main column = `.main` with internal scroll.

### Sidebar injection (sidebar.js)
All authenticated pages use `<div id="sidebar-host"></div>` — `sidebar.js` replaces it with the full `<aside>` at runtime. Load order: `sidebar.js` → `app.js` → page inline `<script>`.

To add a new page: copy `agents.html`, change `data-page` on `<body>`, swap main content.

### Page-load transition suppression (no push animation)
All authenticated pages have `<html lang="en" data-loading>`. `main.css` has:
```css
[data-loading] * { transition: none !important; }
```
`app.js` removes the attribute after the first two animation frames via double `requestAnimationFrame`, preventing the sidebar collapse from animating on load while preserving collapse/expand animations during normal use.

## Interactive bits (where state lives)
All shared logic in `scripts/app.js`:
1. **Sidebar collapse** — toggles `.sidebar.collapsed`, persists to `localStorage.zotok_sidebar`.
2. **Dark theme** — fully functional. Toggles `.dark` on `<html>`, persists to `localStorage.zotok_theme`. CSS vars in `:root.dark`.
3. **WhatsApp connect modal** — tabs for QR / Code, fake "waiting → connected" via `data-fake-connect` button.
4. **Group selection modal** — 20 mock groups, first 10 selectable, rest locked. Counter `n/10`.
5. **Chat composer** — Enter sends user bubble; faked AI reply after 850ms. Four canned replies: `summarize` / `decisions` / `urgent` / `default`.
6. **Suggested prompt pills** — `data-prompt` buttons prefill and send composer.
7. **Login OTP** — phone → OTP (pre-filled `1234` for demo) → `dashboard.html`. Sets `localStorage.zotok_auth`.
8. **Logout** — clears `localStorage.zotok_auth`, returns to `login.html`.
9. **Category modal logic** — `app.js` owns `renderCategories()`, add/delete/save handlers for the Categorise Kamdari modal. Wraps `window.openModal` to call `renderCategories()` before opening `modal-configure-agent`.

## Kamdari page (`agents.html`)
### State engine (inline `<script>` after `app.js`)
- `AGENTS` array is the single source of truth for all card definitions. Add new Kamdaris by appending here.
- State per agent stored in `localStorage` as `zotok_agent_<key>` (`'active'` or `'inactive'`).
- `defaultState` in `AGENTS` sets the initial state before user interaction.
- Lifecycle: **Not Deployed** (Deploy button) → **Deployed/Active** (gear icon + Disconnect) → **Disconnect** (back to Not Deployed).
- **Configure button** is a settings gear `icon-btn`, placed *before* Disconnect in the active footer.

### Critical: `[data-open]` delegation
`app.js` wires `[data-open]` via `querySelectorAll` at load time — it **misses dynamically rendered card buttons**. The agents.html inline script has a delegated `document.addEventListener('click')` that catches `[data-open]` on any element and calls `window.openModal(id)`. Do not remove this delegation or modals will stop opening from cards.

### Modals
- `modal-configure-agent` — Categorise message groups config (rendered by `app.js`'s `renderCategories`).
- `modal-configure-leads` — Collect new leads column config (rendered by inline script's `renderColumns`). Saves to `localStorage.zotok_leads_columns`, consumed by `leads-view.html`.

### Shimmer
Three placeholder `.agent-card.shimmer-card` elements sit in `#agent-grid` HTML; `renderCards()` overwrites them.

## Leads view (`leads-view.html`)
### Layout
Two-pane: left date-group list (280px) + right table pane (flex 1).

### Left pane — date groups
- Renders one `.lead-date-item` per unique date in `mockLeads`, showing label + count pill.
- Clicking a date sets it active and filters the right table to that date's leads.
- **Today is selected by default on load.**
- Date format: `'Today'`, `'Yesterday'`, `'02 May 2026'`, etc. (string matched against `lead.date`).

### Right pane — table
- 42 mock leads across 6 dates: Today (10), Yesterday (8), 02 May (7), 01 May (6), 30 Apr (6), 29 Apr (5).
- Columns from `localStorage.zotok_leads_columns` (set by Leads Kamdari config modal) or defaults.
- `white-space: nowrap` on all cells — columns fit content, no wrapping.
- First column is `position: sticky; left: 0` — stays fixed on horizontal scroll.
- Scroll happens on `.leads-table-scroll`; `.table-wrap` inside has `overflow: visible` to allow sticky to work.
- **Pagination**: 10 rows/page. Page numbers with ellipsis compression. Resets to page 1 on date switch or search.
- **Search**: filters across all fields on every keystroke, resets page to 1, clears on date switch.

### Shimmer
- Left pane: 5 `.shimmer-date-item` placeholders in HTML, replaced when `leadsList.innerHTML` is set.
- Table: `#table-shimmer` div with 7 shimmer rows, replaced when `renderPage()` first fires.

## Category View (`category-view.html`)
Three-pane layout inside `.main`:
- **Pane 1 (`.category-pane`)**: Category selector (Sales, Support, etc.) with dot-in-circle icons.
- **Pane 2 (`.list-pane`)**: Customer list within selected category.
- **Pane 3 (`.chat-pane`)**: Message thread, reusing `.chat-shell` and `.msg` classes.

## Things explicitly NOT to add
- No real WhatsApp branding (green checkmarks, exact logo). Use a neutral "Connect" badge.
- No filler stats / fake metrics dashboards. The product is chat-first.
- No additional colors beyond the 3-color palette + success green `#2f7d4a` and muted amber `#9a7b1c`. Used sparingly as small dots only.

## Groups to Sheets view (`groups-to-sheets.html`)
### Layout
Two-pane: left group list (280px) + right table pane (flex 1). Same shell as `leads-view.html`.

### Left pane — groups
- Renders one `.group-item` per group, showing name, member count, and message count pill.
- Clicking a group filters the right table to that group's messages.
- **First group selected by default on load.**

### Right pane — table
- 7 mock groups × 15 messages each (105 total): Mumbai Distributors, Pune Retailers, Gujarat Wholesalers, Delhi FMCG, Bangalore Tech, Rajasthan Agri, Hyderabad Pharma.
- Columns: Sender, Phone, Message, Category badge, Timestamp, "Add to Sheet" button.
- Category badges: Order (green), Inquiry (blue), Complaint (red), Payment (purple), Delivery (amber).
- **Add to Sheet**: per-row button tracks added state in a JS `Set`. Turns to "Added" (disabled style). Shows count strip below header.
- **Export to Sheet**: marks all filtered rows as added at once.
- Pagination: 10 rows/page. Search filters across sender/message/category/phone.

### Shimmer
Same pattern as `leads-view.html` — shimmer placeholders in HTML, replaced on first `renderPage()` / `listEl.innerHTML` call.

### Critical bug to avoid
**Do NOT use apostrophes inside single-quoted JS string literals** (e.g. `'What's...'` breaks parse). Use `"` delimiters or reword to avoid the contraction.

### sidebar.js wiring
`sidebar.js` Kamdari entry: `key:'sheets'`, `href:'groups-to-sheets.html'`, `nav:'groups-to-sheets'`, `defaultActive: false`. Enable via `localStorage.zotok_agent_sheets = 'active'`.

## Known TODOs / next agent tasks
- Real OTP integration.
- Wire suggested prompts to a real LLM.
- Add empty states for zero groups / zero agents.
- Dark theme: verify all components render correctly — vars in place but edge cases may be untested.
- `leads-view.html`: Export CSV button is visual only.
- `groups-to-sheets.html`: Export to Sheet button is visual only (no real Google Sheets integration).
- Kamdari "Groups to sheets" modal (`modal-configure-sheets`) not yet built — same column config UX as Collect new leads. Default columns: Group Name, Sender, Phone Number, Message, Timestamp, Category. Should save to `localStorage.zotok_sheets_columns`.
