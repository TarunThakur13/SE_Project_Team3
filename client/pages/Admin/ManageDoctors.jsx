/** pages/Admin/ManageDoctors.jsx – Premium UI */
const ManageDoctors = () => {
  const [doctors, setDoctors] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [showAdd, setShowAdd] = React.useState(false);
  const [form, setForm] = React.useState({ name: '', email: '', password: '', specialization: '' });
  const [submitting, setSubmitting] = React.useState(false);
  const [msg, setMsg] = React.useState({ type: '', text: '' });

  const load = () => {
    setLoading(true);
    window.api.get('/api/admin/doctors')
      .then(setDoctors).catch(console.error).finally(() => setLoading(false));
  };
  React.useEffect(() => { load(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password)
      return setMsg({ type: 'error', text: 'Name, email, and password are required.' });
    setSubmitting(true); setMsg({ type: '', text: '' });
    try {
      await window.api.post('/api/admin/doctors', form);
      setMsg({ type: 'success', text: `Dr. ${form.name} has been added successfully.` });
      setForm({ name: '', email: '', password: '', specialization: '' });
      setShowAdd(false); load();
    } catch (err) {
      setMsg({ type: 'error', text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemove = async (id, name) => {
    if (!confirm(`Deactivate Dr. ${name}? They will not be able to accept new appointments.`)) return;
    try {
      await window.api.delete(`/api/admin/doctors/${id}`);
      load();
    } catch (err) { alert(err.message); }
  };

  const activeCount = doctors.filter(d => d.isActive).length;
  const inactiveCount = doctors.length - activeCount;

  return (
    <div>
      {/* ── Page Header ── */}
      <div className="ds-page-head ds-anim-1">
        <div>
          <h1 className="ds-page-title">Manage Staff</h1>
          <p className="ds-page-sub">Add, view, and deactivate doctor accounts in the system.</p>
        </div>
        <button
          className={`ds-btn ${showAdd ? 'ds-btn-outline' : 'ds-btn-primary'}`}
          onClick={() => { setShowAdd(!showAdd); setMsg({ type: '', text: '' }); }}
        >
          {showAdd ? 'Cancel' : 'Add Doctor'}
        </button>
      </div>

      {/* ── Summary Tiles ── */}
      <div className="ds-stats ds-anim-1">
        <div className="ds-stat">
          <div className="ds-stat-val">{doctors.length}</div>
          <div className="ds-stat-lbl">Total Doctors</div>
        </div>
        <div className="ds-stat">
          <div className="ds-stat-val" style={{ color: 'var(--g-600)' }}>{activeCount}</div>
          <div className="ds-stat-lbl">Active</div>
        </div>
        <div className="ds-stat">
          <div className="ds-stat-val" style={{ color: 'var(--n-500)' }}>{inactiveCount}</div>
          <div className="ds-stat-lbl">Inactive</div>
        </div>
      </div>

      {/* ── Feedback Message ── */}
      {msg.text && (
        <div className={`ds-alert ds-alert-${msg.type === 'error' ? 'error' : 'success'} ds-anim-1`}>
          <span>{msg.text}</span>
        </div>
      )}

      {/* ── Add Doctor Form ── */}
      {showAdd && (
        <div className="ds-panel ds-anim-1">
          <div className="ds-panel-head">
            <div>
              <h3>New Doctor Account</h3>
            </div>
          </div>
          <div className="ds-panel-body">
            <form onSubmit={handleAdd}>
              <div className="ds-grid-2">
                <div className="ds-form-group" style={{ marginBottom: 0 }}>
                  <label className="ds-label">Full Name <span className="req">*</span></label>
                  <input
                    className="ds-input" placeholder="Dr. Priya Sharma"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="ds-form-group" style={{ marginBottom: 0 }}>
                  <label className="ds-label">Email <span className="req">*</span></label>
                  <input
                    type="email" className="ds-input" placeholder="doctor@hospital.com"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    required
                  />
                </div>
                <div className="ds-form-group" style={{ marginBottom: 0 }}>
                  <label className="ds-label">Password <span className="req">*</span></label>
                  <input
                    type="password" className="ds-input" placeholder="Min 6 characters"
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    required minLength={6}
                  />
                </div>
                <div className="ds-form-group" style={{ marginBottom: 0 }}>
                  <label className="ds-label">Specialization</label>
                  <input
                    className="ds-input" placeholder="General Physician"
                    value={form.specialization}
                    onChange={e => setForm(f => ({ ...f, specialization: e.target.value }))}
                  />
                </div>
              </div>
              <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
                <button
                  type="submit"
                  className="ds-btn ds-btn-primary"
                  disabled={submitting}
                  id="btn-add-doctor"
                >
                  {submitting ? 'Adding…' : 'Add Doctor'}
                </button>
                <button
                  type="button"
                  className="ds-btn ds-btn-ghost"
                  onClick={() => setShowAdd(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Doctors Table ── */}
      <div className="ds-card ds-anim-2">
        <div className="ds-card-header">
          <div className="ds-card-header-left">
            <div>
              <div className="ds-card-title">Doctor Directory</div>
              <div className="ds-card-sub">{doctors.length} registered</div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="ds-spinner-wrap"><div className="ds-spinner" /></div>
        ) : doctors.length === 0 ? (
          <div className="ds-empty">
            <div className="ds-empty-title">No doctors registered yet</div>
            <div className="ds-empty-text">Use the "Add Doctor" button above to get started.</div>
          </div>
        ) : (
          <div className="ds-table-wrap">
            <table className="ds-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Doctor</th>
                  <th>Email</th>
                  <th>Specialization</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((doc, i) => (
                  <tr key={doc._id}>
                    <td className="td-muted">{i + 1}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="ds-avatar-sm">
                          {doc.name[0].toUpperCase()}
                        </div>
                        <span className="td-name">{doc.name}</span>
                      </div>
                    </td>
                    <td className="td-muted">{doc.email}</td>
                    <td>
                      {doc.specialization
                        ? <span style={{ fontSize: 13.5 }}>{doc.specialization}</span>
                        : <span className="td-muted">—</span>}
                    </td>
                    <td>
                      <span className={`ds-badge ${doc.isActive ? 'ds-badge-green' : 'ds-badge-gray'}`}>
                        {doc.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {doc.isActive && (
                        <button
                          className="ds-btn ds-btn-danger ds-btn-sm"
                          onClick={() => handleRemove(doc._id, doc.name)}
                        >
                          Deactivate
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
    </div>
  );
};
window.ManageDoctors = ManageDoctors;