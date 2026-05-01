/** pages/Patient/MyPrescriptions.jsx – ELITE REDESIGN */
const MyPrescriptions = () => {
  const [prescriptions, setPrescriptions] = React.useState([]);
  const [loading, setLoading]             = React.useState(true);

  const loadPrescriptions = () => {
    setLoading(true);
    window.api.get('/api/prescriptions/patient')
      .then(setPrescriptions)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  React.useEffect(() => { loadPrescriptions(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Permanently delete this medical record?')) return;
    try {
      await window.api.delete(`/api/prescriptions/${id}`);
      loadPrescriptions();
    } catch (err) { alert(err.message); }
  };

  if (loading) return <div className="spinner" />;

  return (
    <div className="animate-in">
      {prescriptions.length === 0 ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <h3>No records available</h3>
          <p>Prescriptions will appear here after your appointment.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
          {prescriptions.map(rx => (
            <div key={rx._id} className="card animate-in" style={{ border: '2px solid var(--p-100)', padding: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px dashed var(--p-200)', paddingBottom: '16px' }}>
                <div>
                  <h3 style={{ color: 'var(--p-600)' }}>Rx Prescription</h3>
                  <p style={{ fontSize: '0.85rem' }}>Dr. {rx.doctorId?.name} · {rx.appointmentId?.date}</p>
                </div>
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                  <span className={`status-pill ${rx.pharmacyStatus === 'Processed' ? 'status-success' : 'status-pending'}`}>
                    Pharmacy: {rx.pharmacyStatus}
                  </span>
                  {rx.billPDF && (
                    <a href={rx.billPDF} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                      View Bill / PDF
                    </a>
                  )}
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(rx._id)}>
                    Delete Record
                  </button>
                </div>
              </div>

              <div className="table-container-saas" style={{ border: 'none', background: 'transparent' }}>
                <table style={{ background: 'transparent' }}>
                  <thead>
                    <tr><th>Medicine</th><th>Dosage</th><th>Instruction</th></tr>
                  </thead>
                  <tbody>
                    {rx.medicines?.map((m, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 700 }}>{m.name}</td>
                        <td>{m.dosage}</td>
                        <td style={{ fontSize: '0.85rem' }}>{m.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {rx.notes && (
                <div style={{ marginTop: '20px', padding: '16px', background: 'var(--p-50)', borderRadius: '12px', borderLeft: '4px solid var(--p-500)', fontSize: '0.9rem' }}>
                  <strong>Doctor Advice:</strong> {rx.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
window.MyPrescriptions = MyPrescriptions;
