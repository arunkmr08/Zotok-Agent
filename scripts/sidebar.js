// Shared sidebar markup, injected into pages with <div id="sidebar-host"></div>
(function () {
  const host = document.getElementById('sidebar-host');
  if (!host) return;
  host.outerHTML = `
  <aside class="sidebar" data-screen-label="Sidebar">
    <div class="sidebar-head">
      <a href="dashboard.html" class="brand">
        <div class="brand-mark">Z</div>
        <span class="brand-text">Zotok</span>
      </a>
      <button class="icon-btn" id="sidebar-toggle" aria-label="Toggle sidebar">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/></svg>
      </button>
    </div>


    <nav class="nav">
      <div class="nav-section-label">Workspace</div>
      <a href="dashboard.html" class="nav-item" data-nav="chat" data-tooltip="Chat">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z"/></svg>
        <span class="nav-label">Chat</span>
      </a>
      <a href="agents.html" class="nav-item" data-nav="agents" data-tooltip="Karamchari">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><path d="M8 16h.01"/><path d="M16 16h.01"/></svg>
        <span class="nav-label">Karamchari</span>
      </a>
      <a href="connecters.html" class="nav-item" data-nav="connecters" data-tooltip="Connecters">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M9 2v6"/><path d="M15 2v6"/><path d="M12 17v5"/><path d="M5 8h14"/><path d="M6 11V8h12v3a6 6 0 1 1-12 0Z"/></svg>
        <span class="nav-label">Connecters</span>
      </a>
      <a href="whatsapp.html" class="nav-item" data-nav="whatsapp" data-tooltip="WhatsApp Sync">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-3.6-7.2"/><path d="M21 3v6h-6"/></svg>
        <span class="nav-label">WhatsApp Sync</span>
      </a>
      <div class="nav-section-label" id="label-deployed-Karamchari">Deployed Karamchari</div>
      <div id="deployed-Karamcharis-list">
        <!-- Rendered via JS -->
      </div>


      <div class="nav-section-label">Recent</div>
      <a href="dashboard.html?chat=mumbai" class="nav-recent"><svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg><span class="truncate">Sales – Mumbai weekly</span></a>
      <a href="dashboard.html?chat=margin" class="nav-recent"><svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg><span class="truncate">Distributor margin call</span></a>
      <a href="dashboard.html?chat=pune" class="nav-recent"><svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg><span class="truncate">Pune delivery delays</span></a>
    </nav>

    <div class="sidebar-footer">
      <a href="profile.html" class="footer-item" data-nav="profile" data-tooltip="Profile">
        <div class="avatar">RP</div>
        <span class="footer-label">Ravi Patel</span>
      </a>
      <button class="footer-item" type="button" data-theme-toggle data-tooltip="Switch theme">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
        <span class="footer-label">Switch theme</span>
      </button>
      <button class="footer-item" type="button" data-action="logout" data-tooltip="Log out">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        <span class="footer-label">Log out</span>
      </button>
    </div>
  </aside>
  `;

  window.syncSidebar = function () {
    const list = document.getElementById('deployed-Karamcharis-list');
    const label = document.getElementById('label-deployed-Karamchari');
    if (!list) return;

    const Karamcharis = [
      {
        key: 'category', defaultActive: true,
        href: 'category-view.html', nav: 'category-view',
        tooltip: 'Categorise message groups', label: 'Categorise messages',
        icon: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M7 12h10"/><path d="M10 18h4"/></svg>`
      },
      {
        key: 'leads', defaultActive: false,
        href: 'leads-view.html', nav: 'leads-view',
        tooltip: 'Collect new leads', label: 'New leads',
        icon: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 11h-6"/><path d="M19 8v6"/></svg>`
      },
      {
        key: 'sheets', defaultActive: false,
        href: 'groups-to-sheets.html', nav: 'groups-to-sheets',
        tooltip: 'Groups to sheets', label: 'Groups to sheets',
        icon: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 3v18"/></svg>`
      }
    ];

    let html = '';
    let count = 0;
    Karamcharis.forEach(k => {
      const stored = localStorage.getItem(`zotok_agent_${k.key}`);
      const isActive = stored !== null ? stored === 'active' : k.defaultActive;
      if (isActive) {
        html += `
          <a href="${k.href}" class="nav-item" data-nav="${k.nav}" data-tooltip="${k.tooltip}">
            ${k.icon}
            <span class="nav-label">${k.label}</span>
          </a>`;
        count++;
      }
    });

    list.innerHTML = html;
    if (label) label.style.display = count > 0 ? 'block' : 'none';

    const page = document.body.dataset.page;
    if (page) {
      document.querySelectorAll('[data-nav]').forEach(el => {
        el.classList.toggle('active', el.dataset.nav === page);
      });
    }
  };

  window.syncSidebar();
})();

