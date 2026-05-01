/** pages/Doctor/AppointmentRequests.jsx – ELITE REDESIGN */
const AppointmentRequests = () => {
  const [requests, setRequests] = React.useState([]);
  const [loading, setLoading]   = React.useState(true);
  const [rejectingId, setRejectingId] = React.useState(null);
  const [rejectReason, setRejectReason] = React.useState('');

  const load = () => {
    setLoading(true);
    window.api.get('/api/appointments/doctor')
      .then(data => setRequests(data.filter(a => a.status === 'Pending')))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  React.useEffect(() => { load(); }, []);

  const handleAccept = async (reqId) => {
    try {
      await window.api.patch(`/api/appointments/${reqId}/status`, { status: 'Accepted' });
      
      // Dispatch Email Notification
      const req = requests.find(r => r._id === reqId);
      if (req && window.mailer) {
        window.mailer.sendAppointmentConfirmation(
          req.patientId?.email, 
          req.patientId?.name, 
          req.date, 
          req.slotTime, 
          req.doctorId?.name || 'Doctor'
        );
      }

      load();
    } catch (err) { alert(err.message); }
  };

  const handleReject = async () => {
    if (!rejectingId) return;
    try {
      await window.api.patch(`/api/appointments/${rejectingId}/status`, { status: 'Rejected', rejectionReason: rejectReason });
      setRejectingId(null);
      setRejectReason('');
      load();
    } catch (err) { alert(err.message); }
  };

  if (loading) return <div className="spinner" />;

  return (
    <div className="animate-in elite-card">
      <div className="elite-card-title">
        <div className="accent-line"></div>
        <h2>Incoming Requests</h2>
      </div>

      {requests.length === 0 ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <h3>No pending requests</h3>
          <p>You are all caught up! New patient requests will appear here.</p>
        </div>
      ) : (
        <div className="table-container-saas">
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Date</th>
                <th>Time Slot</th>
                <th>Reason/Notes</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(req => (
                <tr key={req._id}>
                  <td>
                    <div style={{ fontWeight: 700 }}>{req.patientId?.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{req.patientId?.email}</div>
                  </td>
                  <td>{req.date}</td>
                  <td><span className="badge badge-info">{req.slotTime}</span></td>
                  <td style={{ fontSize: '0.875rem' }}>{req.reason || '—'}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                      <button className="btn btn-primary btn-sm" onClick={() => handleAccept(req._id)}>
                        Accept
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => setRejectingId(req._id)}>
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {rejectingId && (
        <window.Modal
          isOpen={true}
          onClose={() => setRejectingId(null)}
          title="Reject Appointment"
          footer={
            <>
              <button className="btn btn-ghost" onClick={() => setRejectingId(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleReject}>Confirm Rejection</button>
            </>
          }
        >
          <div className="form-group">
            <label className="form-label">Reason for Rejection</label>
            <textarea 
              className="input-saas" 
              rows={3} 
              placeholder="e.g. Doctor is unavailable, please rebook for tomorrow."
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
            />
          </div>
        </window.Modal>
      )}
    </div>
  );
};
window.AppointmentRequests = AppointmentRequests;
