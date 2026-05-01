/** pages/Patient/MyAppointments.jsx – ELITE REDESIGN */
const MyAppointments = () => {
  const [appointments, setAppointments] = React.useState([]);
  const [loading, setLoading]           = React.useState(true);

  React.useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = () => {
    setLoading(true);
    window.api.get('/api/appointments/my')
      .then(setAppointments)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleCancel = async (id) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await window.api.patch(`/api/appointments/${id}/cancel`);
      loadAppointments();
    } catch (err) { alert(err.message); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    try {
      await window.api.delete(`/api/appointments/${id}`);
      loadAppointments();
    } catch (err) { alert(err.message); }
  };

  if (loading) return <div className="spinner" />;

  return (
    <div className="animate-in">
      {appointments.length === 0 ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <h3>No appointments found</h3>
          <p>You haven't booked any medical sessions yet.</p>
          <button className="btn btn-primary" style={{ marginTop: '20px' }} onClick={() => window.location.reload()}>
            Book Now
          </button>
        </div>
      ) : (
        <div className="table-container-saas">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Doctor</th>
                <th>Status</th>
                <th>Remarks</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map(appt => (
                <tr key={appt._id}>
                  <td style={{ fontWeight: 700 }}>{appt.date}</td>
                  <td><span className="badge badge-info">{appt.slotTime}</span></td>
                  <td>Dr. {appt.doctorId?.name}</td>
                  <td>
                    <span className={`status-pill ${
                      appt.status === 'Accepted' ? 'status-success' : 
                      appt.status === 'Rejected' ? 'status-error' : 'status-pending'
                    }`}>
                      {appt.status}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {appt.rejectionReason || appt.reason || '—'}
                  </td>
                  <td style={{ textAlign: 'right', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    {(appt.status === 'Pending' || appt.status === 'Accepted') && (
                      <button className="btn btn-warning btn-sm" onClick={() => handleCancel(appt._id)}>
                        Cancel
                      </button>
                    )}
                    {(appt.status === 'Completed' || appt.status === 'Cancelled' || appt.status === 'Rejected') && (
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(appt._id)}>
                        Delete
                      </button>
                    )}
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
window.MyAppointments = MyAppointments;
