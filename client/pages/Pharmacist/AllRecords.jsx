/** pages/Pharmacist/AllRecords.jsx – All processed pharmacy records */
const AllRecords = () => {
  const [records, setRecords] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const load = () => {
    setLoading(true);
    window.api.get('/api/pharmacy')
      .then(setRecords)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  React.useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to permanently delete this dispense log?')) return;
    try {
      await window.api.delete(`/api/pharmacy/${id}`);
      load();
    } catch (err) { alert(err.message); }
  };

  if (loading) return <div className="spinner" />;

  return (
    <div>
      <div style={{ marginBottom:'22px' }}>
        <h1 style={{ marginBottom:'4px' }}>All Pharmacy Records</h1>
        <p>Complete history of dispensed prescriptions and bills.</p>
      </div>

      <div className="elite-card animate-in">
        {records.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <p>No records yet.</p>
          </div>
        ) : (
          <div className="table-container-saas">
            <table>
              <thead>
                <tr>
                  <th>#</th><th>Patient</th><th>Doctor</th><th>Date</th>
                  <th>Medicines</th><th>Comments</th><th>Bill</th><th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.map((rec, i) => {
                  const rx = rec.prescriptionId;
                  return (
                    <tr key={rec._id}>
                      <td>{i + 1}</td>
                      <td><strong>{rx?.patientId?.name || '—'}</strong></td>
                      <td>{rx?.doctorId?.name || '—'}</td>
                      <td style={{ fontSize:'0.8rem' }}>
                        {rx?.appointmentId?.date
                          ? new Date(rx.appointmentId.date + 'T00:00:00').toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})
                          : '—'}
                      </td>
                      <td style={{ fontSize:'0.8rem' }}>
                        {rx?.medicines?.map(m => m.name).join(', ') || '—'}
                      </td>
                      <td style={{ fontSize:'0.8rem', maxWidth:'180px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                        {rec.comments || '—'}
                      </td>
                      <td>
                        {rec.billPDF
                          ? <a href={rec.billPDF} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">View PDF</a>
                          : <span style={{ color:'var(--text-light)', fontSize:'0.8rem' }}>—</span>}
                      </td>
                      <td><span className={`badge ${rec.status === 'Processed' ? 'badge-success' : 'badge-warning'}`}>{rec.status}</span></td>
                      <td style={{ textAlign: 'right' }}>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(rec._id)}>Delete</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
window.AllRecords = AllRecords;
