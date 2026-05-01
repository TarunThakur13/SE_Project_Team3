/** pages/Doctor/DoctorDashboard.jsx */

const DoctorClinicalHistory = () => {
  const [logs, setLogs] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    window.api.get('/api/prescriptions/doctor')
      .then(setLogs)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner" />;

  return (
    <div className="animate-in">
      <div className="elite-card-title">
        <div className="accent-line"></div>
        <h2>Clinical History</h2>
      </div>

      {logs.length === 0 ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <h3>No prescriptions found</h3>
          <p>Your prescribed logs will appear here.</p>
        </div>
      ) : (
        <div className="table-container-saas">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Patient</th>
                <th>Medicines</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log._id}>
                  <td>{new Date(log.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div style={{ fontWeight: 700 }}>{log.patientId?.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{log.patientId?.email}</div>
                  </td>
                  <td>
                    {log.medicines.map((m, i) => (
                      <div key={i} style={{ fontSize: '0.85rem' }}>• {m.name} ({m.dosage})</div>
                    ))}
                  </td>
                  <td>
                    <span className={`badge ${log.pharmacyStatus === 'Pending' ? 'badge-warning' : 'badge-success'}`}>
                      {log.pharmacyStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const DoctorDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = React.useState('requests');
  const [stats, setStats] = React.useState({ pending: 0, accepted: 0 });

  React.useEffect(() => {
    window.api.get(`/api/appointments/doctor`)
      .then(data => {
        setStats({
          pending: data.filter(a => a.status === 'Pending').length,
          accepted: data.filter(a => a.status === 'Accepted').length
        });
      }).catch(console.error);
  }, []);

  const tabLabels = {
    requests:      'Appointment Requests',
    today:         'Accepted Patients',
    prescriptions: 'Clinical History',
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
            <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '1.1rem' }}>Welcome back, Dr. {user?.name?.split(' ')[0]}!</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span className="status-pill status-success">Clinic Open</span>
            <div className="user-avatar" style={{ background: 'var(--p-100)', color: 'var(--p-600)', width: '36px', height: '36px', fontSize: '1rem' }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
          </div>
        </header>

        <section className="stats-grid-premium animate-in" style={{ padding: '0' }}>
          <div className="stat-tile" style={{ borderLeftColor: 'var(--warning)' }}>
            <div className="stat-tile-icon" style={{ background: '#FFF7ED', color: 'var(--warning)', fontSize: '1rem', fontWeight: 700 }}>Req</div>
            <div className="stat-tile-data">
              <h2>{stats.pending}</h2>
              <p>Pending</p>
            </div>
          </div>
          <div className="stat-tile">
            <div className="stat-tile-icon" style={{ fontSize: '1rem', fontWeight: 700 }}>Act</div>
            <div className="stat-tile-data">
              <h2>{stats.accepted}</h2>
              <p>Active</p>
            </div>
          </div>
          <div className="stat-tile" style={{ borderLeftColor: 'var(--info)' }}>
            <div className="stat-tile-icon" style={{ background: '#EBF5FB', color: '#3498DB', fontSize: '1rem', fontWeight: 700 }}>Q</div>
            <div className="stat-tile-data">
              <h2>Live</h2>
              <p>Queue</p>
            </div>
          </div>
        </section>

        <div className="animate-in" style={{ marginTop: '40px' }}>
          {activeTab === 'requests' && <window.AppointmentRequests />}
          {activeTab === 'today' && <window.TodayAppointments />}
          {activeTab === 'prescriptions' && <DoctorClinicalHistory />}
        </div>
      </main>
    </div>
    </>
  );
};
window.DoctorDashboard = DoctorDashboard;
