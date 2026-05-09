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
/dashboard.html          → chat UI (default landing after login)
/agents.html             → Karamchari agent grid + all agent modals
/category-view.html      → 3-pane view for a deployed Categorise agent
/leads-view.html         → date-grouped leads table (Collect New Leads output)
/groups-to-sheets.html   → group-grouped messages table (Groups to Sheets output)
/whatsapp.html           → connection + synced groups
/profile.html            → user profile + plan
/styles/main.css         → ALL styles (includes :root.dark vars, shimmer)
/scripts/app.js          → vanilla JS: sidebar, modals, tabs, chat, OTP, connect flow
/scripts/sidebar.js      → injects sidebar HTML into #sidebar-host
/assets/icons/           → all icon SVGs (UUID-named + zotok-logo.svg, downloaded from Figma)
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
2. **Dark theme** — toggles `.dark` on `<html>`, persists to `localStorage.zotok_theme`.
3. **WhatsApp connect flow** — 3-modal sequence: Connect → History → Groups (see below).
4. **Chat composer** — Enter sends; faked AI reply after 850ms.
5. **Login OTP** — phone → OTP (`1234`) → `dashboard.html`. Sets `localStorage.zotok_auth`.
6. **Logout** — clears `localStorage.zotok_auth`.

---

## WhatsApp connect flow (3-modal sequence)

Pages: `whatsapp.html` and `dashboard.html` both include the full flow.

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
- Both cards found via `.querySelector('.modal, .mgc')` — supports both `.modal` (whatsapp.html) and `.mgc` (dashboard.html) card wrappers.

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
- "Add Column" button uses icon `assets/icons/e18942db-8713-4e07-a3c9-53976c803bd5.svg`.
- Row hover: `#f8f8f7` background. Row with focused input: `#0067ff` border, white background (`:has(.leads-col-name-input:focus)`).

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
- Action cell: "View" button + "Add to Campaign" button. Both use `assets/icons/e18942db-8713-4e07-a3c9-53976c803bd5.svg` icon (same as `leads-col-add-btn` in agents.html).
- Avatar: 28px colored circle + white Zotok icon (`536e13b8-...svg`), color cycled from `AVATAR_COLORS[]`.
- Pagination: 50 rows/page, prev/next + page number buttons. Resets on search.
- Search: filters name, phone, location, summary on keystroke.
- 48 mock leads across 7 dates. Default group: Today (10 leads).
- CSS prefix: `nlv-`. All styles are inline `<style>` in the file.

**Selection bar:**
- Appears when ≥1 row checked (`.nlv-selection-bar.show`).
- "Add to Campaign" bulk button uses same `e18942db-...svg` icon with `filter:brightness(0) invert(1)` (white on blue bg).

**Add to Campaign modal (`.atc-overlay`):**
- View 1: Connect to Zotok (shown if `localStorage.zotok_atc_connected !== 'true'`).
- View 2: Campaign list with search + radio selection → "Assign To Campaign".
- `localStorage.zotok_atc_connected = 'true'` persists connection across opens.

## Category View (`category-view.html`)
Three-pane: category selector → customer list → message thread.

## Groups to Sheets view (`groups-to-sheets.html`)
Two-pane: left group list (280px) + right table pane.
- 7 mock groups × 15 messages. Per-row "Add to Sheet" toggle. Export marks all filtered rows.
- Pagination + search same pattern as leads-view.

---

## Assets
All icons live in `assets/icons/` as UUID-named SVGs (e.g. `0f7fdc6d-...svg`).
Special files:
- `zotok-logo.svg` — Zotok robot character (blue/orange). Used as brand logo everywhere.
- Two PNGs: `67bdde72-...png`, `c6408a11-...png`.
When referencing new Figma assets: download first, save to `assets/icons/`, reference locally.

---

## Known TODOs
- Real OTP integration.
- Wire chat prompts to a real LLM.
- Dark theme: verify all components — vars in place but edge cases may be untested.
- `leads-view.html`: Export CSV button is visual only.
- `groups-to-sheets.html`: Export to Sheet is visual only.
- Add empty states for zero groups / zero agents deployed.

## Critical bugs to avoid
- **Apostrophes in single-quoted JS strings** — e.g. `'What's...'` breaks parse. Use `"` or reword.
- **Do not re-add `renderColumns()` to the init block** — that function was removed when the leads modal was replaced. Init only calls `renderSheetsColumns()`, `renderCards()`, `renderCatModal()`.
- **Do not use external Figma MCP URLs** — they expire in 7 days. Always download to `assets/icons/` first.
- **`initHistoryModal` listener accumulation** — always use `onclick =` assignment (not `addEventListener`) for option rows and fetch button inside `initHistoryModal`, since it's called on every back-navigation re-entry.
