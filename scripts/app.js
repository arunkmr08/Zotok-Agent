// Zotok — vanilla JS for UI toggles only.

// ---------- Dark theme ----------
(function () {
  const DARK_KEY = 'zotok_dark';
  if (localStorage.getItem(DARK_KEY) === 'true') {
    document.documentElement.classList.add('dark');
  }
  window.toggleDarkTheme = function () {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem(DARK_KEY, isDark ? 'true' : 'false');
  };
})();

// Remove transition suppression after first paint (set via data-loading on <html>)
requestAnimationFrame(() => requestAnimationFrame(() => {
  document.documentElement.removeAttribute('data-loading');
}));

(function () {
  // ---------- Sidebar collapse + active link ----------
  const sidebar = document.querySelector('.sidebar');
  const toggleBtn = document.getElementById('sidebar-toggle');
  const KEY = 'zotok_sidebar';

  if (sidebar && localStorage.getItem(KEY) === 'collapsed') {
    sidebar.classList.add('collapsed');
  }
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      localStorage.setItem(KEY, sidebar.classList.contains('collapsed') ? 'collapsed' : 'open');
    });
  }

  const page = document.body.dataset.page;
  document.querySelectorAll('[data-nav]').forEach(el => {
    if (el.dataset.nav === page) {
      el.classList.add('active');
      // If inside a submenu, open parent
      const parentList = el.closest('.nav-children');
      if (parentList) {
        parentList.style.display = 'flex';
        const toggle = document.querySelector(`[data-toggle="${parentList.id}"]`);
        if (toggle) toggle.classList.add('open');
      }
    }
  });

  document.querySelectorAll('[data-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.toggle);
      if (target) {
        const isHidden = target.style.display === 'none';
        target.style.display = isHidden ? 'flex' : 'none';
        btn.classList.toggle('open', isHidden);
      }
    });
  });

  // ---------- Dark mode toggle ----------
  const darkBtn = document.getElementById('dark-toggle');
  if (darkBtn) darkBtn.addEventListener('click', () => window.toggleDarkTheme());

  // ---------- Logout ----------
  document.querySelectorAll('[data-logout]').forEach(b =>
    b.addEventListener('click', () => {
      const keep = new Set(['zotok_sidebar']);
      Object.keys(localStorage)
        .filter(k => k.startsWith('zotok_') && !keep.has(k))
        .forEach(k => localStorage.removeItem(k));
      window.location.href = 'login.html';
    })
  );

  // ---------- Generic modal ----------
  function openModal(id) {
    const m = document.getElementById(id);
    if (m) m.classList.add('open');
  }
  function closeModal(id) {
    const m = document.getElementById(id);
    if (m) {
      m.classList.remove('open');
      const card = m.querySelector('.modal, .mgc');
      if (card) card.classList.remove('syncing');
      if (id === 'modal-connect' || id === 'modal-groups') {
        localStorage.setItem('zotok_connect_dismissed', '1');
      }
    }
  }
  window.openModal = openModal;
  window.closeModal = closeModal;

  // ---------- Slide transition between flow modals ----------
  let inConnectFlow = false;

  function transitionTo(fromId, toId, direction, onBefore) {
    const fromEl = document.getElementById(fromId);
    const toEl   = document.getElementById(toId);
    if (!fromEl || !toEl) return;
    const fromCard = fromEl.querySelector('.modal, .mgc');
    const toCard   = toEl.querySelector('.modal, .mgc');
    const outX = direction === 'back' ? '32px' : '-32px';
    const inX  = direction === 'back' ? '-32px' : '32px';
    if (fromCard) {
      fromCard.style.transition = 'transform 0.22s ease, opacity 0.22s ease';
      fromCard.style.transform  = `translateX(${outX})`;
      fromCard.style.opacity    = '0';
      fromCard.style.pointerEvents = 'none';
    }
    if (toCard) {
      toCard.style.transition = 'none';
      toCard.style.transform  = `translateX(${inX})`;
      toCard.style.opacity    = '0';
    }
    toEl.classList.add('open', 'modal-no-bg');
    if (onBefore) onBefore();
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (toCard) {
        toCard.style.transition = 'transform 0.32s cubic-bezier(0.16,1,0.3,1), opacity 0.28s ease';
        toCard.style.transform  = '';
        toCard.style.opacity    = '';
      }
      setTimeout(() => {
        fromEl.classList.remove('open');
        toEl.classList.remove('modal-no-bg');
        if (fromCard) fromCard.style.cssText = '';
        if (toCard)   { toCard.style.transition = ''; toCard.style.transform = ''; toCard.style.opacity = ''; }
      }, 230);
    }));
  }

  document.querySelectorAll('[data-open]').forEach(b =>
    b.addEventListener('click', () => openModal(b.dataset.open))
  );
  document.querySelectorAll('[data-close]').forEach(b =>
    b.addEventListener('click', () => closeModal(b.dataset.close))
  );
  document.querySelectorAll('.modal-backdrop').forEach(b => {
    b.addEventListener('click', e => {
      if (e.target === b) {
        if (b.id === 'modal-history') {
          inConnectFlow = false;
          closeModal('modal-history');
          return;
        }
        b.classList.remove('open');
        if (b.id === 'modal-connect' || b.id === 'modal-groups') {
          localStorage.setItem('zotok_connect_dismissed', '1');
        }
      }
    });
  });

  // ---------- Tabs (inside modals or pages) ----------
  document.querySelectorAll('[data-tabs]').forEach(group => {
    const tabs = group.querySelectorAll('.tab');
    const panels = document.querySelectorAll(`[data-tab-panels="${group.dataset.tabs}"] .tab-panel`);
    tabs.forEach(t => t.addEventListener('click', () => {
      tabs.forEach(x => x.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      t.classList.add('active');
      const target = document.querySelector(`[data-tab-panels="${group.dataset.tabs}"] [data-panel="${t.dataset.tab}"]`);
      if (target) target.classList.add('active');
    }));
  });

  // ---------- WhatsApp connect: fake "waiting → connected" ----------
  const stateEl = document.getElementById('connect-state');
  if (stateEl) {
    document.querySelectorAll('[data-fake-connect]').forEach(b => {
      b.addEventListener('click', () => {
        inConnectFlow = true;
        stateEl.innerHTML = '<span class="dot dot-success"></span> Connected!';
        setTimeout(() => {
          transitionTo('modal-connect', 'modal-history', 'forward', () => initHistoryModal());
          if (stateEl) stateEl.innerHTML = '<span class="dot dot-warn"></span> Waiting for WhatsApp…';
        }, 500);
      });
    });
  }

  // ---------- Chat history sync modal ----------
  function initHistoryModal() {
    const optionList  = document.getElementById('history-option-list');
    const customRange = document.getElementById('custom-range');
    const fromInput   = document.getElementById('history-from');
    const toInput     = document.getElementById('history-to');
    const fetchBtn    = document.getElementById('history-fetch-btn');
    const skipBtn     = document.getElementById('history-skip-btn');
    const closeBtn    = document.getElementById('history-close-btn');

    if (!optionList) return;

    // Reset to default (Last 7 Days)
    optionList.querySelectorAll('.history-option-row').forEach(r => r.classList.remove('selected'));
    const defaultRow = optionList.querySelector('[data-days="7"]');
    if (defaultRow) defaultRow.classList.add('selected');
    if (customRange) customRange.style.display = 'none';

    const today = new Date();
    const fmt = d => d.toISOString().slice(0, 10);
    if (toInput) { toInput.value = fmt(today); toInput.max = fmt(today); }
    const d7 = new Date(today); d7.setDate(today.getDate() - 7);
    if (fromInput) fromInput.value = fmt(d7);

    let activeDays = 7;

    optionList.querySelectorAll('.history-option-row').forEach(row => {
      row.onclick = () => {
        optionList.querySelectorAll('.history-option-row').forEach(r => r.classList.remove('selected'));
        row.classList.add('selected');
        const days = row.dataset.days;
        if (days === 'custom') {
          activeDays = 'custom';
          if (customRange) customRange.style.display = 'flex';
        } else {
          activeDays = parseInt(days, 10);
          if (customRange) customRange.style.display = 'none';
          const from = new Date(today); from.setDate(today.getDate() - activeDays);
          if (fromInput) fromInput.value = fmt(from);
          if (toInput)   toInput.value   = fmt(today);
        }
      };
    });

    if (fromInput) fromInput.onchange = () => {
      if (toInput && fromInput.value > toInput.value) toInput.value = fromInput.value;
    };

    function goToGroups() {
      const backBtn = document.getElementById('groups-back-btn');
      if (backBtn) backBtn.style.display = inConnectFlow ? '' : 'none';
      transitionTo('modal-history', 'modal-groups', 'forward');
    }

    if (fetchBtn) { fetchBtn.onclick = null; fetchBtn.addEventListener('click', goToGroups); }
    if (skipBtn)  { skipBtn.onclick  = null; skipBtn.addEventListener('click', goToGroups); }
    if (closeBtn) { closeBtn.onclick = null; closeBtn.addEventListener('click', () => { inConnectFlow = false; closeModal('modal-history'); }); }
  }

  // ---------- Groups → history back button ----------
  const groupsBackBtn = document.getElementById('groups-back-btn');
  if (groupsBackBtn) {
    groupsBackBtn.addEventListener('click', () => {
      groupsBackBtn.style.display = 'none';
      transitionTo('modal-groups', 'modal-history', 'back', () => initHistoryModal());
    });
  }

  // ---------- Group selection ----------
  const groupList = document.getElementById('group-list');
  const counterEl = document.getElementById('group-counter');
  const syncBtn = document.getElementById('sync-btn');
  const LIMIT = 10;

  if (groupList && counterEl) {
    const update = () => {
      const n = groupList.querySelectorAll('.group-row.selected').length;
      const strong = counterEl.querySelector('strong');
      if (strong) strong.textContent = `${n}/${LIMIT}`;
      if (syncBtn) syncBtn.disabled = n === 0;
    };
    groupList.querySelectorAll('.group-row:not(.locked)').forEach(row => {
      row.addEventListener('click', () => {
        const sel = row.classList.contains('selected');
        const cnt = groupList.querySelectorAll('.group-row.selected').length;
        if (!sel && cnt >= LIMIT) return;
        row.classList.toggle('selected');
        update();
      });
    });
    update();
  }

  // ---------- Chat composer ----------
  const composer = document.getElementById('composer');
  const ta = document.getElementById('composer-input');
  const sendBtn = document.getElementById('send-btn');
  const thread = document.getElementById('chat-thread');
  const empty = document.getElementById('chat-empty');
  const scroll = document.getElementById('chat-scroll');

  function autoSize() {
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 160) + 'px';
    if (sendBtn) sendBtn.disabled = ta.value.trim() === '';
  }
  if (ta) {
    ta.addEventListener('input', autoSize);
    autoSize();
    ta.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        send();
      }
    });
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function appendUser(text) {
    if (empty) empty.style.display = 'none';
    if (thread) {
      const shell = thread.closest('.chat-shell');
      if (shell) shell.classList.add('chat-active');
    }
    if (!thread) return;
    const msg = document.createElement('div');
    msg.className = 'msg user';
    msg.innerHTML = `
      <div class="msg-avatar">RP</div>
      <div class="msg-body">
        <div class="msg-name">You</div>
        <div class="msg-text">${escapeHtml(text)}</div>
      </div>`;
    thread.appendChild(msg);
    if (scroll) scroll.scrollTop = scroll.scrollHeight;
  }

  function appendTyping() {
    if (!thread) return null;
    const msg = document.createElement('div');
    msg.className = 'msg ai';
    msg.id = '__typing';
    msg.innerHTML = `
      <div class="msg-avatar"><img src="assets/icons/zotok-logo.svg" alt="Zotok" class="msg-avatar-img"></div>
      <div class="msg-body">
        <div class="msg-name">Zotok</div>
        <div class="msg-text"><div class="typing"><span></span><span></span><span></span></div></div>
      </div>`;
    thread.appendChild(msg);
    if (scroll) scroll.scrollTop = scroll.scrollHeight;
    return msg;
  }

  function appendAi(html) {
    const t = document.getElementById('__typing');
    if (t) t.remove();
    const msg = document.createElement('div');
    msg.className = 'msg ai';
    msg.innerHTML = `
      <div class="msg-avatar"><img src="assets/icons/zotok-logo.svg" alt="Zotok" class="msg-avatar-img"></div>
      <div class="msg-body">
        <div class="msg-name">Zotok</div>
        <div class="msg-text">${html}</div>
      </div>`;
    thread.appendChild(msg);
    if (scroll) scroll.scrollTop = scroll.scrollHeight;
  }

  // Pre-load chats from "Recent" sidebar tabs
  const params = new URLSearchParams(window.location.search);
  const chatParam = params.get('chat');
  if (chatParam && thread && empty) {
    empty.style.display = 'none';
    const shell = thread.closest('.chat-shell');
    if (shell) shell.classList.add('chat-active');
    
    if (chatParam === 'mumbai') {
      appendUser("Can you summarize the Sales – Mumbai weekly performance?");
      appendAi("<p>Here is the weekly summary for <strong>Sales – Mumbai</strong>:</p><ul><li>Total sales up by 12% vs last week.</li><li>Top product: SKU-44 with 3,200 units sold.</li><li>New leads generated: 14.</li></ul>");
      appendUser("Which territories in Mumbai drove the most growth?");
      appendAi("<p>The majority of the growth came from <strong>Navi Mumbai</strong> (up 22%) and <strong>Andheri East</strong> (up 15%). The South Mumbai region remained flat week-over-week.</p>");
      appendUser("What about SKU-48? Did it perform well?");
      appendAi("<p><strong>SKU-48</strong> sales were lower than expected, dropping by 5% this week. Distributors mentioned that competitor pricing has become more aggressive in that category.</p>");
      appendUser("Any updates on the new key account we acquired last month?");
      appendAi("<p>Yes, the new key account in Thane placed a repeat order for 1,500 units of SKU-22. They seem very satisfied with the turnaround time.</p>");
      appendUser("What's our inventory looking like for SKU-44? Since it sold so well, do we have enough for next week?");
      appendAi("<p>Current stock for <strong>SKU-44</strong> at the Bhiwandi warehouse is 8,500 units. At the current run rate, we have enough cover for approximately 2.5 weeks. I would recommend placing a replenishment order soon to avoid any stockouts.</p>");
      appendUser("Please draft an email to the logistics team to initiate a stock transfer of 2,000 units from Pune to Mumbai just in case.");
      appendAi("<p>I've drafted the message. You can review it below:</p><div style='padding: 12px; background: var(--surface-2); border-radius: var(--r-lg); margin-top: 8px;'><strong>Subject:</strong> Urgent: Stock Transfer Request for SKU-44<br><br>Hi Logistics Team,<br><br>Due to a spike in demand in the Mumbai region, please initiate a transfer of 2,000 units of SKU-44 from the Pune depot to the Bhiwandi warehouse at your earliest convenience.<br><br>Thanks.</div>");
      appendUser("Looks good. Send it.");
      appendAi("<p>The email has been sent successfully to <em>logistics@zotok.example.com</em>.</p>");
      appendUser("Are there any outstanding payments from Mumbai distributors?");
      appendAi("<p>There are 3 outstanding invoices over 30 days past due:</p><ul><li><strong>Patel Traders:</strong> ₹1,45,000 (35 days)</li><li><strong>Mehta Agencies:</strong> ₹85,000 (42 days)</li><li><strong>Rao Distributors:</strong> ₹2,10,000 (31 days)</li></ul>");
      appendUser("Okay, remind Patel Traders and Mehta Agencies via WhatsApp.");
      appendAi("<p>Done. Automated payment reminders have been pushed to <strong>Patel Traders</strong> and <strong>Mehta Agencies</strong> on WhatsApp.</p>");
    } else if (chatParam === 'margin') {
      appendUser("What was the outcome of the Distributor margin call?");
      appendAi("<p>During the <strong>Distributor margin call</strong> today:</p><ul><li>Agreed to increase base margin by 1% across all tier-1 products.</li><li>Volume bonus threshold raised to 10k units.</li><li>Next review scheduled for Q3.</li></ul>");
      appendUser("Did anyone push back on the volume threshold increase?");
      appendAi("<p>Yes, <strong>Rahul Joshi</strong> (Delhi FMCG Traders) and <strong>Suresh Patel</strong> (Mumbai Distributors) expressed concerns that 10k units might be too steep for smaller regional partners. They requested a tiered approach instead.</p>");
      appendUser("How did we address that?");
      appendAi("<p>The VP of Sales agreed to look into creating a mid-tier bonus at 5k units, offering a 0.5% kicker, but this was tabled for further financial modeling. No final commitment was made on the call.</p>");
      appendUser("Can you pull up the historical margin data for the last 3 years to see how this compares?");
      appendAi("<p>Sure. Here is the historical base margin for tier-1 products:</p><ul><li><strong>2023:</strong> 7.0%</li><li><strong>2024:</strong> 7.5%</li><li><strong>2025:</strong> 8.0%</li><li><strong>2026 (New):</strong> 9.0%</li></ul><p>The 1% jump is the largest single-year increase we've approved in the last 4 years.</p>");
      appendUser("We need to model the impact of the 5k unit mid-tier. What would be the margin hit?");
      appendAi("<p>If we introduce a 0.5% mid-tier bonus at 5k units, assuming 30% of current distributors hit that tier without reaching the 10k max, the estimated blended margin hit would be an additional <strong>0.15% to 0.2%</strong> overall.</p>");
      appendUser("That's manageable. I'll discuss this with finance. Any other key points from the call?");
      appendAi("<p>The team also discussed tightening credit terms from 45 days to 30 days to offset the margin increase, but the distributors firmly rejected it. The terms will remain at 45 days.</p>");
      appendUser("Got it. Please summarize these notes and send them to the leadership group.");
      appendAi("<p>Summary prepared and forwarded to the <em>Leadership WhatsApp Group</em>. They should receive it momentarily.</p>");
    } else if (chatParam === 'pune') {
      appendUser("Give me a full status update on the Pune delivery delays.");
      appendAi("<p>Regarding <strong>Pune delivery delays</strong>:</p><ul><li>3 trucks delayed due to unexpected highway repairs on the Mumbai-Pune expressway.</li><li>Expected clearance by tomorrow 10 AM.</li><li>All affected retailers (14 total) have been notified via WhatsApp.</li></ul>");
      appendUser("Which key retailers are affected?");
      appendAi("<p>The most impacted key accounts are:</p><ul><li><strong>Mohan Agarwal</strong> (Camp area) - 2 orders pending</li><li><strong>Pooja Mehta</strong> (Kothrud) - 1 order pending</li><li><strong>Geeta Patil</strong> (Wakad) - 1 bulk order pending</li></ul>");
      appendUser("Has Pooja Mehta complained? She usually requires delivery before 9 AM.");
      appendAi("<p>Yes, <strong>Pooja Mehta</strong> sent a message 30 minutes ago stating: <em>'Need delivery before 9 AM only — shop opens late.'</em> Since the trucks won't clear until 10 AM, her delivery will likely be pushed to the following day.</p>");
      appendUser("That's not good. Let's arrange a dedicated smaller transport for her order from a local micro-warehouse if possible.");
      appendAi("<p>Checking local inventory...<br><br>The local Wakad micro-warehouse has 80% of her requested SKUs. We can dispatch a local mini-truck for immediate fulfillment, leaving only 20% on backorder.</p>");
      appendUser("Do it. And send her a message apologizing and explaining the split delivery.");
      appendAi("<p>Done. The local dispatch has been triggered. I sent the following message to Pooja Mehta: <em>'Hi Pooja, sorry for the delay on the highway. We are dispatching 80% of your order immediately from our local hub to ensure you have stock before 9 AM. The remaining 20% will follow tomorrow. Apologies for the inconvenience.'</em></p>");
      appendUser("Excellent. What about the other 13 retailers? Are they okay with waiting?");
      appendAi("<p>So far, 11 of them have acknowledged the delay without issue. <strong>Mohan Agarwal</strong> asked for a timeline, and we provided the 10 AM clearance estimate. We are still waiting to hear back from one retailer.</p>");
      appendUser("Keep me posted if any escalations occur.");
      appendAi("<p>Will do. I will monitor the Pune Retailers Chat and flag any urgent complaints regarding these delayed shipments.</p>");
    }
  }

  const replies = {
    summarize: `<p>Across <strong>Sales – Mumbai</strong> and <strong>Distributors – South</strong> this week:</p>
      <ul>
        <li>147 messages, 38 from non-buyers (likely leads).</li>
        <li>Top topic: pricing for the new SKU launch (mentioned 22×).</li>
        <li>Two unresolved complaints about delivery delays in Pune.</li>
      </ul>`,
    decisions: `<p>Three decisions were committed this week:</p>
      <ul>
        <li>Distributor margin moves from 8% → 9% effective May 15.</li>
        <li>Trial run of express dispatch from Surat warehouse.</li>
        <li>Diwali campaign creatives locked by May 12.</li>
      </ul>`,
    urgent: `<p>Two items flagged urgent across your groups:</p>
      <ul>
        <li><strong>Refund request</strong> from Patel Traders pending since Friday.</li>
        <li><strong>Stockout alert</strong> on SKU #4421 — three retailers asking.</li>
      </ul>`,
    default: `<p>I scanned your synced groups. Tell me what to look for — decisions, leads, complaints, or a specific keyword — and I'll pull it together.</p>`
  };

  function send(presetKey) {
    const text = presetKey ? document.querySelector(`[data-prompt="${presetKey}"] .prompt-title`).textContent : (ta ? ta.value.trim() : '');
    if (!text) return;
    appendUser(text);
    if (ta) { ta.value = ''; autoSize(); }
    appendTyping();
    setTimeout(() => {
      let key = 'default';
      const lc = text.toLowerCase();
      if (presetKey) key = presetKey;
      else if (lc.includes('summar')) key = 'summarize';
      else if (lc.includes('decision')) key = 'decisions';
      else if (lc.includes('urgent') || lc.includes('issue')) key = 'urgent';
      appendAi(replies[key] || replies.default);
    }, 850);
  }

  if (sendBtn) sendBtn.addEventListener('click', () => send());
  document.querySelectorAll('[data-prompt]').forEach(b => {
    b.addEventListener('click', () => send(b.dataset.prompt));
  });

  // ---------- Login OTP flow ----------
  const phoneStep = document.getElementById('phone-step');
  const otpStep = document.getElementById('otp-step');
  const phoneNext = document.getElementById('phone-next');
  const otpVerify = document.getElementById('otp-verify');
  const otpBack = document.getElementById('otp-back');
  const phoneInput = document.getElementById('phone-input');
  const phoneEcho = document.getElementById('phone-echo');

  if (phoneNext) {
    phoneNext.addEventListener('click', e => {
      e.preventDefault();
      const v = phoneInput && phoneInput.value.trim();
      if (!v) return;
      if (phoneEcho) phoneEcho.textContent = '+91 ' + v;
      phoneStep.style.display = 'none';
      otpStep.style.display = 'block';
      const first = otpStep.querySelector('.otp-cell');
      if (first) first.focus();
    });
  }
  if (otpBack) {
    otpBack.addEventListener('click', e => {
      e.preventDefault();
      otpStep.style.display = 'none';
      phoneStep.style.display = 'block';
    });
  }
  if (otpVerify) {
    otpVerify.addEventListener('click', e => {
      e.preventDefault();
      localStorage.setItem('zotok_auth', '1');
      window.location.href = 'chat.html?connect=1';
    });
  }
  // OTP cell auto-advance
  document.querySelectorAll('.otp-cell').forEach((cell, i, all) => {
    cell.addEventListener('input', () => {
      cell.value = cell.value.replace(/\D/g, '').slice(-1);
      if (cell.value && all[i + 1]) all[i + 1].focus();
    });
    cell.addEventListener('keydown', e => {
      if (e.key === 'Backspace' && !cell.value && all[i - 1]) all[i - 1].focus();
    });
  });

  // ---------- First-load connect modal on dashboard ----------
  if (page === 'chat') {
    if (new URLSearchParams(window.location.search).get('connect') === '1') {
      try { history.replaceState(null, '', 'chat.html'); } catch(e) {}
      setTimeout(() => openModal('modal-connect'), 300);
    } else if (!localStorage.getItem('zotok_connected') && !localStorage.getItem('zotok_connect_dismissed')) {
      setTimeout(() => openModal('modal-connect'), 400);
    }
  }
  document.querySelectorAll('[data-mark-connected]').forEach(b =>
    b.addEventListener('click', () => {
      inConnectFlow = false;
      const backBtn = document.getElementById('groups-back-btn');
      if (backBtn) backBtn.style.display = 'none';
      localStorage.setItem('zotok_connected', '1');
      const card = b.closest('.modal, .mgc');
      if (card) card.classList.add('syncing');
    })
  );
  // ---------- Categorise message groups modal logic ----------
  const catList = document.getElementById('category-list');
  const addCatBtn = document.getElementById('add-category-btn');
  const saveCatBtn = document.getElementById('save-categories-btn');
  const catError = document.getElementById('category-error');

  let categories = [
    { name: 'Sales', desc: 'Inquiries, bulk pricing requests, and leads identified from the groups.', prompt: 'Extract any messages showing purchase intent or pricing questions.' },
    { name: 'Support', desc: 'Complaints, refund requests, and product issues.', prompt: 'Identify complaints, defective item reports, or refund requests.' },
    { name: 'Logistics', desc: 'Delivery delays, warehouse updates, and dispatch tracking.', prompt: 'Extract messages related to shipping, tracking, or delayed deliveries.' },
    { name: 'Internal', desc: 'Team standups, policy updates, and internal coordination.', prompt: 'Find messages from team members regarding process, policy, or HR.' }
  ];

  function renderCategories() {
    if (!catList) return;
    catList.innerHTML = '';
    if (catError) catError.textContent = '';
    
    categories.forEach((cat, index) => {
      const el = document.createElement('div');
      el.style.cssText = 'background:var(--white); border:1px solid var(--border); border-radius:var(--r-lg); padding:16px; position:relative;';
      el.innerHTML = `
        <button class="icon-btn" type="button" data-index="${index}" class="delete-cat-btn" style="position:absolute; top:12px; right:12px; color:var(--muted);" aria-label="Delete category">
          <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </button>
        <div style="display:flex; gap:12px; margin-bottom:12px;">
          <div style="flex:1;">
            <label style="display:block; font-size:12px; font-weight:600; color:var(--ink-2); margin-bottom:4px;">Category name *</label>
            <input type="text" class="input cat-name" value="${cat.name}" data-index="${index}" style="width:100%;" placeholder="e.g. Refunds">
          </div>
          <div style="flex:2;">
            <label style="display:block; font-size:12px; font-weight:600; color:var(--ink-2); margin-bottom:4px;">Description</label>
            <input type="text" class="input cat-desc" value="${cat.desc}" data-index="${index}" style="width:100%;" placeholder="What kind of messages?">
          </div>
        </div>
        <div>
          <label style="display:block; font-size:12px; font-weight:600; color:var(--ink-2); margin-bottom:4px;">Prompt rules</label>
          <textarea class="input cat-prompt" data-index="${index}" style="width:100%; min-height:60px; resize:vertical;">${cat.prompt}</textarea>
        </div>
      `;
      
      const delBtn = el.querySelector('button[data-index]');
      delBtn.addEventListener('click', () => {
        if (categories.length <= 1) {
          if (catError) catError.textContent = 'At least 1 category is required.';
          return;
        }
        categories.splice(index, 1);
        renderCategories();
      });

      const nameInput = el.querySelector('.cat-name');
      const descInput = el.querySelector('.cat-desc');
      const promptInput = el.querySelector('.cat-prompt');

      nameInput.addEventListener('input', (e) => { categories[index].name = e.target.value; });
      descInput.addEventListener('input', (e) => { categories[index].desc = e.target.value; });
      promptInput.addEventListener('input', (e) => { categories[index].prompt = e.target.value; });

      catList.appendChild(el);
    });
  }

  if (addCatBtn) {
    addCatBtn.addEventListener('click', () => {
      categories.push({ name: '', desc: '', prompt: '' });
      renderCategories();
      // focus the new input
      setTimeout(() => {
        const inputs = catList.querySelectorAll('.cat-name');
        if (inputs.length) inputs[inputs.length - 1].focus();
      }, 50);
    });
  }

  if (saveCatBtn) {
    saveCatBtn.addEventListener('click', () => {
      // Validation
      const names = categories.map(c => c.name.trim().toLowerCase());
      const hasEmpty = names.some(n => !n);
      const hasDuplicates = new Set(names).size !== names.length;

      if (hasEmpty) {
        if (catError) catError.textContent = 'All categories must have a name.';
        return;
      }
      if (hasDuplicates) {
        if (catError) catError.textContent = 'Category names must be unique.';
        return;
      }
      if (categories.length === 0) {
        if (catError) catError.textContent = 'At least 1 category is required.';
        return;
      }
      
      // Save logic — mark as active and update card + sidebar
      if (catError) catError.textContent = '';
      localStorage.setItem('zotok_agent_category', 'active');
      if (window.setState) window.setState('category', 'active');
      if (window.updateCardUI) window.updateCardUI('category', 'active');
      if (window.syncSidebar) window.syncSidebar();
      
      const originalText = saveCatBtn.textContent;
      saveCatBtn.textContent = 'Saved!';
      setTimeout(() => {
        closeModal('modal-configure-agent');
        saveCatBtn.textContent = originalText;
      }, 600);
    });
  }

  // Hook into openModal to render categories fresh
  const originalOpenModal = window.openModal;
  window.openModal = function(id) {
    if (id === 'modal-configure-agent') {
      renderCategories();
    }
    originalOpenModal(id);
  };
})();
