/** pages/Pharmacist/InventoryRequest.jsx – Pharmacist requests medicines from admin */
const InventoryRequest = () => {
  const [form, setForm]       = React.useState({ medicineName:'', quantity:'', unit:'tablets', reason:'' });
  const [myRequests, setMyRequests] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [msg, setMsg]         = React.useState({ type:'', text:'' });

  const load = () => {
    window.api.get('/api/inventory/requests')
      .then(setMyRequests)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  React.useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.medicineName || !form.quantity) return setMsg({ type:'error', text:'Medicine name and quantity are required.' });
    setSubmitting(true); setMsg({ type:'', text:'' });
    try {
      await window.api.post('/api/inventory/requests', { ...form, quantity: Number(form.quantity) });
      setMsg({ type:'success', text:'Request submitted to Admin.' });
      setForm({ medicineName:'', quantity:'', unit:'tablets', reason:'' });
      load();
    } catch (err) {
      setMsg({ type:'error', text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const statusBadge = (s) => <span className={`badge badge-${s.toLowerCase()}`}>{s}</span>;

  return (
    <div>
      <div style={{ marginBottom:'22px' }}>
        <h1 style={{ marginBottom:'4px' }}>Request Inventory</h1>
        <p>Submit a medicine restock request to the Admin.</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1.6fr', gap:'22px', alignItems:'start' }}>
        {/* Request form */}
        <div className="elite-card animate-in">
          <div className="elite-card-title">
            <div className="accent-line"></div>
            <h2>New Request</h2>
          </div>
          {msg.text && <div className={`alert alert-${msg.type === 'error' ? 'error' : 'success'}`}>{msg.text}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="req-med">Medicine Name</label>
              <input id="req-med" className="input-saas" placeholder="e.g. Paracetamol" value={form.medicineName} onChange={e => setForm(f=>({...f, medicineName:e.target.value}))} required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="req-qty">Quantity</label>
                <input id="req-qty" type="number" className="input-saas" min="1" placeholder="100" value={form.quantity} onChange={e => setForm(f=>({...f, quantity:e.target.value}))} required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="req-unit">Unit</label>
                <select id="req-unit" className="input-saas" value={form.unit} onChange={e => setForm(f=>({...f, unit:e.target.value}))}>
                  <option value="tablets">tablets</option>
                  <option value="capsules">capsules</option>
                  <option value="ml">ml</option>
                  <option value="bottles">bottles</option>
                  <option value="sachets">sachets</option>
                  <option value="strips">strips</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="req-reason">Reason (optional)</label>
              <textarea id="req-reason" className="input-saas" rows={2} placeholder="e.g. Running low on stock" value={form.reason} onChange={e => setForm(f=>({...f, reason:e.target.value}))} />
            </div>
            <button type="submit" className="btn btn-primary btn-full" disabled={submitting} id="btn-send-request">
              {submitting ? 'Sending…' : 'Send Request'}
            </button>
          </form>
        </div>

        {/* My requests history */}
        <div className="elite-card animate-in" style={{ animationDelay: '0.1s' }}>
          <div className="elite-card-title">
            <div className="accent-line"></div>
            <h2>My Requests</h2>
          </div>
          {loading ? <div className="spinner" /> : myRequests.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}><p>No requests submitted yet.</p></div>
          ) : (
            <div className="table-container-saas">
              <table>
                <thead><tr><th>Medicine</th><th>Qty</th><th>Unit</th><th>Status</th><th>Admin Note</th></tr></thead>
                <tbody>
                  {myRequests.map(req => (
                    <tr key={req._id}>
                      <td><strong>{req.medicineName}</strong></td>
                      <td>{req.quantity}</td>
                      <td>{req.unit}</td>
                      <td>{statusBadge(req.status)}</td>
                      <td style={{ fontSize:'0.8rem', color:'var(--text-light)' }}>{req.adminNote || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
window.InventoryRequest = InventoryRequest;
