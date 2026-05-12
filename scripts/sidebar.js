// Shared sidebar markup, injected into pages with <div id="sidebar-host"></div>
(function () {
  const host = document.getElementById('sidebar-host');
  if (!host) return;

  // Figma icon assets (expires 7 days from fetch)
  const IC = {
    brand: 'assets/icons/zotok-logo-36.svg',
    toggle: 'assets/icons/nav-toggle.svg',
    newChat: 'assets/icons/nav-new-chat.svg',
    category: 'assets/icons/nav-category.svg',
    leads: 'assets/icons/nav-leads.svg',
    sheets: 'assets/icons/nav-sheets.svg',
    karamchari: 'assets/icons/nav-karamchari.svg',
    connectors: 'assets/icons/nav-connectors.svg',
    whatsapp: 'assets/icons/nav-whatsapp.svg',
    search: 'assets/icons/nav-search.svg',
    settings: 'assets/icons/nav-settings.svg',
    logout: 'assets/icons/nav-logout.svg',
    theme: 'assets/icons/nav-theme.svg',
  };

  const img = (src, alt = '') =>
    `<img src="${src}" alt="${alt}" class="nav-img-icon">`;

  host.outerHTML = `
  <aside class="sidebar" data-screen-label="Sidebar">
    <div class="sidebar-head">
      <a href="chat.html" class="brand">
        <div class="brand-mark">${img(IC.brand, 'Group Sense')}</div>
        <div class="brand-text-wrap">
          <span class="brand-text">Zotok</span>
        </div>
      </a>
      <button class="icon-btn" id="sidebar-toggle" aria-label="Toggle sidebar">
        ${img(IC.toggle, 'Toggle')}
      </button>
    </div>

    <nav class="nav">
      <div class="nav-group">
        <a href="chat.html" class="new-chat" data-nav="chat" data-tooltip="New Chat">
          <span class="nav-icon">${img(IC.newChat)}</span>
          <span class="nav-label">New Chat</span>
        </a>
      </div>

      <div class="nav-group" id="deployed-group">
        <div class="nav-section-label" id="label-deployed-Karmacharis">Deployed Karmacharis</div>
        <div id="deployed-Karmacharis-list"></div>
      </div>

      <div class="nav-group">
        <div class="nav-section-label">Modules</div>
        <a href="agents.html" class="nav-item" data-nav="agents" data-tooltip="Karamcharis">
          <span class="nav-icon">${img(IC.karamchari)}</span>
          <span class="nav-label">Karamcharis</span>
        </a>
        <a href="connecters.html" class="nav-item" data-nav="connecters" data-tooltip="Connectors">
          <span class="nav-icon">${img(IC.connectors)}</span>
          <span class="nav-label">Connectors</span>
        </a>
        <a href="whatsapp.html" class="nav-item" data-nav="whatsapp" data-tooltip="WhatsApp Sync">
          <span class="nav-icon">${img(IC.whatsapp)}</span>
          <span class="nav-label">WhatsApp Sync</span>
        </a>
      </div>
    </nav>

    <div class="sidebar-footer">
      <a href="profile.html" class="sidebar-user" data-nav="profile" data-tooltip="Profile">
        <div class="avatar">P</div>
        <div class="sidebar-user-info">
          <span class="sidebar-user-name">Prathik Rati</span>
          <span class="sidebar-user-phone">+91 93883 22332</span>
        </div>
      </a>
      <div class="sidebar-footer-actions">
        <button class="footer-icon-btn" type="button" id="dark-toggle" data-tooltip="Toggle dark mode" aria-label="Toggle dark mode">
          ${img(IC.theme)}
        </button>
        <button class="footer-icon-btn" type="button" data-logout data-tooltip="Log out" aria-label="Log out">
          ${img(IC.logout)}
        </button>
      </div>
    </div>
  </aside>
  `;

  window.syncSidebar = function () {
    const list = document.getElementById('deployed-Karmacharis-list');
    const deployedGroup = document.getElementById('deployed-group');
    if (!list) return;

    const kamdaris = [
      {
        key: 'category', defaultActive: false,
        href: 'category-view.html', nav: 'category-view',
        tooltip: 'Category Messages', label: 'Category Messages',
        icon: img(IC.category),
      },
      {
        key: 'leads', defaultActive: false,
        href: 'leads-view.html', nav: 'leads-view',
        tooltip: 'New Leads', label: 'New Leads',
        icon: img(IC.leads),
      },
      {
        key: 'sheets', defaultActive: false,
        href: 'groups-to-sheets.html', nav: 'groups-to-sheets',
        tooltip: 'Groups to Sheets', label: 'Groups to Sheets',
        icon: img(IC.sheets),
      },
    ];

    let html = '';
    let count = 0;
    kamdaris.forEach(k => {
      const stored = localStorage.getItem(`zotok_agent_${k.key}`);
      const isActive = stored !== null ? stored === 'active' : k.defaultActive;
      if (isActive) {
        html += `
          <a href="${k.href}" class="nav-item" data-nav="${k.nav}" data-tooltip="${k.tooltip}">
            <span class="nav-icon">${k.icon}</span>
            <span class="nav-label">${k.label}</span>
          </a>`;
        count++;
      }
    });

    list.innerHTML = html;
    // Show/hide whole group via hidden attribute (not inline style) so CSS can override cleanly
    if (deployedGroup) deployedGroup.hidden = count === 0;

    const page = document.body.dataset.page;
    if (page) {
      document.querySelectorAll('[data-nav]').forEach(el => {
        el.classList.toggle('active', el.dataset.nav === page);
      });
    }
  };

  window.syncSidebar();
})();
