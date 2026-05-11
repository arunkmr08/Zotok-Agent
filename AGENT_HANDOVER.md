# AGENT HANDOVER — Zotok Agent v2

**Read this first.** Concise context for any agent picking up this project.
**IMPORTANT RULE FOR AI AGENTS**: Update this `AGENT_HANDOVER.md` file whenever there are major changes or updates to the project architecture, features, or layout.

---

## What this is
A static, multi-page HTML prototype for **Group Sense** (formerly Zotok) — a SaaS dashboard offering AI insights over WhatsApp groups. Inspired by ChatGPT-style chat UI but ORIGINAL design (do not recreate WhatsApp/ChatGPT trade dress).

## Stack constraints (hard rules)
- **HTML5 + CSS3 only.** Vanilla JS allowed ONLY for UI toggles (modal show/hide, sidebar collapse, tab switching, group selection, drag-to-reorder).
- **No frameworks.** No React, no build tools, no backend. Static files served directly.
- **Fonts:** `Inter` loaded via Google Fonts, falling back to the system stack.
- **Icons:** All icons are local SVGs in `assets/icons/` (downloaded from Figma). Do NOT use external Figma MCP asset URLs — they expire. If new icons are needed, download them and place in `assets/icons/`.

## Design system
- Premium palette: `#111111` (midnight ink), `#f4f3ef` (whisper gray surface), `#ffffff` (canvas white).
- Accents: Deliver Green (`#47d096`), LeadGen Red (`#e16540`), Intelligence Blue (`#328efa`), Engagement Gold (`#fbc768`).
- Borders: `rgba(17, 17, 17, 0.08)`.
- 4px base spacing grid. Radii: 12px cards, 8px buttons/nav.
- Typography: Inter (Google Fonts), tight negative tracking on headings.

## File structure
```
/index.html              → meta-refresh redirect to login.html
/login.html              → mobile OTP login (2-step: phone → OTP)
/chat.html               → chat UI (default landing after login)
/agents.html             → Karamchari agent grid + all agent modals
/category-view.html      → 3-pane view for a deployed Categorise agent
/leads-view.html         → date-grouped leads table (Collect New Leads output)
/groups-to-sheets.html   → sheet viewer with left panel + right table card
/connecters.html         → connector cards grid (external tool integrations)
/whatsapp.html           → connection + synced groups
/profile.html            → user profile + plan
/styles/main.css         → ALL light-mode styles (includes :root vars, shimmer)
/styles/dark.css         → ALL dark-mode overrides (html.dark class)
/scripts/app.js          → vanilla JS: sidebar, modals, tabs, chat, OTP, connect flow
/scripts/sidebar.js      → injects sidebar HTML into #sidebar-host
/assets/icons/           → all icon SVGs (descriptive names, downloaded from Figma)
/dark-test.html          → 9-page iframe test harness for dark mode QA
/AGENT_HANDOVER.md       → this file
/uploads/...             → user-uploaded reference, do not ship
```

## Shared layout pattern
Every authenticated page uses the same shell:
- Fixed left sidebar (`.sidebar`), collapsible via `.sidebar.collapsed` toggled by `#sidebar-toggle`.
- Sidebar nav: Chat / Karamchari / WhatsApp Sync. Footer: avatar, theme toggle, logout.
- Main column = `.main` with internal scroll.

### Sidebar injection (sidebar.js)
All authenticated pages use `<div id="sidebar-host"></div>` — `sidebar.js` replaces it with the full `<aside>` at runtime. Load order: `sidebar.js` → `app.js` → page inline `<script>`.

### Brand / logo
- Logo file: `assets/icons/zotok-logo.svg` (Zotok robot character — blue/orange).
- Used in: `.brand-mark` in sidebar, `login.html` brand header, `.msg-avatar` in chat messages.
- `.brand-mark` CSS: `background: transparent`, icon 32×32px via `.brand-mark .nav-img-icon`.
- Chat avatar: `<img class="msg-avatar-img">` inside `.msg-avatar`, sized 22×22px via `.msg-avatar-img`.
- Brand name displayed: **Group Sense** (no `brand-sub` element).

### Page-load transition suppression
All authenticated pages have `<html lang="en" data-loading>`. `app.js` removes the attribute after the first two `requestAnimationFrame` calls, preventing sidebar animation on load while preserving it during normal use.

## Interactive bits (state lives in `app.js`)
1. **Sidebar collapse** — toggles `.sidebar.collapsed`, persists to `localStorage.zotok_sidebar`.
2. **Dark theme** — toggles `.dark` on `<html>`, persists to `localStorage.zotok_dark`.
3. **WhatsApp connect flow** — 3-modal sequence: Connect → History → Groups (see below).
4. **Chat composer** — Enter sends; faked AI reply after 850ms.
5. **Login OTP** — phone → OTP (`1234`) → `chat.html`. Sets `localStorage.zotok_auth`.
6. **Logout** — clears `localStorage.zotok_auth`.

---

## Dark theme (`styles/dark.css`)

Dark mode is toggled by adding `.dark` to `<html>`. All overrides are in `styles/dark.css`, loaded after `styles/main.css` on every authenticated page.

### Architecture rules
- **Never put dark overrides in inline `<style>` blocks.** An inline `<style>` declared after `<link href="dark.css">` wins at equal specificity even though it appears later — this was the root cause of several white-flash bugs. All page-specific CSS must live in `main.css`; dark overrides go in `dark.css`.
- All pages have had their inline `<style>` blocks extracted to `main.css`: `category-view.html`, `leads-view.html`, `agents.html`, `groups-to-sheets.html`.

### Icon theming
Two patterns depending on how icons are loaded:
- **`<img>` tag SVGs** — parent document CSS vars are inaccessible. Use `filter: brightness(0) invert(1); opacity: 0.78` per element class in dark.css.
- **Inline SVGs with `stroke="currentColor"`** — respond to CSS `color` property from parent.
- **Inline SVGs with hardcoded colors** — override `stroke` directly via `.dark svg path { stroke: ... }`.
- Brand logo (`.brand-mark .nav-img-icon`) and group avatar icons (`.gts-item-icon`, `.leads-sheet-info img`) must NOT be inverted — use `filter: none`.

### Key dark color tokens
| Token | Value | Use |
|---|---|---|
| Page bg | `#1a1a1a` | `.main`, layout wrappers |
| Card bg | `#242424` | Cards, panels |
| Elevated bg | `#2a2a2a` | Inputs, buttons, date pickers |
| Primary text | `#dadada` | Body text |
| Secondary text | `#7f7f7f` | Labels, meta |
| Border | `rgba(255,255,255,0.08–0.12)` | Dividers, card edges |
| Focus border | `#0067ff` | Active input rows |

---

## WhatsApp connect flow (3-modal sequence)

Pages: `whatsapp.html` and `chat.html` both include the full flow.

### Modals
| ID | Purpose |
|---|---|
| `modal-connect` | QR/Code scan. "Simulate Connection" triggers flow. |
| `modal-history` | Fetch Chat History — radio-list date range picker. |
| `modal-groups` | Choose Groups to Sync — group checklist + sync progress. |

### Transitions (`transitionTo`)
`transitionTo(fromId, toId, direction, onBefore)` in `app.js`:
- Slides out `fromCard` (`.modal` or `.mgc`) and slides in `toCard` with CSS transform + opacity.
- `direction`: `'forward'` (left) or `'back'` (right).
- `.modal-no-bg` temporarily added to incoming backdrop to avoid double-dim during transition.
- Both cards found via `.querySelector('.modal, .mgc')` — supports both `.modal` (whatsapp.html) and `.mgc` (chat.html) card wrappers.

### Flow state
- `inConnectFlow` boolean — set `true` when fake-connect fires, `false` on completion/dismiss.
- Back button `#groups-back-btn` shown only when `inConnectFlow === true`.
- `initHistoryModal()` resets history modal to "Last 7 Days" on each entry (back navigation safe — uses `onclick` assignment to avoid listener accumulation).

### Sync progress view
- Triggered by `[data-mark-connected]` click inside the groups modal.
- Adds `.syncing` class to `.modal` or `.mgc` card.
- CSS hides `.modal-head/.modal-body/.modal-foot` (or `.mgc-*`) and shows `.sync-progress-view`.
- `closeModal()` always strips `.syncing` on close.
- Sets `localStorage.zotok_connected = '1'`.

### History modal options
Radio-list: Last 7 Days (default) / Last 30 Days / Last 3 Months / Custom Range.
Selected row has `.selected` class; radio toggles `.radio-off` / `.radio-on` SVGs via CSS.
"Continue" button → `goToGroups()` → `transitionTo` to groups modal.
"Maybe Later" / close → dismisses and sets `zotok_connect_dismissed`.

---

## Karamchari page (`agents.html`)

### State engine
- `AGENTS` array is the single source of truth for all card definitions.
- State per agent: `localStorage.zotok_agent_<key>` = `'active'` | `'inactive'`.
- `defaultState` sets initial state before user interaction.
- Lifecycle: **Not Deployed** → **Active** (configure + remove) → **Removed** (back to Not Deployed).

### Card buttons
- **Active state**: "Configure" (gear) + "Remove Karamchari" (red outline).
- "Remove Karamchari" triggers a confirmation dialog (`modal-remove-confirm`) before deactivating. `pendingRemoveKey` stores the agent key until confirmed.
- **Not deployed**: "Know More" + "Deploy" (blue).
- `[data-open]` delegation: `app.js` wires static elements only — agents.html has a delegated `document.addEventListener('click')` to catch dynamically rendered card buttons. Do not remove.

### Modals overview
| Modal ID | Agent | Views |
|---|---|---|
| `modal-configure-agent` | Categorise Messages | list → create → **success** |
| `modal-configure-leads` | Collect New Leads | connect → loading → picker → columns → groups → **success** |
| `modal-configure-sheets` | Groups to Sheets | single view → **success** |
| `modal-remove-confirm` | (all) | confirmation dialog |

### Categorise Messages modal (`modal-configure-agent`)
- Views: `cat-view-list`, `cat-view-create`, `cat-view-success`.
- `showCatView(view)` handles switching. `list` ↔ `create` animate (fade + slide). `success` is instant.
- Deploy button (`cat-deploy-btn`) → saves categories to `localStorage.zotok_categories`, sets state active, shows `cat-view-success`.
- Reopening the modal resets to `list` view.
- `cat-view-success` uses the same `leads-success-body` styles as the leads success view.
- Edit/delete icon hover states: edit → `rgba(255,255,255,0.08)` bg + `#dadada` text; delete → `rgba(221,54,12,0.14)` bg + `#ff6b6b` text (dark mode).

### Collect New Leads modal (`modal-configure-leads`)
Multi-view modal. Container: `#leads-modal-box` (`.leads-modal`).

**Views** (controlled by `leadsShowView(view)`):
1. `connect` — WhatsApp account connect prompt.
2. `loading` — animated spinner, auto-advances to `picker` after 2500ms.
3. `picker` — sheet selection (blank or existing). Modal expands to 1024px (`.leads-modal--wide`).
4. `columns` — Configure Sheet Columns. JS-driven, data in `leadsColumns[]` array.
5. `groups` — Select Groups. JS-driven, data in `LEADS_GROUPS_DATA[]`, selection in `leadsGroupsSelected` Set.
6. `success` — deployed confirmation with 3D icon.

**Transitions:** columns ↔ groups uses slide animation (`leads-slide-out-left/right`, `leads-slide-in-left/right`). `leadsCurrentView` tracks current view for direction detection.

**Columns view interactivity:**
- `leadsColumns[]` is the source of truth.
- `renderLeadsColumns()` rebuilds DOM and re-attaches all listeners on every change.
- HTML5 drag-to-reorder (`draggable`, dragstart/dragover/drop events).
- "Add Column" button uses icon `assets/icons/icon-add-campaign.svg`.
- Row hover: `#f8f8f7` background. Row with focused input: `#0067ff` border (`:has(.leads-col-name-input:focus)`).
- Dark mode: focused row uses `background: #2a2a2a; border-color: #0067ff` — NOT white (white flash was a bug, fixed).

**Groups view interactivity:**
- `renderLeadsGroups(filter)` filters by search input and rebuilds DOM.
- Click to toggle selection. Selected rows show blue checkbox, no background.

**Reset:** On modal close (`data-close="modal-configure-leads"`), `leadsShowView('connect')` fires after 300ms delay.

### Groups to Sheets modal (`modal-configure-sheets`)
- Old-style modal (modal-head / modal-body / modal-foot) — not multi-view like leads.
- `sheetsShowSuccess(true/false)` hides/shows modal-head+body+foot and toggles `#sheets-view-success`.
- Deploy button (`btn-save-sheets`) → validates columns (min 5, unique names), saves to `localStorage.zotok_sheets_columns`, shows success.
- Reopening the modal resets `sheetsShowSuccess(false)`.

### Remove confirmation (`modal-remove-confirm`)
- Small centered dialog (`.remove-confirm-box`, 360px).
- Triggered by any "Remove Karamchari" button. Stores target key in `pendingRemoveKey`.
- Confirm: deactivates agent, updates card UI, syncs sidebar, closes modal.
- Cancel: clears `pendingRemoveKey`, closes modal.

### Success view (shared style)
All three modals use `.leads-success-body` for their success state:
- 3D employee icon: `https://cdn3d.iconscout.com/3d/premium/thumb/employee-3d-icon-png-download-10199754.png`
- Title `.leads-success-title`, subtitle `.leads-success-sub`, primary button closes the modal.

### Sidebar sync
Deployed Karamcharis appear in the sidebar under "Deployed Karamacharis". `window.syncSidebar()` (defined in `sidebar.js`) reads `localStorage.zotok_agent_*` and rebuilds the list. Called on every deploy/remove.

### Init order (bottom of agents.html `<script>`)
```javascript
renderSheetsColumns();
renderCards();
renderCatModal();
```

---

## Leads view (`leads-view.html`)
Redesigned (Figma 46:1499). Single-pane layout — no left date list.

**Structure:**
- Top bar: `#f8f8f7` bg, cyan icon (`rgba(0,221,255,0.18)`), "New Leads" title.
- White card (`border-radius:18px`): header row + table + pagination.
- Card header: date label + chevron (dropdown to switch date group) + count subtitle; Search / Filters / Export on right.
- Table: `<table>` inside `.nlv-table-wrap` (scrollable). Columns: Checkbox | Customer Name (228px, colored avatar) | Mobile Number (174px) | Location (201px) | Summary (flex) | Action.
- Action cell: "View" button + "Add to Campaign" button. Both use `assets/icons/icon-add-campaign.svg` icon (same as `leads-col-add-btn` in agents.html).
- Avatar: 28px colored circle + white Zotok icon (`zotok-avatar-inner.svg`), color cycled from `AVATAR_COLORS[]`.
- Pagination: 50 rows/page, prev/next + page number buttons. Resets on search.
- Search: filters name, phone, location, summary on keystroke.
- 48 mock leads across 7 dates. Default group: Today (10 leads).
- CSS prefix: `nlv-`. All styles in `main.css` (extracted from inline block).

**Selection bar:**
- Appears when ≥1 row checked (`.nlv-selection-bar.show`).
- "Add to Campaign" bulk button uses same `icon-add-campaign.svg` icon with `filter:brightness(0) invert(1)` (white on blue bg).

**Add to Campaign modal (`.atc-overlay`):**
- View 1: Connect to Zotok (shown if `localStorage.zotok_atc_connected !== 'true'`).
- View 2: Campaign list with search + radio selection → "Assign To Campaign".
- `localStorage.zotok_atc_connected = 'true'` persists connection across opens.

## Category View (`category-view.html`)
Three-pane: category selector → customer list → message thread. CSS prefix: `cat-`. All styles in `main.css`.

## Groups to Sheets view (`groups-to-sheets.html`)
Two-pane: left sheet list panel (280px) + right `.gts-content` area containing `.gts-card`.

**Structure:**
- Left panel (`.gts-panel`): sheet list (`.gts-item` rows) + "Add Sheet" button.
- Right card (`.gts-card` inside `.gts-content`): header (`.gts-card-head`) with title/subtitle + Export button + scrollable `.gts-table`.
- Table: flex-based rows (`.gts-row`). Header row (`.gts-row--head`) is `position: sticky`. Data rows below.

**Data:**
- 5 demo sheets in `DEMO_SHEETS[]` (7 groups × 10 messages each, plus custom attendance sheet).
- `renderList()` builds the left panel. `renderCard()` builds the right card.
- `colClass()` / `colValue()` map column names to CSS classes and cell content.
- Category badges: `.gts-badge--order/inquiry/complaint/payment/delivery`.

**CSS prefix:** `gts-`. All styles in `main.css`. Dark overrides in `dark.css` include `.gts-card { background: #242424 }` — critical, without it the card renders white inside the dark layout.

## Connecters page (`connecters.html`)

Displays a 3-column grid of external integration cards. No separate JS file — all logic is inline `<script>` at the bottom of the file. All styles are inline `<style>` in the file (CSS prefix: `connector-`/`connectors-`).

### Layout
- `.connectors-wrap` — full-width flex column, `background: #f8f8f7`.
- `.connectors-hero` — centered header block: `padding: 80px 160px 40px`, `gap: 4px`. Title 24px/600, subtitle 16px/500, both `#34322d`.
- `.connectors-grid` — CSS grid, `repeat(3, minmax(0,1fr))`, `gap: 16px`, `padding: 0 200px 40px`.

### Cards
Each `.connector-card`: white bg, `border: 1px solid rgba(0,0,0,0.12)`, `box-shadow: 0 8px 16px rgba(0,0,0,0.06)`, `border-radius: 18px`, `padding: 21px`, `gap: 20px`.

Icon box (`.connector-icon`): 60×60px, `border-radius: 12px`, `border: 1px solid #e8e6e0`, `background: #f8f8f7`. Variants:
- `.icon-green` — `background: #589981` (Zotok card)
- `.icon-blue` — `background: #0089ff` (ERPNext card)

Card order (left→right, top→bottom): Google Sheets · Zotok · Tally · SAP B1 · ERPNext · Zoho CRM.

### Dynamic cards
Two cards have connect/disconnect state managed via `renderConnectorCard({ footId, storageKey })`:
| Card | `footId` | `storageKey` |
|---|---|---|
| Google Sheets | `gsheets-foot` | `zotok_gsheets_connected` |
| Zotok | `zotok-foot` | `zotok_atc_connected` |

- Connected state → "Know More" + `.btn-disconnect` (red border, `#dd360c`).
- Disconnected state → "Know More" + `.btn-connect` (blue `#0067ff`).
- All other cards have static "Know More" + "Connect" buttons.

### Button icons
`.btn-connect` uses `assets/icons/connector-btn-connect.svg` (download arrow, white).
`.btn-disconnect` uses `assets/icons/connector-btn-disconnect.svg` (X-circle, red).

### Assets
All connector logos are local PNGs in `assets/icons/`:
- `connector-google-sheets.png` — Google Sheets logo (120×165)
- `connector-zotok.png` — Zotok logo (606×456)
- `connector-tally.png` — Tally logo (2484×1142)
- `connector-sap-b1.png` — SAP B1 logo (614×304)
- `connector-erpnext.png` — ERPNext logo (120×120)
- `connector-zoho-crm.png` — Zoho CRM logo (948×416)
- `connector-btn-connect.svg` — Connect button icon (SVG)
- `connector-btn-disconnect.svg` — Disconnect button icon (SVG)

---

## Assets

All icons live in `assets/icons/` with descriptive names. All 85 UUID-named files have been renamed (20 exact duplicates deleted).

### Naming conventions
| Prefix | Example | Purpose |
|---|---|---|
| `nav-` | `nav-toggle.svg`, `nav-leads.svg` | Sidebar navigation icons |
| `icon-` | `icon-view.svg`, `icon-close.svg` | General UI action icons |
| `icon-prompt-` | `icon-prompt-urgent.svg` | Chat prompt-pill icons |
| `group-avatar-` | `group-avatar-teal.svg` | 36×36 group avatar circles (7 colors: maroon/green/indigo/teal/olive/red/violet) |
| `user-avatar-` | `user-avatar-green.svg` | 28×28 user avatar circles (same 7 colors) |
| `zotok-logo-` | `zotok-logo-36.svg`, `zotok-logo-20.svg` | Zotok wordmark/logo at different sizes |
| `connector-` | `connector-google-sheets.png` | Connector integration logos |

### Special files
- `zotok-logo.svg` — Zotok robot character (blue/orange). Brand logo in sidebar and login.
- `zotok-avatar-inner.svg` — Small white Zotok icon overlaid on user avatar circles.
- `connector-btn-connect.svg` / `connector-btn-disconnect.svg` — Button icons for connecters page.
- `icon-google-sheets-sm.png` / `icon-google-sheets-md.png` — Google Sheets icons at different sizes.

When referencing new Figma assets: download first, save to `assets/icons/`, reference locally.

---

## Known TODOs
- Real OTP integration.
- Wire chat prompts to a real LLM.
- `connecters.html`: dark mode overrides not yet added (inline `<style>` in the file; needs extraction to `main.css` + dark overrides in `dark.css`).
- `leads-view.html`: Export CSV button is visual only.
- `groups-to-sheets.html`: Export to Sheet is visual only.
- Add empty states for zero groups / zero agents deployed.

## Critical bugs to avoid
- **Apostrophes in single-quoted JS strings** — e.g. `'What's...'` breaks parse. Use `"` or reword.
- **Do not re-add `renderColumns()` to the init block** — that function was removed when the leads modal was replaced. Init only calls `renderSheetsColumns()`, `renderCards()`, `renderCatModal()`.
- **Do not use external Figma MCP URLs** — they expire in 7 days. Always download to `assets/icons/` first.
- **`initHistoryModal` listener accumulation** — always use `onclick =` assignment (not `addEventListener`) for option rows and fetch button inside `initHistoryModal`, since it's called on every back-navigation re-entry.
- **Inline `<style>` after `<link href="dark.css">` breaks dark mode** — inline styles win at equal specificity. Never add CSS directly in `<style>` tags in page `<head>`. All page CSS goes in `main.css`, dark overrides in `dark.css`.
- **`<img>` SVG icons ignore CSS variables** — parent document CSS custom properties don't reach into `<img>`-loaded SVGs. Use `filter: brightness(0) invert(1)` in dark.css instead.
