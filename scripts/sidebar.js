// Shared sidebar markup, injected into pages with <div id="sidebar-host"></div>
(function () {
  const host = document.getElementById('sidebar-host');
  if (!host) return;

  // Figma icon assets (expires 7 days from fetch)
  const IC = {
    brand: 'assets/icons/8874ab92-d105-471b-b17d-1b1bc10b9cb4.svg',
    toggle: 'assets/icons/0f7fdc6d-8914-4969-aa66-7e5c12ade250.svg',
    newChat: 'assets/icons/1d40fffc-2ed9-4139-9ff0-81d744269bc0.svg',
    category: 'assets/icons/821e14c3-be0d-452b-80e7-d802808a46c0.svg',
    leads: 'assets/icons/986fd26d-33b3-4060-bf93-895bc187711c.svg',
    sheets: 'assets/icons/f8e44bf2-b953-4629-9dc2-12d048e4e5fc.svg',
    karamchari: 'assets/icons/8680c74b-81c4-4478-ada7-b57d06d9e878.svg',
    connectors: 'assets/icons/764702f4-710d-4920-a8a3-3159d452c3f6.svg',
    whatsapp: 'assets/icons/e7fdb246-50b1-49a6-942f-ecb4efd714da.svg',
    search: 'assets/icons/be06c1cb-d4f8-4c95-9213-4024c26cdb9d.svg',
    settings: 'assets/icons/0f75a375-65ea-4195-934a-b83df91870fe.svg',
    theme: 'assets/icons/d90f2275-bb5c-435b-a89c-ba1e0566e322.svg',
    logout: 'assets/icons/1849420d-5c1d-470d-8e5e-8e0f1bc9a5b5.svg',
  };

  const img = (src, alt = '') =>
    `<img src="${src}" alt="${alt}" class="nav-img-icon">`;

  host.outerHTML = `
  <aside class="sidebar" data-screen-label="Sidebar">
    <div class="sidebar-head">
      <a href="dashboard.html" class="brand">
        <div class="brand-mark">${img(IC.brand, 'Zotok')}</div>
        <span class="brand-text">Zotok</span>
      </a>
      <button class="icon-btn" id="sidebar-toggle" aria-label="Toggle sidebar">
        ${img(IC.toggle, 'Toggle')}
      </button>
    </div>

    <nav class="nav">
      <div class="nav-group">
        <a href="dashboard.html" class="new-chat" data-nav="chat" data-tooltip="New Chat">
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
        <a href="#" class="nav-item" data-nav="search" data-tooltip="Search">
          <span class="nav-icon">${img(IC.search)}</span>
          <span class="nav-label">Search</span>
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
        <button class="footer-icon-btn" type="button" data-theme-toggle data-tooltip="Switch theme" aria-label="Switch theme">
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
        key: 'category', defaultActive: true,
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
