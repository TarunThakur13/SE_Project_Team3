/** pages/Admin/InventoryRequests.jsx – Premium UI */
const InventoryRequests = () => {
  const [requests, setRequests] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [notes, setNotes] = React.useState({});
  const [actionId, setActionId] = React.useState('');
  const [filter, setFilter] = React.useState('All');

  const load = () => {
    setLoading(true);
    window.api.get('/api/inventory/requests')
      .then(setRequests).catch(console.error).finally(() => setLoading(false));
  };
  React.useEffect(() => { load(); }, []);

  const handleAction = async (id, status) => {
    setActionId(id + status);
    try {
      await window.api.patch(`/api/inventory/requests/${id}`, {
        status, adminNote: notes[id] || '',
      });
      load();
    } catch (err) { alert(err.message); }
    finally { setActionId(''); }
  };

  const filtered = filter === 'All' ? requests : requests.filter(r => r.status === filter);
  const pending = requests.filter(r => r.status === 'Pending').length;
  const approved = requests.filter(r => r.status === 'Approved').length;
  const rejected = requests.filter(r => r.status === 'Rejected').length;

  const statusBadge = (status) => {
    const map = {
      Pending: 'ds-badge-amber',
      Approved: 'ds-badge-green',
      Rejected: 'ds-badge-red',
    };
    return map[status] || 'ds-badge-gray';
  };

  return (
    <div>
      {/* ── Page Header ── */}
      <div className="ds-page-head ds-anim-1">
        <div>
          <h1 className="ds-page-title">Procurement Requests</h1>
          <p className="ds-page-sub">
            Review and approve or reject pharmacist stock requests.
            {pending > 0 && (
              <span style={{
                marginLeft: 10,
                padding: '2px 10px',
                background: 'var(--amber-50)', color: 'var(--amber-700)',
                border: '1px solid var(--amber-200)',
                borderRadius: 999, fontSize: 12, fontWeight: 700,
              }}>
                {pending} pending
              </span>
            )}
          </p>
        </div>
      </div>

      {/* ── Summary Tiles ── */}
      <div className="ds-stats ds-anim-1">
        <div className="ds-stat">
          <div className="ds-stat-val">{requests.length}</div>
          <div className="ds-stat-lbl">Total Requests</div>
        </div>
        <div className="ds-stat">
          <div className="ds-stat-val" style={{ color: 'var(--amber-700)' }}>{pending}</div>
          <div className="ds-stat-lbl">Pending</div>
        </div>
        <div className="ds-stat">
          <div className="ds-stat-val" style={{ color: 'var(--g-600)' }}>{approved}</div>
          <div className="ds-stat-lbl">Approved</div>
        </div>
        <div className="ds-stat">
          <div className="ds-stat-val" style={{ color: 'var(--red-600)' }}>{rejected}</div>
          <div className="ds-stat-lbl">Rejected</div>
        </div>
      </div>

      {/* ── Table Card ── */}
      <div className="ds-card ds-anim-2">
        <div className="ds-card-header">
          <div className="ds-card-header-left">
            <div>
              <div className="ds-card-title">Request Queue</div>
              <div className="ds-card-sub">{filtered.length} requests</div>
            </div>
          </div>
          {/* Filter Tabs */}
          <div className="ds-filter-bar">
            {['All', 'Pending', 'Approved', 'Rejected'].map(s => (
              <button
                key={s}
                className={`ds-filter-tab ${filter === s ? 'active' : ''}`}
                onClick={() => setFilter(s)}
              >
                {s}
                {s === 'Pending' && pending > 0 && (
                  <span style={{
                    marginLeft: 5, fontSize: 10, fontWeight: 700,
                    background: 'var(--amber-400)', color: '#fff',
                    borderRadius: 999, padding: '1px 5px',
                  }}>{pending}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="ds-spinner-wrap"><div className="ds-spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="ds-empty">
            <div className="ds-empty-title">
              {filter !== 'All' ? `No ${filter.toLowerCase()} requests` : 'No requests yet'}
            </div>
            <div className="ds-empty-text">
              {filter !== 'All'
                ? `Switch the filter to see other requests.`
                : 'Pharmacists can submit stock requests from their dashboard.'}
            </div>
          </div>
        ) : (
          <div className="ds-table-wrap">
            <table className="ds-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Pharmacist</th>
                  <th>Medicine</th>
                  <th>Qty</th>
                  <th>Unit</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th style={{ minWidth: 180 }}>Admin Note</th>
                  <th style={{ textAlign: 'right', minWidth: 160 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((req, i) => (
                  <tr key={req._id}>
                    <td className="td-muted">{i + 1}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                        <div className="ds-avatar-sm">
                          {(req.pharmacistId?.name || '?')[0].toUpperCase()}
                        </div>
                        <span className="td-name">{req.pharmacistId?.name || '—'}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <span style={{ fontWeight: 500 }}>{req.medicineName}</span>
                      </div>
                    </td>
                    <td>
                      <span className="td-mono" style={{ fontWeight: 600 }}>{req.quantity}</span>
                    </td>
                    <td className="td-muted">{req.unit}</td>
                    <td>
                      <span style={{ fontSize: 13, color: 'var(--n-500)', maxWidth: 160, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {req.reason || <span className="td-muted">—</span>}
                      </span>
                    </td>
                    <td>
                      <span className={`ds-badge ${statusBadge(req.status)}`}>
                        {req.status}
                      </span>
                    </td>
                    <td>
                      {req.status === 'Pending' ? (
                        <input
                          className="ds-input"
                          style={{ fontSize: 12.5, padding: '5px 9px', minWidth: 150 }}
                          placeholder="Optional note for pharmacist…"
                          value={notes[req._id] || ''}
                          onChange={e => setNotes(n => ({ ...n, [req._id]: e.target.value }))}
                        />
                      ) : (
                        <span style={{ fontSize: 13, color: 'var(--n-500)' }}>
                          {req.adminNote || <span className="td-muted">—</span>}
                        </span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {req.status === 'Pending' ? (
                        <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                          <button
                            className="ds-btn ds-btn-success ds-btn-sm"
                            disabled={actionId === req._id + 'Approved'}
                            onClick={() => handleAction(req._id, 'Approved')}
                          >
                            Approve
                          </button>
                          <button
                            className="ds-btn ds-btn-danger ds-btn-sm"
                            disabled={actionId === req._id + 'Rejected'}
                            onClick={() => handleAction(req._id, 'Rejected')}
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: 13, color: 'var(--n-300)' }}>—</span>
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
window.InventoryRequests = InventoryRequests;