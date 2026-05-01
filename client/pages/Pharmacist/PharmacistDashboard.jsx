/** pages/Pharmacist/PharmacistDashboard.jsx */
const PharmacistDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = React.useState('pending');
  const [pendingCount, setPendingCount] = React.useState(0);

  React.useEffect(() => {
    window.api.get('/api/prescriptions/pharmacist')
      .then(data => setPendingCount(data.filter(rx => rx.pharmacyStatus === 'Pending').length))
      .catch(console.error);
  }, []);

  const tabLabels = {
    pending: 'Order Queue',
    records: 'Dispensing Logs',
    request: 'Inventory Request',
  };

  return (
    <>
      <window.DispensaryStyles />
      <div className="app-shell">
      <window.Sidebar user={user} activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />
      
      <main className="main-stage">
        <header style={{ marginBottom: '48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 className="animate-in">{tabLabels[activeTab]}</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span className="status-pill status-success">Pharmacy Online</span>
            <div className="user-avatar" style={{ background: 'var(--p-100)', color: 'var(--p-600)', width: '36px', height: '36px' }}>
              {user.name[0]}
            </div>
          </div>
        </header>

        <div className="page-content fade-in">
          <div className="stats-grid-premium">
            <div className="stat-tile" style={{ borderLeftColor: 'var(--error)' }}>
              <div className="stat-tile-icon" style={{ background: '#FEF2F2', color: 'var(--error)', fontSize: '1rem', fontWeight: 700 }}>Pnd</div>
              <div className="stat-tile-data">
                <h2>{pendingCount}</h2>
                <p>Pending</p>
              </div>
            </div>
            <div className="stat-tile">
              <div className="stat-tile-icon" style={{ fontSize: '1rem', fontWeight: 700 }}>Stk</div>
              <div className="stat-tile-data">
                <h2>Linked</h2>
                <p>Stock</p>
              </div>
            </div>
            <div className="stat-tile" style={{ borderLeftColor: 'var(--info)' }}>
              <div className="stat-tile-icon" style={{ background: '#EBF5FB', color: '#3498DB', fontSize: '1rem', fontWeight: 700 }}>Rdy</div>
              <div className="stat-tile-data">
                <h2>Ready</h2>
                <p>Orders</p>
              </div>
            </div>
          </div>

          <div className="elite-card">
            {activeTab === 'pending' && <window.PendingPrescriptions />}
            {activeTab === 'records' && <window.AllRecords />}
            {activeTab === 'request' && <window.InventoryRequest />}
          </div>
        </div>
      </main>
    </div>
    </>
  );
};
window.PharmacistDashboard = PharmacistDashboard;
