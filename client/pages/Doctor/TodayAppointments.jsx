/** pages/Doctor/TodayAppointments.jsx – ELITE REDESIGN */
const TodayAppointments = () => {
  const [appointments, setAppointments] = React.useState([]);
  const [loading, setLoading]           = React.useState(true);
  const [selectedAppt, setSelectedAppt] = React.useState(null);

  const load = () => {
    setLoading(true);
    // Removed the date filter so doctors can see all upcoming accepted appointments
    window.api.get(`/api/appointments/doctor`)
      .then(data => setAppointments(data.filter(a => a.status === 'Accepted')))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  React.useEffect(() => { load(); }, []);

  if (loading) return <div className="spinner" />;

  return (
    <div className="animate-in elite-card">
      <div className="elite-card-title">
        <div className="accent-line"></div>
        <h2>Active Appointments (Upcoming & Today)</h2>
      </div>

      {appointments.length === 0 ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <h3>No patients scheduled</h3>
          <p>Any accepted appointment requests will appear here.</p>
        </div>
      ) : (
        <div className="table-container-saas">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Patient Name</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map(appt => (
                <tr key={appt._id}>
                  <td style={{ fontWeight: 600 }}>{appt.date}</td>
                  <td><span className="badge badge-info" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>{appt.slotTime}</span></td>
                  <td>
                    <div style={{ fontWeight: 700 }}>{appt.patientId?.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{appt.patientId?.email}</div>
                  </td>
                  <td><span className="badge badge-success">Ready</span></td>
                  <td style={{ textAlign: 'right', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button className="btn btn-primary btn-sm" onClick={() => setSelectedAppt(appt)}>
                      Write Prescription
                    </button>
                    <button className="btn btn-secondary btn-sm" onClick={async () => {
                      if (!confirm('End treatment and clear from active queue?')) return;
                      try {
                        await window.api.patch(`/api/appointments/${appt._id}/status`, { status: 'Completed' });
                        load();
                      } catch (err) { alert(err.message); }
                    }}>
                      End Treatment
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedAppt && (
        <window.Modal
          isOpen={true}
          onClose={() => setSelectedAppt(null)}
          title={`Prescription for ${selectedAppt.patientId?.name}`}
        >
          <window.PrescriptionForm 
            appointment={selectedAppt} 
            onSuccess={() => { setSelectedAppt(null); load(); }} 
          />
        </window.Modal>
      )}
    </div>
  );
};
window.TodayAppointments = TodayAppointments;
