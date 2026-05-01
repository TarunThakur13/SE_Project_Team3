/** pages/Patient/PatientDashboard.jsx – ELITE REDESIGN (v4.0) */
const PatientDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = React.useState('book');
  const [stats, setStats] = React.useState({ appointments: 0, prescriptions: 0 });
  
  const [showAlerts, setShowAlerts] = React.useState(false);
  const [showSettings, setShowSettings] = React.useState(false);

  React.useEffect(() => {
    Promise.all([
      window.api.get('/api/appointments/my'),
      window.api.get('/api/prescriptions/patient')
    ]).then(([appts, rxs]) => {
      setStats({ appointments: appts.length, prescriptions: rxs.length });
    }).catch(console.error);
  }, []);

  const tabLabels = {
    book:          'Appointment Booking',
    appointments:  'My Bookings',
    prescriptions: 'Medical History',
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
            <p className="animate-in" style={{ animationDelay: '0.1s' }}>Manage your campus health services and doctor schedule.</p>
          </div>
          <div className="animate-in" style={{ display: 'flex', gap: '12px', animationDelay: '0.2s' }}>
            <button className="btn btn-secondary" onClick={() => setShowAlerts(true)}>Alerts <span className="status-pill status-pending" style={{ marginLeft:'4px', padding:'2px 6px' }}>1</span></button>
            <button className="btn btn-secondary" onClick={() => setShowSettings(true)}>Settings</button>
          </div>
        </header>

        {/* ALERTS MODAL */}
        {showAlerts && (
          <window.Modal isOpen={true} onClose={() => setShowAlerts(false)} title="System Alerts">
            <div style={{ padding: '4px' }}>
              <div style={{ padding: '16px', background: 'var(--p-50)', borderLeft: '4px solid var(--info)', borderRadius: '8px', marginBottom: '12px' }}>
                <h4 style={{ margin: '0 0 4px 0', color: 'var(--p-600)' }}>Account Secure</h4>
                <p style={{ margin: 0, fontSize: '0.85rem' }}>Your clinical data is protected under end-to-end encryption.</p>
              </div>
              {stats.appointments > 0 && (
                <div style={{ padding: '16px', background: '#FFF7ED', borderLeft: '4px solid var(--warning)', borderRadius: '8px' }}>
                  <h4 style={{ margin: '0 0 4px 0', color: '#B9770E' }}>Appointment Reminder</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#9C640C' }}>You have existing appointments scheduled in your calendar.</p>
                </div>
              )}
            </div>
            <div style={{ marginTop: '24px', textAlign: 'right' }}>
              <button className="btn btn-secondary" onClick={() => setShowAlerts(false)}>Dismiss All</button>
            </div>
          </window.Modal>
        )}

        {/* SETTINGS MODAL */}
        {showSettings && (
          <window.Modal isOpen={true} onClose={() => setShowSettings(false)} title="Account Settings">
            <div style={{ padding: '4px' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="input-saas" value={user?.name || ''} readOnly disabled />
              </div>
              <div className="form-group">
                <label className="form-label">Registered Email</label>
                <input className="input-saas" value={user?.email || ''} readOnly disabled />
              </div>
              <div style={{ borderTop: '1px solid var(--p-200)', marginTop: '24px', paddingTop: '16px' }}>
                <h4 style={{ marginBottom: '12px' }}>Preferences</h4>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                  <input type="checkbox" defaultChecked /> Receive email notifications
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', marginTop: '8px' }}>
                  <input type="checkbox" defaultChecked /> SMS appointment reminders
                </label>
              </div>
            </div>
            <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button className="btn btn-secondary" onClick={() => setShowSettings(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => { alert('Preferences saved!'); setShowSettings(false); }}>Save Changes</button>
            </div>
          </window.Modal>
        )}

        <section className="stats-grid-premium animate-in" style={{ animationDelay: '0.2s' }}>
          <div className="stat-tile">
            <div className="stat-tile-icon" style={{ fontSize: '1rem', fontWeight: 700 }}>Appts</div>
            <div className="stat-tile-data">
              <h2>{stats.appointments}</h2>
              <p>Appointments</p>
            </div>
          </div>
          <div className="stat-tile">
            <div className="stat-tile-icon" style={{ fontSize: '1rem', fontWeight: 700 }}>Rx</div>
            <div className="stat-tile-data">
              <h2>{stats.prescriptions}</h2>
              <p>Health Records</p>
            </div>
          </div>
          <div className="stat-tile" style={{ borderLeft: '4px solid var(--info)' }}>
            <div className="stat-tile-icon" style={{ background: '#eff6ff', color: 'var(--info)', fontSize: '1rem', fontWeight: 700 }}>Act</div>
            <div className="stat-tile-data">
              <h2>Verified</h2>
              <p>Account Status</p>
            </div>
          </div>
        </section>

        <div className="animate-in" style={{ animationDelay: '0.3s' }}>
          {activeTab === 'book' && <window.BookAppointment setActiveTab={setActiveTab} />}
          {activeTab === 'appointments' && (
            <div className="elite-card">
              <div className="elite-card-title"><div className="accent-line"></div><h2>My Bookings</h2></div>
              <window.MyAppointments />
            </div>
          )}
          {activeTab === 'prescriptions' && (
            <div className="elite-card">
              <div className="elite-card-title"><div className="accent-line"></div><h2>Medical History</h2></div>
              <window.MyPrescriptions />
            </div>
          )}
        </div>
      </main>
      </div>
    </>
  );
};
window.PatientDashboard = PatientDashboard;
