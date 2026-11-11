/* =========================================================
   English-interface concept demos (for international clients)
   Pulse Analytics • TaskFlow CRM • SwiftTrack • Azure Stay • FreshCart • IronPulse Gym
   ⚠️ All data is fictional and generated in JavaScript. No server, no real brands or clients.
   ========================================================= */
(function () {
  'use strict';
  const D = window.MasarDemo; if (!D || !D.kit) return;
  const { esc, ic, num, pad, fmtD, TODAY, addDays, rng, kpi, bars, table, emptyRow, hl, norm, addIcons } = D.kit;
  const usd = (n) => '$' + (Math.round(n * 100) / 100).toLocaleString('en-US', { minimumFractionDigits: Number.isInteger(Math.round(n * 100) / 100) ? 0 : 2, maximumFractionDigits: 2 });
  const pill = (c, t) => `<span class="dm-pill ${c}">${esc(t)}</span>`;
  const btn = (act, label, extra, cls) => `<button type="button" class="dm-btn ${cls || ''}" data-act="${act}" ${extra || ''}>${label}</button>`;
  const field = (label, html) => `<label class="x-field"><span>${label}</span>${html}</label>`;
  const pick = (r, a) => a[Math.floor(r() * a.length)];
  addIcons({
    kanban2: 'M4 4h5v16H4zM10 4h5v11h-5zM16 4h5v14h-5z', pkg: 'M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10', bed: 'M3 18V8M3 14h18v4M21 14v-3a3 3 0 0 0-3-3h-7v6M7 11h.01',
    dumb: 'M6 8v8M3 10v4M18 8v8M21 10v4M6 12h12', pin2: 'M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z'
  });

  /* simple SVG line/area chart */
  function line(vals, color, labels) {
    const w = 560, h = 170, p = 14, max = Math.max.apply(null, vals), min = Math.min.apply(null, vals);
    const pts = vals.map((v, i) => [p + (i * (w - 2 * p)) / (vals.length - 1), h - p - ((v - min) / (max - min || 1)) * (h - 2 * p - 10) - 6]);
    const d = pts.map((q, i) => (i ? 'L' : 'M') + q[0].toFixed(1) + ' ' + q[1].toFixed(1)).join(' ');
    const last = pts[pts.length - 1];
    return `<svg class="x-line" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" role="img" aria-label="Trend chart"><path d="${d} L${w - p} ${h - p} L${p} ${h - p} Z" fill="${color}" opacity=".13"/><path d="${d}" fill="none" stroke="${color}" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/><circle cx="${last[0]}" cy="${last[1]}" r="4.5" fill="${color}"/></svg>${labels ? `<div class="x-axis">${labels.map((l) => `<span>${l}</span>`).join('')}</div>` : ''}`;
  }

  /* =========================================================
     1) Pulse Analytics — SaaS analytics dashboard
     ========================================================= */
  D.register('pulse', () => {
    const R = { 7: { mrr: 48200, d: '+3.1%', users: 12480, du: '+1.9%', churn: 1.8, dc: '-0.2%', arpu: 38.6, da: '+0.8%', rev: [6100, 6400, 6250, 6800, 7050, 6900, 7300], lb: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
      30: { mrr: 48200, d: '+9.4%', users: 12480, du: '+7.2%', churn: 2.1, dc: '-0.4%', arpu: 38.6, da: '+2.6%', rev: [38200, 39100, 40800, 41500, 42300, 41800, 43600, 44900, 45200, 46800, 47500, 48200], lb: ['W1', '', '', 'W2', '', '', 'W3', '', '', 'W4', '', 'Now'] },
      90: { mrr: 48200, d: '+27.8%', users: 12480, du: '+21.5%', churn: 2.4, dc: '-0.9%', arpu: 38.6, da: '+6.1%', rev: [24100, 26800, 28200, 31500, 33900, 36100, 39800, 42300, 45100, 48200], lb: ['Aug', '', 'Sep', '', '', 'Oct', '', '', '', 'Now'] } };
    const plans = { Starter: 29, Growth: 99, Scale: 349 };
    const customers = () => { const r = rng(9), names = ['Northwind Labs', 'Brightpath Co', 'Helix Dynamics', 'Orbit Retail', 'Lumen Studio', 'Atlas Freight', 'Verde Energy', 'Summit Health', 'Nova Fintech', 'Pixel & Pine', 'Cobalt Systems', 'Maple Logistics', 'Zenith Media', 'Ironclad Security']; return names.map((n, i) => { const plan = ['Starter', 'Growth', 'Scale'][i % 3 === 2 ? 2 : i % 2]; return { id: i + 1, n, plan, seats: 3 + Math.floor(r() * 40), mrr: plans[plan] * (1 + Math.floor(r() * 4)), st: i === 6 ? 'trial' : i === 11 ? 'churned' : 'active', since: addDays(TODAY, -Math.floor(40 + r() * 600)), health: 55 + Math.floor(r() * 45) }; }); };
    const stp = (s) => ({ active: pill('p5', 'Active'), trial: pill('p2', 'Trial'), churned: pill('pr', 'Churned') }[s]);
    const rows = (app) => { const q = norm(app.s.q); return app.s.c.filter((c) => (app.s.plan === 'All' || c.plan === app.s.plan) && (!q || norm(c.n).includes(q))); };
    const crow = (list, q) => list.map((c) => `<tr class="click" tabindex="0" data-act="pOpen" data-id="${c.id}"><td>${hl(c.n, q)}</td><td>${c.plan}</td><td class="num">${c.seats}</td><td class="num">${usd(c.mrr)}</td><td>${stp(c.st)}</td></tr>`).join('') || emptyRow(5);
    return {
      forceEn: true, name: 'Pulse Analytics', sub: 'SaaS analytics', cls: 'x-pulse', mark: 'P',
      nav: [{ id: 'ov', icon: 'dash', label: 'Overview' }, { id: 'rev', icon: 'chart', label: 'Revenue' }, { id: 'cus', icon: 'users', label: 'Customers' }, { id: 'rep', icon: 'file', label: 'Reports' }],
      state: () => ({ range: 30, c: customers(), q: '', plan: 'All' }),
      views: {
        ov(app) {
          const d = R[app.s.range], c = app.s.c.filter((x) => x.st === 'active').sort((a, b) => b.mrr - a.mrr).slice(0, 5);
          return `<div class="x-seg" role="tablist">${[7, 30, 90].map((n) => `<button type="button" class="${app.s.range === n ? 'on' : ''}" data-act="pRange" data-n="${n}">Last ${n} days</button>`).join('')}</div>
            <div class="dm-kpis">${kpi('cash', usd(d.mrr), `MRR <em class="x-up">${d.d}</em>`)}${kpi('users', num(d.users), `Active users <em class="x-up">${d.du}</em>`, 'g')}${kpi('x', d.churn + '%', `Churn <em class="x-up">${d.dc}</em>`, 'r')}${kpi('wallet', usd(d.arpu), `ARPU <em class="x-up">${d.da}</em>`)}</div>
            <div class="dm-cols"><div class="dm-panel"><h3>Revenue trend <small>${app.s.range === 7 ? 'daily' : app.s.range === 30 ? 'weekly' : 'monthly'}</small></h3>${line(d.rev, '#2563eb', d.lb)}</div>
            <div class="dm-panel"><h3>Traffic sources</h3>${bars([{ l: 'Organic', v: 41 }, { l: 'Paid ads', v: 27 }, { l: 'Referral', v: 18 }, { l: 'Email', v: 9 }, { l: 'Social', v: 5 }], false)}</div></div>
            <div class="dm-panel" style="margin-top:14px"><h3>Top accounts</h3>${table(['Account', 'Plan', 'Seats', 'MRR'], c.map((x) => `<tr><td>${esc(x.n)}</td><td>${x.plan}</td><td class="num">${x.seats}</td><td class="num">${usd(x.mrr)}</td></tr>`).join(''))}</div>`;
        },
        rev(app) {
          const by = Object.keys(plans).map((p) => ({ l: p, v: app.s.c.filter((c) => c.plan === p && c.st === 'active').reduce((a, c) => a + c.mrr, 0) }));
          return `<div class="dm-cols-2"><div class="dm-panel"><h3>MRR by plan</h3>${bars(by, true)}</div><div class="dm-panel"><h3>MRR movement (30 days)</h3>${table(['Type', 'Amount'], [['New business', '+$6,240', 'dm-pos'], ['Expansion', '+$2,180', 'dm-pos'], ['Contraction', '-$640', 'dm-neg'], ['Churn', '-$1,020', 'dm-neg'], ['Net new MRR', '+$6,760', 'dm-pos']].map((r) => `<tr><td>${r[0]}</td><td class="num ${r[2]}"><b>${r[1]}</b></td></tr>`).join(''))}</div></div>
            <div class="dm-panel" style="margin-top:14px"><h3>Cumulative MRR</h3>${line(R[90].rev, '#16a34a', R[90].lb)}</div>`;
        },
        cus(app) {
          return `<div class="dm-toolbar"><div class="dm-search">${ic('search')}<input class="dm-input" data-in="pSearch" value="${esc(app.s.q)}" placeholder="Search customers…"></div><select class="dm-select" data-ch="pPlan" aria-label="Plan">${['All', 'Starter', 'Growth', 'Scale'].map((p) => `<option ${app.s.plan === p ? 'selected' : ''}>${p}</option>`).join('')}</select></div><div id="pBody">${table(['Customer', 'Plan', 'Seats', 'MRR', 'Status'], crow(rows(app), norm(app.s.q)))}</div>`;
        },
        rep() {
          return table(['Report', 'Schedule', 'Recipients', ''], [['Weekly executive summary', 'Mondays 08:00', 'Leadership team'], ['Monthly revenue & churn', '1st of month', 'Finance'], ['Product usage digest', 'Fridays 16:00', 'Product team']].map((r) => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${btn('pGen', ic('file') + ' Generate', '', 'sm')}</td></tr>`).join(''));
        }
      },
      acts: {
        pRange(app, el) { app.s.range = +el.dataset.n; app.render(); },
        pSearch(app, el) { app.s.q = el.value; app.$('#pBody').innerHTML = table(['Customer', 'Plan', 'Seats', 'MRR', 'Status'], crow(rows(app), norm(app.s.q))); },
        pPlan(app, el) { app.s.plan = el.value; app.$('#pBody').innerHTML = table(['Customer', 'Plan', 'Seats', 'MRR', 'Status'], crow(rows(app), norm(app.s.q))); },
        pOpen(app, el) {
          const c = app.s.c.find((x) => x.id === +el.dataset.id);
          app.drawer(esc(c.n), `<p>${stp(c.st)} · ${c.plan} plan · ${c.seats} seats</p><p>MRR <b class="num">${usd(c.mrr)}</b> · Customer since ${fmtD(c.since)}</p><h4>Health score</h4>${bars([{ l: 'Health', v: c.health }, { l: 'Adoption', v: Math.min(100, c.health + 8) }, { l: 'Support', v: Math.max(30, c.health - 12) }], true)}<div class="dm-actions">${btn('pGen', 'Send check-in email', '', 'pri')}</div>`);
        },
        pGen(app) { app.toast('Queued — exports are disabled in the demo'); },
        closeDrawer(app) { app.closeDrawer(); }
      }
    };
  });

  /* =========================================================
     2) TaskFlow CRM — sales pipeline
     ========================================================= */
  D.register('crm', () => {
    const ST = ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Won'];
    const deals = () => [['Website redesign', 'Brightpath Co', 18000, 0, 'Emma Clark'], ['CRM integration', 'Helix Dynamics', 42000, 0, 'Liam Brooks'], ['Mobile app MVP', 'Orbit Retail', 65000, 1, 'Emma Clark'], ['Data migration', 'Atlas Freight', 27500, 1, 'Noah Reed'], ['Brand platform', 'Lumen Studio', 31000, 2, 'Liam Brooks'], ['Analytics suite', 'Nova Fintech', 88000, 2, 'Emma Clark'], ['Support portal', 'Summit Health', 36500, 3, 'Noah Reed'], ['E-commerce build', 'Verde Energy', 54000, 3, 'Liam Brooks'], ['Annual retainer', 'Northwind Labs', 24000, 4, 'Emma Clark'], ['Security audit', 'Ironclad Security', 19500, 4, 'Noah Reed'], ['Booking platform', 'Maple Logistics', 47000, 1, 'Noah Reed'], ['Internal tools', 'Zenith Media', 22000, 0, 'Emma Clark']].map((d, i) => ({ id: i + 1, t: d[0], co: d[1], v: d[2], s: d[3], o: d[4], notes: ['Intro call completed', 'Sent product overview'] }));
    const contacts = [['Sarah Whitfield', 'Brightpath Co', 'CEO'], ['Daniel Foster', 'Helix Dynamics', 'CTO'], ['Olivia Grant', 'Orbit Retail', 'Head of Digital'], ['James Holloway', 'Atlas Freight', 'Ops Director'], ['Mia Chandler', 'Lumen Studio', 'Founder'], ['Ethan Marsh', 'Nova Fintech', 'VP Product'], ['Chloe Bennett', 'Summit Health', 'COO'], ['Lucas Reid', 'Verde Energy', 'IT Manager']];
    const card = (d) => `<div class="x-deal"><b>${esc(d.t)}</b><span>${esc(d.co)}</span><div class="x-dv"><em class="num">${usd(d.v)}</em><span class="x-mv">${d.s > 0 ? btn('tMove', '‹', `data-id="${d.id}" data-d="-1" aria-label="Move back"`, 'sm') : ''}${d.s < 4 ? btn('tMove', '›', `data-id="${d.id}" data-d="1" aria-label="Move forward"`, 'sm pri') : ''}</span></div><small>${esc(d.o)}</small></div>`;
    return {
      forceEn: true, name: 'TaskFlow CRM', sub: 'Sales pipeline', cls: 'x-crm', mark: 'T',
      nav: [{ id: 'pipe', icon: 'kanban', label: 'Pipeline' }, { id: 'deals', icon: 'list', label: 'Deals' }, { id: 'ppl', icon: 'users', label: 'Contacts' }, { id: 'new', icon: 'plus', label: 'New deal' }],
      state: () => ({ d: deals(), next: 20 }),
      views: {
        pipe(app) {
          const d = app.s.d, open = d.filter((x) => x.s < 4), won = d.filter((x) => x.s === 4), sum = (a) => a.reduce((s, x) => s + x.v, 0);
          return `<div class="dm-kpis">${kpi('cash', usd(sum(open)), 'Open pipeline')}${kpi('check', usd(sum(won)), 'Won this quarter', 'g')}${kpi('chart', Math.round((won.length / d.length) * 100) + '%', 'Win rate')}${kpi('wallet', usd(sum(d) / d.length), 'Average deal')}</div>
            <div class="dm-kanban">${ST.map((s, i) => { const c = d.filter((x) => x.s === i); return `<div class="dm-col"><h4>${s} <b>${c.length}</b></h4><div class="x-colsum">${usd(sum(c))}</div>${c.map(card).join('') || '<p class="dm-empty" style="padding:10px">No deals</p>'}</div>`; }).join('')}</div>`;
        },
        deals(app) {
          return table(['Deal', 'Company', 'Owner', 'Stage', 'Value'], app.s.d.slice().sort((a, b) => b.v - a.v).map((d) => `<tr class="click" tabindex="0" data-act="tOpen" data-id="${d.id}"><td>${esc(d.t)}</td><td>${esc(d.co)}</td><td>${esc(d.o)}</td><td>${pill(['p0', 'p3', 'p1', 'p2', 'p5'][d.s], ST[d.s])}</td><td class="num">${usd(d.v)}</td></tr>`).join(''));
        },
        ppl() { return table(['Name', 'Company', 'Role', ''], contacts.map((c) => `<tr><td>${c[0]}</td><td>${c[1]}</td><td>${c[2]}</td><td>${btn('tMail', ic('share') + ' Email', '', 'sm')}</td></tr>`).join('')); },
        new() {
          return `<div class="dm-panel" style="max-width:560px"><h3>Add a deal</h3>${field('Deal name', '<input class="dm-input" id="nT" placeholder="e.g. Website redesign">')}${field('Company', '<input class="dm-input" id="nC" placeholder="e.g. Acme Inc.">')}${field('Value (USD)', '<input class="dm-input" id="nV" type="number" placeholder="25000">')}${btn('tAdd', ic('plus') + ' Create deal', '', 'pri')}</div>`;
        }
      },
      acts: {
        tMove(app, el) { const d = app.s.d.find((x) => x.id === +el.dataset.id); d.s = Math.max(0, Math.min(4, d.s + +el.dataset.d)); app.render(); app.toast(d.s === 4 ? 'Deal won 🎉' : 'Moved to ' + ST[d.s]); },
        tOpen(app, el) {
          const d = app.s.d.find((x) => x.id === +el.dataset.id);
          app.drawer(esc(d.t), `<p>${esc(d.co)} · <b class="num">${usd(d.v)}</b> · ${pill('p0', ST[d.s])}</p><p>Owner: ${esc(d.o)}</p><h4>Activity</h4><ul class="x-timeline">${d.notes.map((n, i) => `<li><b>${fmtD(addDays(TODAY, -(i + 1) * 3))}</b><span>${esc(n)}</span></li>`).join('')}</ul><div class="dm-actions">${btn('tMove', 'Advance stage', `data-id="${d.id}" data-d="1"`, 'pri')}</div>`);
        },
        tAdd(app) { const t = app.$('#nT').value.trim(), c = app.$('#nC').value.trim(), v = +app.$('#nV').value; if (!t || !c || !(v > 0)) { app.toast('Enter name, company and value'); return; } app.s.d.unshift({ id: app.s.next++, t, co: c, v, s: 0, o: 'You', notes: ['Deal created'] }); app.go('pipe'); app.toast('Deal added to Lead'); },
        tMail(app) { app.toast('Email sending is disabled in the demo'); },
        closeDrawer(app) { app.closeDrawer(); }
      }
    };
  });

  /* =========================================================
     3) SwiftTrack — shipment tracking portal
     ========================================================= */
  D.register('track', () => {
    const STEPS = ['Label created', 'Picked up', 'In transit', 'Out for delivery', 'Delivered'];
    const cities = ['London', 'Manchester', 'Dubai', 'New York', 'Toronto', 'Berlin', 'Paris', 'Riyadh'];
    const ships = () => { const r = rng(21); const base = [['ST-48210937', 'London', 'Dubai', 2, 'Express'], ['ST-48210411', 'Berlin', 'Paris', 4, 'Standard'], ['ST-48210802', 'New York', 'Toronto', 3, 'Express'], ['ST-48211055', 'Manchester', 'Riyadh', 1, 'Standard'], ['ST-48210276', 'Paris', 'London', 4, 'Express'], ['ST-48211190', 'Dubai', 'Berlin', 0, 'Standard']]; return base.map((b, i) => ({ no: b[0], from: b[1], to: b[2], st: b[3], svc: b[4], kg: 1 + Math.floor(r() * 18), eta: addDays(TODAY, b[3] === 4 ? -1 : 1 + (i % 3)), cust: ['Alex Morgan', 'Priya Shah', 'Jonas Weber', 'Hannah Lee', 'Omar Haddad', 'Sofia Rossi'][i] })); };
    const stPill = (s) => pill(s === 4 ? 'p5' : s === 3 ? 'p3' : s === 2 ? 'p0' : 'p2', STEPS[s]);
    const view = (sh) => `<div class="dm-panel x-trk"><div class="x-route"><div><small>FROM</small><b>${sh.from}</b></div><div class="x-bar2"><i style="width:${Math.max(6, (sh.st / 4) * 100)}%"></i><span>${ic('truck')}</span></div><div><small>TO</small><b>${sh.to}</b></div></div>
      <p style="margin:14px 0 4px">${stPill(sh.st)} · ${sh.svc} · ${sh.kg} kg · ${sh.st === 4 ? 'Delivered' : 'ETA'} <b>${fmtD(sh.eta)}</b></p>
      <ol class="x-steps">${STEPS.map((s, i) => `<li class="${i <= sh.st ? 'on' : ''}"><span>${i <= sh.st ? '✓' : ''}</span><div><b>${s}</b><small>${i <= sh.st ? fmtD(addDays(sh.eta, i - 4 - (sh.st === 4 ? 0 : 0))) + ' · ' + (i === 1 ? sh.from + ' depot' : i === 2 ? 'Regional hub' : i === 3 ? sh.to : sh.from) : 'Pending'}</small></div></li>`).join('')}</ol></div>`;
    return {
      forceEn: true, name: 'SwiftTrack', sub: 'Logistics portal', cls: 'x-track', mark: 'S',
      nav: [{ id: 'trk', icon: 'search', label: 'Track a shipment' }, { id: 'all', icon: 'pkg', label: 'Shipments' }, { id: 'new', icon: 'plus', label: 'Create shipment' }, { id: 'ins', icon: 'chart', label: 'Insights' }],
      state: () => ({ s: ships(), q: 'ST-48210937', next: 48211200 }),
      views: {
        trk(app) {
          const sh = app.s.s.find((x) => x.no.toLowerCase() === app.s.q.trim().toLowerCase());
          return `<div class="dm-panel"><h3>Where is my parcel?</h3><div class="dm-toolbar" style="margin:0"><div class="dm-search">${ic('search')}<input class="dm-input" id="tQ" value="${esc(app.s.q)}" placeholder="Enter tracking number, e.g. ST-48210937"></div>${btn('tGo', 'Track', '', 'pri')}</div><p class="dm-caption">Try: ST-48210937 · ST-48210802 · ST-48210411</p></div><div style="margin-top:14px">${sh ? view(sh) : `<p class="dm-empty">No shipment found for “${esc(app.s.q)}”.</p>`}</div>`;
        },
        all(app) { return table(['Tracking no.', 'Route', 'Service', 'Status', 'ETA'], app.s.s.map((s) => `<tr class="click" tabindex="0" data-act="tOpen" data-no="${s.no}"><td class="num">${s.no}</td><td>${s.from} → ${s.to}</td><td>${s.svc}</td><td>${stPill(s.st)}</td><td>${fmtD(s.eta)}</td></tr>`).join('')); },
        new() {
          return `<div class="dm-panel" style="max-width:560px"><h3>New shipment</h3><div class="dm-toolbar" style="margin:0 0 12px">${field('From', `<select class="dm-select" id="nF">${cities.map((c) => `<option>${c}</option>`).join('')}</select>`)}${field('To', `<select class="dm-select" id="nT">${cities.map((c, i) => `<option ${i === 2 ? 'selected' : ''}>${c}</option>`).join('')}</select>`)}</div>${field('Weight (kg)', '<input class="dm-input" id="nW" type="number" value="3" min="1">')}${field('Service', '<select class="dm-select" id="nS"><option>Express</option><option>Standard</option></select>')}${btn('tNew', ic('plus') + ' Create & print label', '', 'pri')}</div>`;
        },
        ins(app) {
          const s = app.s.s, d = s.filter((x) => x.st === 4).length;
          return `<div class="dm-kpis">${kpi('truck', s.filter((x) => x.st > 0 && x.st < 4).length, 'In transit')}${kpi('check', d, 'Delivered', 'g')}${kpi('clock', '96.4%', 'On-time delivery')}${kpi('pkg', s.length, 'Shipments this week')}</div><div class="dm-cols-2"><div class="dm-panel"><h3>Shipments by origin</h3>${bars(cities.slice(0, 6).map((c) => ({ l: c, v: s.filter((x) => x.from === c).length + 3 })), true)}</div><div class="dm-panel"><h3>Delivery time (days)</h3>${line([3.4, 3.1, 3.3, 2.9, 2.7, 2.8, 2.5], '#0e7490', ['Mon', '', '', 'Thu', '', '', 'Sun'])}</div></div>`;
        }
      },
      acts: {
        tGo(app) { app.s.q = app.$('#tQ').value; app.render(); },
        tOpen(app, el) {
          const s = app.s.s.find((x) => x.no === el.dataset.no);
          app.drawer(s.no, view(s) + `<div class="x-field" style="margin-top:12px"><span>Update status</span><select class="dm-select" data-ch="tSet" data-no="${s.no}">${STEPS.map((t, i) => `<option value="${i}" ${s.st === i ? 'selected' : ''}>${t}</option>`).join('')}</select></div>`);
        },
        tSet(app, el) { app.s.s.find((x) => x.no === el.dataset.no).st = +el.value; app.toast('Status updated'); app.render(); },
        tNew(app) { const f = app.$('#nF').value, t = app.$('#nT').value; if (f === t) { app.toast('Origin and destination must differ'); return; } const no = 'ST-' + app.s.next++; app.s.s.unshift({ no, from: f, to: t, st: 0, svc: app.$('#nS').value, kg: +app.$('#nW').value || 1, eta: addDays(TODAY, 3), cust: 'You' }); app.s.q = no; app.go('trk'); app.toast('Shipment ' + no + ' created'); },
        closeDrawer(app) { app.closeDrawer(); }
      }
    };
  });

  /* =========================================================
     4) Azure Stay — villa booking website
     ========================================================= */
  D.register('stay', () => {
    const V = [{ id: 1, n: 'Azure Bay Villa', loc: 'Beachfront', city: 'Bodrum', rate: 340, bed: 4, g: 8, r: 4.9, e: '🏖️', bg: 'linear-gradient(135deg,#38bdf8,#0ea5e9)' }, { id: 2, n: 'Olive Grove Retreat', loc: 'Countryside', city: 'Tuscany', rate: 260, bed: 3, g: 6, r: 4.8, e: '🫒', bg: 'linear-gradient(135deg,#a3e635,#65a30d)' }, { id: 3, n: 'Skyline Penthouse', loc: 'City', city: 'Dubai', rate: 420, bed: 2, g: 4, r: 4.7, e: '🌆', bg: 'linear-gradient(135deg,#818cf8,#4f46e5)' }, { id: 4, n: 'Alpine Chalet', loc: 'Mountain', city: 'Zermatt', rate: 390, bed: 5, g: 10, r: 4.9, e: '🏔️', bg: 'linear-gradient(135deg,#cbd5e1,#64748b)' }, { id: 5, n: 'Sunset Cove House', loc: 'Beachfront', city: 'Algarve', rate: 230, bed: 3, g: 6, r: 4.6, e: '🌅', bg: 'linear-gradient(135deg,#fb923c,#e11d48)' }, { id: 6, n: 'Old Town Loft', loc: 'City', city: 'Lisbon', rate: 150, bed: 1, g: 2, r: 4.8, e: '🏙️', bg: 'linear-gradient(135deg,#fbbf24,#d97706)' }];
    const ymd = (d) => d.toISOString().slice(0, 10);
    const nights = (a, b) => Math.max(0, Math.round((new Date(b) - new Date(a)) / 864e5));
    const price = (v, n) => { const sub = v.rate * n, clean = 60, tax = Math.round((sub + clean) * 0.12 * 100) / 100; return { sub, clean, tax, total: sub + clean + tax }; };
    const res = () => [{ id: 'AZ-1041', v: 1, g: 'Hannah Moore', a: addDays(TODAY, 2), n: 4, st: 'confirmed' }, { id: 'AZ-1042', v: 3, g: 'Marco Bianchi', a: addDays(TODAY, 5), n: 3, st: 'confirmed' }, { id: 'AZ-1043', v: 4, g: 'Emily Carter', a: addDays(TODAY, 1), n: 6, st: 'pending' }, { id: 'AZ-1044', v: 2, g: 'Khaled Aziz', a: addDays(TODAY, 8), n: 5, st: 'confirmed' }, { id: 'AZ-1045', v: 5, g: 'Julia Novak', a: addDays(TODAY, 0), n: 2, st: 'confirmed' }];
    const busy = (s, v, d) => s.r.some((x) => x.v === v && x.st !== 'cancelled' && d >= x.a.getTime() && d < addDays(x.a, x.n).getTime());
    return {
      forceEn: true, name: 'Azure Stay', sub: 'Villa booking', cls: 'x-stay', mark: 'A',
      nav: [{ id: 'stays', icon: 'home', label: 'Find a stay' }, { id: 'book', icon: 'calendar', label: 'Book' }, { id: 'res', icon: 'list', label: 'Reservations' }, { id: 'cal', icon: 'chart', label: 'Occupancy' }],
      state: () => ({ f: 'All', guests: 2, r: res(), pick: 1, a: ymd(addDays(TODAY, 10)), b: ymd(addDays(TODAY, 14)), next: 1046 }),
      views: {
        stays(app) {
          const list = V.filter((v) => (app.s.f === 'All' || v.loc === app.s.f) && v.g >= app.s.guests);
          return `<div class="dm-toolbar"><div class="dm-tabs" role="tablist" style="margin:0">${['All', 'Beachfront', 'City', 'Mountain', 'Countryside'].map((f) => `<button type="button" role="tab" class="${app.s.f === f ? 'on' : ''}" data-act="sFilter" data-f="${f}">${f}</button>`).join('')}</div><select class="dm-select" data-ch="sGuests" aria-label="Guests">${[1, 2, 4, 6, 8].map((n) => `<option value="${n}" ${app.s.guests === n ? 'selected' : ''}>${n}+ guests</option>`).join('')}</select></div>
            <div class="x-villas">${list.map((v) => `<article class="x-villa"><div class="x-vimg" style="background:${v.bg}">${v.e}</div><div class="x-vbody"><div class="x-vt"><b>${v.n}</b><span>★ ${v.r}</span></div><small>${v.city} · ${v.bed} bedrooms · up to ${v.g} guests</small><div class="x-vp"><b class="num">${usd(v.rate)}</b> / night ${btn('sBook', 'Book now', `data-id="${v.id}"`, 'pri sm')}</div></div></article>`).join('') || '<p class="dm-empty">No stays match your filters.</p>'}</div>`;
        },
        book(app) {
          const v = V.find((x) => x.id === app.s.pick), n = nights(app.s.a, app.s.b), p = price(v, n);
          return `<div class="dm-cols"><div class="dm-panel"><h3>Reserve your stay</h3>${field('Villa', `<select class="dm-select" data-ch="sPick">${V.map((x) => `<option value="${x.id}" ${x.id === v.id ? 'selected' : ''}>${x.n} — ${x.city}</option>`).join('')}</select>`)}<div class="dm-toolbar" style="margin:0 0 12px">${field('Check-in', `<input class="dm-input" type="date" value="${app.s.a}" data-in="sA">`)}${field('Check-out', `<input class="dm-input" type="date" value="${app.s.b}" data-in="sB">`)}</div>${field('Guest name', '<input class="dm-input" id="sG" placeholder="Full name">')}${btn('sReserve', ic('check') + ' Confirm reservation', n > 0 ? '' : 'disabled', 'gold')}</div>
            <div class="dm-panel" id="sSum"><h3>Price details</h3>${sum(v, n, p)}</div></div>`;
        },
        res(app) { return table(['Ref', 'Villa', 'Guest', 'Arrival', 'Nights', 'Status', ''], app.s.r.map((x) => `<tr><td class="num">${x.id}</td><td>${V.find((v) => v.id === x.v).n}</td><td>${esc(x.g)}</td><td>${fmtD(x.a)}</td><td class="num">${x.n}</td><td>${pill(x.st === 'confirmed' ? 'p5' : x.st === 'pending' ? 'p2' : 'pr', x.st[0].toUpperCase() + x.st.slice(1))}</td><td>${x.st === 'pending' ? btn('sConfirm', 'Confirm', `data-id="${x.id}"`, 'ok sm') : ''}${x.st !== 'cancelled' ? btn('sCancel', 'Cancel', `data-id="${x.id}"`, 'sm') : ''}</td></tr>`).join('')); },
        cal(app) {
          const days = Array.from({ length: 14 }, (_, i) => addDays(TODAY, i));
          return `<div class="dm-table-wrap"><table class="dm-table x-cal"><thead><tr><th>Villa</th>${days.map((d) => `<th>${d.getDate()}</th>`).join('')}</tr></thead><tbody>${V.map((v) => `<tr><td>${v.n}</td>${days.map((d) => `<td class="${busy(app.s, v.id, d.getTime()) ? 'busy' : 'free'}"></td>`).join('')}</tr>`).join('')}</tbody></table></div><p class="dm-caption">Next 14 days · <span class="x-dot busy"></span> booked <span class="x-dot free"></span> available</p>`;
        }
      },
      acts: {
        sFilter(app, el) { app.s.f = el.dataset.f; app.render(); },
        sGuests(app, el) { app.s.guests = +el.value; app.render(); },
        sBook(app, el) { app.s.pick = +el.dataset.id; app.go('book'); },
        sPick(app, el) { app.s.pick = +el.value; app.render(); },
        sA(app, el) { app.s.a = el.value; upd(app); }, sB(app, el) { app.s.b = el.value; upd(app); },
        sReserve(app) {
          const g = app.$('#sG').value.trim(); if (!g) { app.toast('Enter the guest name'); return; }
          const v = V.find((x) => x.id === app.s.pick), n = nights(app.s.a, app.s.b), id = 'AZ-' + app.s.next++;
          app.s.r.unshift({ id, v: v.id, g, a: new Date(app.s.a + 'T00:00:00'), n, st: 'pending' }); app.go('res'); app.drawer('Reservation received', `<p>Reference <b>${id}</b></p><p>${v.n} · ${n} nights · <b class="num">${usd(price(v, n).total)}</b></p><p class="dm-caption">Status: pending host confirmation.</p>`);
        },
        sConfirm(app, el) { app.s.r.find((x) => x.id === el.dataset.id).st = 'confirmed'; app.render(); app.toast('Reservation confirmed'); },
        sCancel(app, el) { app.s.r.find((x) => x.id === el.dataset.id).st = 'cancelled'; app.render(); },
        closeDrawer(app) { app.closeDrawer(); }
      }
    };
    function sum(v, n, p) { return n > 0 ? `<div class="x-sum"><div><span>${usd(v.rate)} × ${n} nights</span><b class="num">${usd(p.sub)}</b></div><div><span>Cleaning fee</span><b class="num">${usd(p.clean)}</b></div><div><span>Taxes (12%)</span><b class="num">${usd(p.tax)}</b></div><div class="x-total"><span>Total</span><b class="num">${usd(p.total)}</b></div></div>` : '<p class="dm-empty">Choose valid dates to see the price.</p>'; }
    function upd(app) { const v = V.find((x) => x.id === app.s.pick), n = nights(app.s.a, app.s.b); app.$('#sSum').innerHTML = '<h3>Price details</h3>' + sum(v, n, price(v, n)); const b = app.$('[data-act="sReserve"]'); if (b) b.disabled = !(n > 0); }
  });

  /* =========================================================
     5) FreshCart — grocery delivery app (phone)
     ========================================================= */
  D.register('fresh', () => {
    const cats = [{ id: 'fruit', n: 'Fruit', e: '🍎' }, { id: 'veg', n: 'Veg', e: '🥦' }, { id: 'dairy', n: 'Dairy', e: '🧀' }, { id: 'bake', n: 'Bakery', e: '🥐' }, { id: 'drink', n: 'Drinks', e: '🧃' }];
    const P = [[1, 'fruit', 'Gala Apples', '1 kg', 3.2, '🍎'], [2, 'fruit', 'Bananas', '6 pcs', 1.9, '🍌'], [3, 'fruit', 'Strawberries', '400 g', 4.5, '🍓'], [4, 'veg', 'Broccoli', '1 head', 1.8, '🥦'], [5, 'veg', 'Cherry Tomatoes', '250 g', 2.4, '🍅'], [6, 'veg', 'Avocados', '2 pcs', 3.0, '🥑'], [7, 'dairy', 'Greek Yoghurt', '500 g', 3.1, '🥣'], [8, 'dairy', 'Cheddar', '200 g', 3.8, '🧀'], [9, 'dairy', 'Free-range Eggs', '12 pcs', 4.2, '🥚'], [10, 'bake', 'Sourdough Loaf', '800 g', 4.0, '🍞'], [11, 'bake', 'Croissants', '4 pcs', 3.5, '🥐'], [12, 'drink', 'Orange Juice', '1 L', 2.9, '🧃'], [13, 'drink', 'Sparkling Water', '6 × 500 ml', 3.3, '💧']].map((p) => ({ id: p[0], c: p[1], n: p[2], u: p[3], p: p[4], e: p[5] }));
    const STG = ['Order placed', 'Packing your items', 'Out for delivery', 'Delivered'];
    const tot = (s) => { const sub = Object.keys(s.cart).reduce((a, id) => a + P.find((x) => x.id === +id).p * s.cart[id], 0); const fee = sub === 0 || sub >= 40 ? 0 : 4.99; return { sub, fee, total: sub + fee, qty: Object.values(s.cart).reduce((a, b) => a + b, 0) }; };
    return {
      forceEn: true, phone: true, name: 'FreshCart', logo: 'F', cls: 'x-fresh',
      nav: [{ id: 'shop', icon: 'store', label: 'Shop' }, { id: 'cart', icon: 'cart', label: 'Cart' }, { id: 'orders', icon: 'receipt', label: 'Orders' }, { id: 'me', icon: 'user', label: 'Account' }],
      state: () => ({ cat: 'fruit', cart: {}, slot: 'Today, 6–8 PM', active: null, next: 7410 }),
      views: {
        shop(app) {
          const s = app.s, t = tot(s);
          return `<div class="x-addr">${ic('map')}<span><small>Deliver to</small><b>221 Baker Street, London</b></span></div><div class="x-promo-b">Free delivery over $40 🚚</div><div class="x-chips">${cats.map((c) => `<button type="button" class="${s.cat === c.id ? 'on' : ''}" data-act="fCat" data-id="${c.id}"><span>${c.e}</span>${c.n}</button>`).join('')}</div>
            <div class="x-grocs">${P.filter((p) => p.c === s.cat).map((p) => `<div class="x-groc"><span class="x-gi">${p.e}</span><b>${p.n}</b><small>${p.u}</small><div><em class="num">${usd(p.p)}</em>${s.cart[p.id] ? `<span class="x-qty"><button type="button" data-act="fQty" data-id="${p.id}" data-d="-1">−</button><b>${s.cart[p.id]}</b><button type="button" data-act="fQty" data-id="${p.id}" data-d="1">+</button></span>` : btn('fAdd', ic('plus'), `data-id="${p.id}" aria-label="Add"`, 'pri sm')}</div></div>`).join('')}</div>
            ${t.qty ? `<button type="button" class="x-bar" data-view="cart">${ic('cart')} ${t.qty} items <b class="num">${usd(t.sub)}</b></button>` : ''}`;
        },
        cart(app) {
          const s = app.s, t = tot(s), ids = Object.keys(s.cart);
          if (!ids.length) return '<p class="dm-empty">Your basket is empty.</p>';
          return `<ul class="x-lines">${ids.map((id) => { const p = P.find((x) => x.id === +id); return `<li><span class="x-dimg sm">${p.e}</span><span class="x-nm">${p.n}<small>${p.u} · ${usd(p.p)}</small></span><span class="x-qty"><button type="button" data-act="fQty" data-id="${id}" data-d="-1">−</button><b>${s.cart[id]}</b><button type="button" data-act="fQty" data-id="${id}" data-d="1">+</button></span></li>`; }).join('')}</ul>
            ${field('Delivery slot', `<select class="dm-select" data-ch="fSlot">${['Today, 6–8 PM', 'Today, 8–10 PM', 'Tomorrow, 8–10 AM', 'Tomorrow, 12–2 PM'].map((x) => `<option ${s.slot === x ? 'selected' : ''}>${x}</option>`).join('')}</select>`)}
            <div class="x-sum"><div><span>Subtotal</span><b class="num">${usd(t.sub)}</b></div><div><span>Delivery</span><b class="num">${t.fee ? usd(t.fee) : 'Free'}</b></div><div class="x-total"><span>Total</span><b class="num">${usd(t.total)}</b></div></div><button type="button" class="dm-btn gold x-pay" data-act="fOrder">Place order</button>`;
        },
        orders(app) {
          const a = app.s.active;
          return a ? `<div class="dm-panel"><h3>Order #${a.no} <small>${a.slot}</small></h3><ol class="x-track">${STG.map((st, i) => `<li class="${i <= a.stage ? 'on' : ''} ${i === a.stage ? 'cur' : ''}"><span>${i < a.stage || a.stage === 3 ? '✓' : i + 1}</span>${st}</li>`).join('')}</ol><p class="dm-caption">${a.stage === 3 ? 'Enjoy your groceries! 🎉' : 'Estimated arrival: 35 minutes'}</p></div>` : '<p class="dm-empty">No active orders. Start shopping!</p>';
        },
        me() { return `<div class="x-prof"><span class="dm-avatar x-av lg">A</span><b>Alex Morgan</b><small>alex@example.com</small></div><ul class="x-hist"><li><span><b>Address</b><small>221 Baker Street, London</small></span></li><li><span><b>Payment</b><small>Visa •••• 4242</small></span></li><li><span><b>Delivery pass</b><small>Active — free delivery over $25</small></span></li></ul>`; }
      },
      acts: {
        fCat(app, el) { app.s.cat = el.dataset.id; app.render(); },
        fAdd(app, el) { const id = el.dataset.id; app.s.cart[id] = (app.s.cart[id] || 0) + 1; app.render(); },
        fQty(app, el) { const id = el.dataset.id; app.s.cart[id] += +el.dataset.d; if (app.s.cart[id] <= 0) delete app.s.cart[id]; app.render(); },
        fSlot(app, el) { app.s.slot = el.value; },
        fOrder(app) {
          const s = app.s; s.active = { no: s.next++, slot: s.slot, stage: 0 }; s.cart = {}; app.go('orders'); app.toast('Order placed — thank you!'); clearInterval(app._rt);
          app._rt = setInterval(() => { if (!app.root || !app.root.isConnected || !s.active) { clearInterval(app._rt); return; } if (s.active.stage < 3) { s.active.stage++; if (app.view === 'orders') app.render(); } else clearInterval(app._rt); }, 3500);
        },
        closeDrawer(app) { app.closeDrawer(); }
      }
    };
  });

  /* =========================================================
     6) IronPulse Gym — membership & classes
     ========================================================= */
  D.register('gym', () => {
    const PL = { Basic: 29, Plus: 49, Elite: 89 };
    const members = () => { const r = rng(5), names = ['James Walker', 'Sophie Turner', 'Ryan Cooper', 'Mia Patel', 'Ethan Brooks', 'Isla Murray', 'Noah Bennett', 'Ava Collins', 'Liam Foster', 'Zoe Hamilton', 'Owen Price', 'Ella Reed']; return names.map((n, i) => ({ id: 1042 + i, n, plan: ['Basic', 'Plus', 'Elite'][i % 3], exp: addDays(TODAY, [-3, 12, 40, 6, 85, 22, -10, 58, 14, 120, 3, 71][i]), visits: 8 + Math.floor(r() * 20) })); };
    const classes = [['Mon', '07:00', 'HIIT Blast', 'Coach Dana', 18], ['Mon', '18:30', 'Yoga Flow', 'Coach Leo', 15], ['Tue', '12:15', 'Spin 45', 'Coach Maya', 20], ['Wed', '07:00', 'Strength Lab', 'Coach Ben', 14], ['Wed', '19:00', 'Boxing Fit', 'Coach Dana', 16], ['Thu', '18:30', 'Pilates', 'Coach Leo', 14], ['Fri', '07:00', 'HIIT Blast', 'Coach Maya', 18], ['Sat', '10:00', 'Group Spin', 'Coach Ben', 22]].map((c, i) => ({ id: i + 1, d: c[0], t: c[1], n: c[2], co: c[3], cap: c[4], booked: Math.floor(c[4] * (0.45 + (i % 4) * 0.13)) }));
    const active = (m) => m.exp >= TODAY;
    return {
      forceEn: true, name: 'IronPulse Gym', sub: 'Membership & classes', cls: 'x-gym', mark: 'I',
      nav: [{ id: 'dash', icon: 'dash', label: 'Dashboard' }, { id: 'mem', icon: 'users', label: 'Members' }, { id: 'cls', icon: 'calendar', label: 'Classes' }, { id: 'chk', icon: 'scan', label: 'Check-in' }],
      state: () => ({ m: members(), c: classes, q: '', log: [] }),
      views: {
        dash(app) {
          const m = app.s.m, act = m.filter(active), soon = m.filter((x) => active(x) && x.exp < addDays(TODAY, 15));
          return `<div class="dm-kpis">${kpi('users', act.length, 'Active members')}${kpi('check', 142 + app.s.log.length, 'Check-ins today', 'g')}${kpi('cash', usd(act.reduce((a, x) => a + PL[x.plan], 0) * 12.4), 'Revenue (MTD)')}${kpi('clock', soon.length, 'Expiring in 15 days', 'r')}</div>
            <div class="dm-cols"><div class="dm-panel"><h3>Check-ins by hour</h3>${bars([{ l: '06–08', v: 38 }, { l: '08–10', v: 24 }, { l: '12–14', v: 31 }, { l: '17–19', v: 86 }, { l: '19–21', v: 64 }], true)}</div><div class="dm-panel"><h3>Renewals due</h3><ul class="x-alerts">${soon.map((x) => `<li><span>${x.n}<small>${x.plan} · expires ${fmtD(x.exp)}</small></span>${btn('gRenew', 'Renew', `data-id="${x.id}"`, 'sm pri')}</li>`).join('') || '<p class="dm-empty">Nothing due.</p>'}</ul></div></div>`;
        },
        mem(app) {
          const q = norm(app.s.q), list = app.s.m.filter((x) => !q || norm(x.n).includes(q) || String(x.id).includes(q));
          return `<div class="dm-toolbar"><div class="dm-search">${ic('search')}<input class="dm-input" data-in="gSearch" value="${esc(app.s.q)}" placeholder="Search by name or member ID…"></div></div><div id="gBody">${mtable(list, q)}</div>`;
        },
        cls(app) {
          return `<div class="x-classes">${app.s.c.map((c) => `<div class="dm-panel x-class"><div><b>${c.n}</b><small>${c.d} · ${c.t} · ${c.co}</small></div><div class="x-cap"><span class="dm-bar"><span class="track"><span class="fill ${c.booked >= c.cap ? 'g' : ''}" style="width:${Math.round((c.booked / c.cap) * 100)}%"></span></span></span><small>${c.booked}/${c.cap} booked</small></div>${btn('gBook', c.booked >= c.cap ? 'Join waitlist' : 'Book a spot', `data-id="${c.id}"`, c.booked >= c.cap ? 'sm' : 'sm pri')}</div>`).join('')}</div>`;
        },
        chk(app) {
          return `<div class="dm-panel" style="max-width:520px"><h3>Member check-in</h3><div class="dm-toolbar" style="margin:0"><input class="dm-input" id="gId" placeholder="Member ID, e.g. 1042" style="flex:1">${btn('gCheck', ic('scan') + ' Check in', '', 'pri')}</div><p class="dm-caption">Try 1042 (expired), 1043 (active), 1048 (expired)</p><div id="gRes"></div></div><div class="dm-panel" style="margin-top:14px"><h3>Today’s log</h3>${app.s.log.length ? `<ul class="x-alerts">${app.s.log.map((l) => `<li><span>${l.n}<small>${l.t} · ${l.ok ? 'Welcome in' : 'Denied — membership expired'}</small></span>${pill(l.ok ? 'p5' : 'pr', l.ok ? 'OK' : 'Denied')}</li>`).join('')}</ul>` : '<p class="dm-empty">No check-ins yet.</p>'}</div>`;
        }
      },
      acts: {
        gRenew(app, el) { const m = app.s.m.find((x) => x.id === +el.dataset.id); m.exp = addDays(m.exp > TODAY ? m.exp : TODAY, 30); app.render(); app.toast('Renewed for 30 days'); },
        gSearch(app, el) { app.s.q = el.value; const q = norm(app.s.q); app.$('#gBody').innerHTML = mtable(app.s.m.filter((x) => !q || norm(x.n).includes(q) || String(x.id).includes(q)), q); },
        gOpen(app, el) { const m = app.s.m.find((x) => x.id === +el.dataset.id); app.drawer(esc(m.n), `<p>ID <b>${m.id}</b> · ${pill('p0', m.plan)} ${active(m) ? pill('p5', 'Active') : pill('pr', 'Expired')}</p><p>Expires ${fmtD(m.exp)} · ${m.visits} visits this month</p><div class="dm-actions">${btn('gRenew', 'Renew 30 days', `data-id="${m.id}"`, 'pri')}</div>`); },
        gBook(app, el) { const c = app.s.c.find((x) => x.id === +el.dataset.id); if (c.booked < c.cap) { c.booked++; app.toast('Spot booked for ' + c.n); } else app.toast('Added to the waitlist'); app.render(); },
        gCheck(app) {
          const id = +app.$('#gId').value, m = app.s.m.find((x) => x.id === id), box = app.$('#gRes');
          if (!m) { box.innerHTML = '<p class="dm-empty">No member with that ID.</p>'; return; }
          const ok = active(m); app.s.log.unshift({ n: m.n, ok, t: pad(new Date().getHours()) + ':' + pad(new Date().getMinutes()) });
          box.innerHTML = `<div class="x-chk ${ok ? 'ok' : 'bad'}"><b>${ok ? '✓ Welcome, ' + m.n.split(' ')[0] + '!' : '✕ Membership expired'}</b><span>${m.plan} · ${ok ? 'valid until ' + fmtD(m.exp) : 'expired ' + fmtD(m.exp)}</span></div>`;
        },
        closeDrawer(app) { app.closeDrawer(); }
      }
    };
    function mtable(list, q) { return table(['ID', 'Member', 'Plan', 'Expires', 'Status'], list.map((m) => `<tr class="click" tabindex="0" data-act="gOpen" data-id="${m.id}"><td class="num">${m.id}</td><td>${hl(m.n, q)}</td><td>${m.plan}</td><td>${fmtD(m.exp)}</td><td>${active(m) ? pill('p5', 'Active') : pill('pr', 'Expired')}</td></tr>`).join('') || emptyRow(5)); }
  });
})();
