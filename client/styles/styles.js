/** styles.js – Global CSS Design System for College Dispensary Portal */
const DispensaryStyles = () => {
  React.useEffect(() => {
    const id = 'dispensary-design-system';
    if (document.getElementById(id)) return;
    const style = document.createElement('style');
    style.id = id;
    style.textContent = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,300&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  /* ── Brand Greens ── */
  --g-50:  #F0F9F0;
  --g-100: #DCEFDC;
  --g-200: #B8DDB8;
  --g-300: #85C285;
  --g-400: #5AA85A;
  --g-500: #3D8F3D;
  --g-600: #2E7330;
  --g-700: #1F5621;
  --g-800: #143A16;

  /* ── Olive accents ── */
  --ol-50:  #F7F7F0;
  --ol-100: #ECEEE0;
  --ol-200: #D5D8B8;
  --ol-400: #9FA468;
  --ol-600: #6B7042;

  /* ── Neutrals ── */
  --n-0:   #FFFFFF;
  --n-50:  #FAFAF8;
  --n-100: #F4F4F0;
  --n-200: #E8E8E0;
  --n-300: #D4D4C8;
  --n-400: #A8A89C;
  --n-500: #737368;
  --n-600: #525248;
  --n-700: #3C3C34;
  --n-800: #262620;
  --n-900: #16160E;

  /* ── Semantic ── */
  --red-50:    #FEF2F2; --red-200: #FECACA; --red-400: #F87171; --red-600: #DC2626; --red-700: #B91C1C;
  --amber-50:  #FFFBEB; --amber-200: #FDE68A; --amber-400: #FBBF24; --amber-600: #D97706; --amber-700: #B45309;
  --blue-50:   #EFF6FF; --blue-200: #BFDBFE; --blue-400: #60A5FA; --blue-600: #2563EB;
  --violet-50: #F5F3FF; --violet-200: #DDD6FE; --violet-600: #7C3AED;

  /* ── Layout ── */
  --sidebar-w: 252px;
  --header-h:  68px;
  --r-sm:  6px;
  --r-md:  10px;
  --r-lg:  16px;
  --r-xl:  22px;
  --r-2xl: 28px;

  /* ── Shadows ── */
  --sh-xs: 0 1px 2px rgba(0,0,0,.05);
  --sh-sm: 0 1px 3px rgba(0,0,0,.07), 0 1px 2px rgba(0,0,0,.05);
  --sh-md: 0 4px 8px -2px rgba(0,0,0,.08), 0 2px 4px -2px rgba(0,0,0,.06);
  --sh-lg: 0 12px 20px -4px rgba(0,0,0,.08), 0 4px 8px -4px rgba(0,0,0,.05);

  --font-sans:  'DM Sans', system-ui, sans-serif;
  --font-serif: 'Fraunces', Georgia, serif;
}

html, body {
  font-family: var(--font-sans);
  background: var(--n-50);
  color: var(--n-800);
  font-size: 15px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* ── Scrollbar ── */
::-webkit-scrollbar { width: 5px; height: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--n-300); border-radius: 999px; }
::-webkit-scrollbar-thumb:hover { background: var(--n-400); }

/* ═══════════ APP SHELL ═══════════ */
.app-shell { display: flex; min-height: 100vh; background: var(--n-50); }

/* ═══════════ SIDEBAR ═══════════ */
.ds-sidebar {
  width: var(--sidebar-w);
  min-height: 100vh;
  background: var(--n-0);
  border-right: 1px solid var(--n-200);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0; left: 0;
  z-index: 100;
  transition: transform .25s cubic-bezier(.4,0,.2,1);
}
.ds-sidebar-logo {
  padding: 22px 20px 18px;
  border-bottom: 1px solid var(--n-100);
}
.ds-logo-mark {
  display: flex; align-items: center; gap: 11px;
}
.ds-logo-icon {
  width: 38px; height: 38px;
  background: linear-gradient(135deg, var(--g-600), var(--g-500));
  border-radius: var(--r-md);
  display: flex; align-items: center; justify-content: center;
  font-size: 19px; flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(46,115,48,.3);
}
.ds-logo-text { display: flex; flex-direction: column; gap: 1px; }
.ds-logo-name { font-size: 14px; font-weight: 600; color: var(--n-800); letter-spacing: -.2px; }
.ds-logo-sub  { font-size: 10.5px; color: var(--n-400); letter-spacing: .5px; text-transform: uppercase; }

.ds-nav { padding: 12px 10px; flex: 1; overflow-y: auto; }
.ds-nav-section { font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--n-400); padding: 12px 10px 4px; }

.ds-nav-item {
  display: flex; align-items: center; gap: 10px;
  padding: 9px 10px; border-radius: var(--r-md);
  cursor: pointer; color: var(--n-500); font-size: 14px; font-weight: 500;
  transition: all .15s ease;
  margin-bottom: 1px;
  border: none; background: none; width: 100%; text-align: left;
  font-family: var(--font-sans);
}
.ds-nav-item:hover { background: var(--g-50); color: var(--g-600); }
.ds-nav-item.active { background: var(--g-50); color: var(--g-700); font-weight: 600; }
.ds-nav-item-icon {
  width: 30px; height: 30px; border-radius: var(--r-sm);
  background: var(--n-100); display: flex; align-items: center; justify-content: center;
  font-size: 14px; flex-shrink: 0; transition: background .15s;
}
.ds-nav-item.active .ds-nav-item-icon { background: var(--g-100); }
.ds-nav-item:hover .ds-nav-item-icon { background: var(--g-100); }
.ds-nav-item-badge {
  margin-left: auto;
  min-width: 19px; height: 19px; padding: 0 6px;
  background: var(--amber-400); color: #fff;
  border-radius: 999px; font-size: 10.5px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
}

.ds-sidebar-footer {
  padding: 14px 10px;
  border-top: 1px solid var(--n-100);
}
.ds-user-tile {
  display: flex; align-items: center; gap: 10px;
  padding: 9px 10px; border-radius: var(--r-md);
  background: var(--n-50);
}
.ds-avatar {
  width: 34px; height: 34px; border-radius: 50%;
  background: var(--g-100); color: var(--g-700);
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 13px; flex-shrink: 0;
}
.ds-user-name { font-size: 13px; font-weight: 600; color: var(--n-800); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ds-user-role { font-size: 11px; color: var(--n-400); text-transform: capitalize; }
.ds-logout-btn {
  margin-left: auto; padding: 6px; border-radius: var(--r-sm);
  border: none; background: none; cursor: pointer;
  color: var(--n-400); font-size: 15px; transition: all .15s;
  font-family: var(--font-sans);
}
.ds-logout-btn:hover { background: var(--red-50); color: var(--red-600); }

/* ═══════════ MAIN STAGE ═══════════ */
.ds-main { margin-left: var(--sidebar-w); flex: 1; display: flex; flex-direction: column; min-height: 100vh; }

.ds-topbar {
  height: var(--header-h);
  padding: 0 32px;
  background: var(--n-0);
  border-bottom: 1px solid var(--n-200);
  display: flex; align-items: center; justify-content: space-between;
  position: sticky; top: 0; z-index: 50;
}
.ds-topbar-left h1 { font-size: 17px; font-weight: 600; color: var(--n-800); letter-spacing: -.3px; }
.ds-topbar-left p  { font-size: 12.5px; color: var(--n-400); margin-top: 1px; }
.ds-topbar-right { display: flex; align-items: center; gap: 10px; }

.ds-content { padding: 28px 32px; flex: 1; }

.ds-page-head { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; }
.ds-page-title { font-size: 20px; font-weight: 600; color: var(--n-800); letter-spacing: -.4px; }
.ds-page-sub   { font-size: 13.5px; color: var(--n-400); margin-top: 3px; }

/* ═══════════ STAT TILES ═══════════ */
.ds-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(155px,1fr)); gap: 14px; margin-bottom: 24px; }
.ds-stat {
  background: var(--n-0); border: 1px solid var(--n-200);
  border-radius: var(--r-lg); padding: 18px 20px;
  box-shadow: var(--sh-xs); transition: box-shadow .2s, transform .2s;
}
.ds-stat:hover { box-shadow: var(--sh-md); transform: translateY(-1px); }
.ds-stat-icon {
  width: 38px; height: 38px; border-radius: var(--r-md);
  display: flex; align-items: center; justify-content: center;
  font-size: 17px; margin-bottom: 12px;
}
.ds-stat-val  { font-size: 26px; font-weight: 600; color: var(--n-800); letter-spacing: -.5px; line-height: 1; }
.ds-stat-lbl  { font-size: 12px; color: var(--n-400); margin-top: 5px; font-weight: 500; }
.ds-stat-green  { background: var(--g-50);     color: var(--g-600);  border-left: 3px solid var(--g-400); }
.ds-stat-amber  { background: var(--amber-50); color: var(--amber-600); border-left: 3px solid var(--amber-400); }
.ds-stat-red    { background: var(--red-50);   color: var(--red-600);   border-left: 3px solid var(--red-400); }
.ds-stat-blue   { background: var(--blue-50);  color: var(--blue-600);  border-left: 3px solid var(--blue-400); }
.ds-stat-violet { background: var(--violet-50);color: var(--violet-600);border-left: 3px solid var(--violet-200); }
.ds-stat-olive  { background: var(--ol-50);    color: var(--ol-600);    border-left: 3px solid var(--ol-200); }

/* ═══════════ CARD ═══════════ */
.ds-card {
  background: var(--n-0); border: 1px solid var(--n-200);
  border-radius: var(--r-lg); box-shadow: var(--sh-xs); overflow: hidden;
}
.ds-card-header {
  padding: 16px 22px;
  border-bottom: 1px solid var(--n-100);
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
}
.ds-card-header-left { display: flex; align-items: center; gap: 12px; }
.ds-card-header-icon {
  width: 34px; height: 34px; border-radius: var(--r-sm);
  background: var(--g-50); color: var(--g-600);
  display: flex; align-items: center; justify-content: center; font-size: 16px;
}
.ds-card-title { font-size: 14.5px; font-weight: 600; color: var(--n-800); }
.ds-card-sub   { font-size: 12.5px; color: var(--n-400); margin-top: 1px; }
.ds-card-body  { padding: 22px; }

/* ═══════════ TABLE ═══════════ */
.ds-table-wrap { overflow-x: auto; }
table.ds-table { width: 100%; border-collapse: collapse; font-size: 14px; }
.ds-table thead tr { border-bottom: 1px solid var(--n-200); }
.ds-table th {
  padding: 10px 16px; text-align: left;
  font-size: 11px; font-weight: 700; color: var(--n-400);
  text-transform: uppercase; letter-spacing: .7px; white-space: nowrap;
}
.ds-table td { padding: 13px 16px; border-bottom: 1px solid var(--n-100); color: var(--n-700); vertical-align: middle; }
.ds-table tbody tr:last-child td { border-bottom: none; }
.ds-table tbody tr { transition: background .1s; }
.ds-table tbody tr:hover { background: var(--n-50); }
.ds-table .td-name { font-weight: 600; color: var(--n-800); }
.ds-table .td-muted { font-size: 12.5px; color: var(--n-400); }
.ds-table .td-mono  { font-size: 13px; font-variant-numeric: tabular-nums; }

/* ═══════════ BADGES ═══════════ */
.ds-badge {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 3px 10px; border-radius: 999px;
  font-size: 11.5px; font-weight: 600; letter-spacing: .1px; white-space: nowrap;
}
.ds-badge-green  { background: var(--g-50);     color: var(--g-700);     border: 1px solid var(--g-200); }
.ds-badge-amber  { background: var(--amber-50); color: var(--amber-700); border: 1px solid var(--amber-200); }
.ds-badge-red    { background: var(--red-50);   color: var(--red-700);   border: 1px solid var(--red-200); }
.ds-badge-blue   { background: var(--blue-50);  color: var(--blue-600);  border: 1px solid var(--blue-200); }
.ds-badge-gray   { background: var(--n-100);    color: var(--n-500);     border: 1px solid var(--n-300); }
.ds-badge-olive  { background: var(--ol-50);    color: var(--ol-600);    border: 1px solid var(--ol-200); }

/* ═══════════ BUTTONS ═══════════ */
.ds-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 6px;
  padding: 9px 18px; border-radius: var(--r-md);
  font-family: var(--font-sans); font-size: 14px; font-weight: 500;
  cursor: pointer; transition: all .15s ease;
  border: 1px solid transparent; line-height: 1; white-space: nowrap;
  letter-spacing: -.1px;
}
.ds-btn:disabled { opacity: .5; cursor: not-allowed; pointer-events: none; }
.ds-btn:active:not(:disabled) { transform: scale(.98); }

.ds-btn-primary  { background: var(--g-600); color: #fff; border-color: var(--g-600); }
.ds-btn-primary:hover  { background: var(--g-700); border-color: var(--g-700); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(46,115,48,.28); }

.ds-btn-secondary { background: var(--n-0); color: var(--g-700); border-color: var(--g-200); }
.ds-btn-secondary:hover { background: var(--g-50); border-color: var(--g-400); }

.ds-btn-danger  { background: var(--red-50); color: var(--red-700); border-color: var(--red-200); }
.ds-btn-danger:hover  { background: #FEE2E2; border-color: var(--red-400); }

.ds-btn-ghost   { background: transparent; color: var(--n-500); border-color: transparent; }
.ds-btn-ghost:hover   { background: var(--n-100); color: var(--n-800); }

.ds-btn-outline { background: var(--n-0); color: var(--n-600); border-color: var(--n-300); }
.ds-btn-outline:hover { background: var(--n-50); border-color: var(--n-400); }

.ds-btn-success { background: var(--g-50); color: var(--g-700); border-color: var(--g-200); }
.ds-btn-success:hover { background: var(--g-100); border-color: var(--g-400); }

.ds-btn-sm  { padding: 6px 13px; font-size: 12.5px; border-radius: var(--r-sm); gap: 4px; }
.ds-btn-xs  { padding: 4px 10px; font-size: 12px;   border-radius: var(--r-sm); }
.ds-btn-full { width: 100%; }
.ds-btn-icon { padding: 7px; border-radius: var(--r-md); }

/* ═══════════ FORM ═══════════ */
.ds-form-group { margin-bottom: 16px; }
.ds-label {
  display: block; font-size: 12.5px; font-weight: 600; color: var(--n-600);
  margin-bottom: 6px; letter-spacing: -.1px;
}
.ds-label .req { color: var(--red-600); margin-left: 2px; }

.ds-input {
  width: 100%; padding: 9px 13px;
  background: var(--n-0); border: 1px solid var(--n-300);
  border-radius: var(--r-md); font-family: var(--font-sans); font-size: 14px;
  color: var(--n-800); outline: none; transition: border-color .15s, box-shadow .15s;
}
.ds-input::placeholder { color: var(--n-400); }
.ds-input:hover:not(:focus) { border-color: var(--n-400); }
.ds-input:focus { border-color: var(--g-500); box-shadow: 0 0 0 3px rgba(61,143,61,.1); }
.ds-input.sm { padding: 6px 10px; font-size: 13px; }

select.ds-input {
  appearance: none; cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%23A8A89C'%3E%3Cpath fill-rule='evenodd' d='M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z'/%3E%3C/svg%3E");
  background-repeat: no-repeat; background-position: right 10px center; background-size: 18px;
  padding-right: 34px;
}

/* ═══════════ ALERTS ═══════════ */
.ds-alert {
  padding: 11px 15px; border-radius: var(--r-md);
  font-size: 13.5px; font-weight: 500; margin-bottom: 18px;
  display: flex; align-items: flex-start; gap: 9px;
  border: 1px solid transparent;
}
.ds-alert-success { background: var(--g-50);     color: var(--g-700);     border-color: var(--g-200); }
.ds-alert-error   { background: var(--red-50);   color: var(--red-700);   border-color: var(--red-200); }
.ds-alert-warning { background: var(--amber-50); color: var(--amber-700); border-color: var(--amber-200); }
.ds-alert-info    { background: var(--blue-50);  color: var(--blue-600);  border-color: var(--blue-200); }

/* ═══════════ LOADING ═══════════ */
.ds-spinner-wrap { padding: 60px; display: flex; align-items: center; justify-content: center; }
.ds-spinner {
  width: 30px; height: 30px; border: 2.5px solid var(--n-200);
  border-top-color: var(--g-500); border-radius: 50%;
  animation: ds-spin .65s linear infinite;
}
@keyframes ds-spin { to { transform: rotate(360deg); } }

.ds-empty {
  padding: 64px 32px; text-align: center;
  display: flex; flex-direction: column; align-items: center; gap: 10px;
}
.ds-empty-icon  { font-size: 36px; opacity: .4; }
.ds-empty-title { font-size: 15px; font-weight: 600; color: var(--n-700); }
.ds-empty-text  { font-size: 13px; color: var(--n-400); max-width: 280px; }

/* ═══════════ FILTER BAR ═══════════ */
.ds-filter-bar { display: flex; gap: 4px; background: var(--n-100); padding: 4px; border-radius: var(--r-md); }
.ds-filter-tab {
  padding: 5px 13px; border-radius: var(--r-sm);
  font-size: 13px; font-weight: 500; cursor: pointer;
  color: var(--n-500); border: none; background: none;
  font-family: var(--font-sans); transition: all .12s;
}
.ds-filter-tab.active { background: var(--n-0); color: var(--n-800); box-shadow: var(--sh-xs); }
.ds-filter-tab:not(.active):hover { color: var(--n-700); }

/* ═══════════ STATUS PILL (topbar) ═══════════ */
.ds-status-pill {
  padding: 4px 12px; border-radius: 999px; font-size: 11.5px; font-weight: 600;
  display: inline-flex; align-items: center; gap: 5px;
}
.ds-status-pill.green { background: var(--g-50); color: var(--g-700); border: 1px solid var(--g-200); }
.ds-status-pill::before { content: ''; width: 7px; height: 7px; border-radius: 50%; background: currentColor; opacity: .7; }

/* ═══════════ ADD FORM PANEL ═══════════ */
.ds-panel {
  background: var(--n-0); border: 1px solid var(--n-200);
  border-radius: var(--r-lg); overflow: hidden;
  margin-bottom: 20px; box-shadow: var(--sh-xs);
}
.ds-panel-head {
  padding: 14px 22px;
  background: var(--n-50);
  border-bottom: 1px solid var(--n-100);
  display: flex; align-items: center; gap: 10px;
}
.ds-panel-head h3 { font-size: 14.5px; font-weight: 600; color: var(--n-800); }
.ds-panel-body { padding: 22px; }

/* ═══════════ CHART CONTAINER ═══════════ */
.ds-chart { position: relative; height: 300px; }

/* ═══════════ DIVIDER ═══════════ */
.ds-divider { height: 1px; background: var(--n-100); margin: 20px 0; }

/* ═══════════ INLINE EDIT ═══════════ */
.ds-inline-input {
  padding: 5px 9px; font-size: 13px;
  border: 1.5px solid var(--g-400); border-radius: var(--r-sm);
  font-family: var(--font-sans); color: var(--n-800); outline: none;
  box-shadow: 0 0 0 3px rgba(61,143,61,.08);
}

/* ═══════════ AVATAR ═══════════ */
.ds-avatar-sm {
  width: 30px; height: 30px; border-radius: 50%;
  background: var(--g-100); color: var(--g-700);
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 12px; flex-shrink: 0;
}
.ds-avatar-md {
  width: 38px; height: 38px; border-radius: 50%;
  background: var(--g-100); color: var(--g-700);
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 15px; flex-shrink: 0;
}

/* ═══════════ WARN SECTION ═══════════ */
.ds-warn-section {
  border: 1px solid var(--amber-200);
  border-left: 3px solid var(--amber-400);
  border-radius: var(--r-lg);
  overflow: hidden;
  margin-top: 22px;
}
.ds-warn-head {
  padding: 14px 22px;
  background: var(--amber-50);
  border-bottom: 1px solid var(--amber-200);
  display: flex; align-items: center; gap: 8px;
}
.ds-warn-head h3 { font-size: 14.5px; font-weight: 600; color: var(--amber-700); }

/* ═══════════ ANIMATIONS ═══════════ */
@keyframes ds-fadeUp {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
.ds-anim-1 { animation: ds-fadeUp .28s ease both; }
.ds-anim-2 { animation: ds-fadeUp .28s .06s ease both; }
.ds-anim-3 { animation: ds-fadeUp .28s .12s ease both; }
.ds-anim-4 { animation: ds-fadeUp .28s .18s ease both; }

/* ═══════════ GRID HELPERS ═══════════ */
.ds-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
.ds-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
.ds-grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; }
.ds-flex-between { display: flex; align-items: center; justify-content: space-between; }
.ds-flex-gap { display: flex; align-items: center; gap: 8px; }

/* ═══════════ RESPONSIVE ═══════════ */
@media (max-width: 900px) {
  :root { --sidebar-w: 0px; }
  .ds-sidebar { transform: translateX(-252px); }
  .ds-main { margin-left: 0; }
  .ds-content { padding: 20px 16px; }
  .ds-grid-2, .ds-grid-3, .ds-grid-4 { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
  .ds-stats { grid-template-columns: 1fr 1fr; }
}
    `;
    document.head.appendChild(style);
  }, []);
  return null;
};
window.DispensaryStyles = DispensaryStyles;
