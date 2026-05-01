/** pages/Admin/AdminDashboard.jsx – Admin Shell */
const AdminDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = React.useState('doctors');
  const [report, setReport] = React.useState(null);

  // Fetch overview data for topbar stats
  React.useEffect(() => {
    window.api.get('/api/admin/reports')
      .then(setReport).catch(console.error);
  }, []);

  const tabMeta = {
    doctors: { title: 'Manage Staff', sub: 'Add or deactivate doctor accounts' },
    inventory: { title: 'Stock Inventory', sub: 'Monitor and update medicine quantities' },
    requests: { title: 'Procurement Requests', sub: 'Review pharmacist stock requests' },
    reports: { title: 'System Analytics', sub: 'Reports and operational overview' },
  };

  const pending = report?.pendingRequests || 0;
  const { title, sub } = tabMeta[activeTab] || {};

  return (
    <>
      <window.DispensaryStyles />
      <div className="app-shell">
        <window.Sidebar
          user={user}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onLogout={onLogout}
          pendingCount={pending}
        />

        <main className="ds-main">
          {/* Top Bar */}
          <header className="ds-topbar">
            <div className="ds-topbar-left">
              <h1>{title}</h1>
              <p>{sub}</p>
            </div>
            <div className="ds-topbar-right">
              {/* Quick stats in topbar */}
              {report && (
                <div className="ds-flex-gap" style={{ gap: 16, marginRight: 8 }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 11, color: 'var(--n-400)', letterSpacing: '.5px', textTransform: 'uppercase', fontWeight: 600 }}>Appointments</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--n-800)', letterSpacing: '-.3px' }}>{report.appointments.total}</div>
                  </div>
                  <div style={{ width: 1, height: 32, background: 'var(--n-200)' }} />
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 11, color: 'var(--n-400)', letterSpacing: '.5px', textTransform: 'uppercase', fontWeight: 600 }}>Medicines</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--n-800)', letterSpacing: '-.3px' }}>{report.inventory.length}</div>
                  </div>
                  {pending > 0 && (
                    <>
                      <div style={{ width: 1, height: 32, background: 'var(--n-200)' }} />
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 11, color: 'var(--n-400)', letterSpacing: '.5px', textTransform: 'uppercase', fontWeight: 600 }}>Pending</div>
                        <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--amber-600)', letterSpacing: '-.3px' }}>{pending}</div>
                      </div>
                    </>
                  )}
                </div>
              )}
              <div className="ds-status-pill green">Admin Secure</div>
              <div className="ds-avatar-md" style={{ marginLeft: 4 }}>
                {user.name[0].toUpperCase()}
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="ds-content">
            {activeTab === 'doctors' && <window.ManageDoctors />}
            {activeTab === 'inventory' && <window.ManageInventory />}
            {activeTab === 'requests' && <window.InventoryRequests />}
            {activeTab === 'reports' && <window.Reports />}
          </div>
        </main>
      </div>
    </>
  );
};
window.AdminDashboard = AdminDashboard;