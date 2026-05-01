/** pages/Admin/ManageInventory.jsx */
const ManageInventory = () => {
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [showAdd, setShowAdd] = React.useState(false);
  const [editId, setEditId] = React.useState(null);
  const [editQty, setEditQty] = React.useState('');
  const [form, setForm] = React.useState({ medicineName: '', quantity: '', unit: 'tablets' });
  const [msg, setMsg] = React.useState({ type: '', text: '' });

  const load = () => {
    setLoading(true);
    window.api.get('/api/inventory')
      .then(setItems).catch(console.error).finally(() => setLoading(false));
  };

  React.useEffect(() => { load(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.medicineName || !form.quantity) return setMsg({ type: 'error', text: 'Name and quantity required.' });
    try {
      await window.api.post('/api/inventory', { ...form, quantity: Number(form.quantity) });
      setMsg({ type: 'success', text: 'Medicine added.' });
      setForm({ medicineName: '', quantity: '', unit: 'tablets' });
      setShowAdd(false); load();
    } catch (err) { setMsg({ type: 'error', text: err.message }); }
  };

  const handleUpdate = async (id) => {
    if (!editQty) return;
    try {
      await window.api.patch(`/api/inventory/${id}`, { quantity: Number(editQty) });
      setEditId(null); setEditQty('');
      load();
    } catch (err) { alert(err.message); }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Remove ${name} from inventory?`)) return;
    try {
      await window.api.delete(`/api/inventory/${id}`);
      load();
    } catch (err) { alert(err.message); }
  };

  const stockBadge = (qty) => {
    if (qty === 0) return <span className="badge badge-rejected">Out of Stock</span>;
    if (qty < 20) return <span className="badge badge-pending">Low Stock</span>;
    return <span className="badge badge-accepted">In Stock</span>;
  };

  return (
    <div>
      <div style={{ marginBottom: '22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div><h1 style={{ marginBottom: '4px' }}>Manage Inventory</h1><p>Add medicines and update stock quantities.</p></div>
        <button className="btn btn-primary" onClick={() => { setShowAdd(!showAdd); setMsg({ type: '', text: '' }); }}>
          {showAdd ? 'Cancel' : 'Add Medicine'}
        </button>
      </div>

      {msg.text && <div className={`alert alert-${msg.type === 'error' ? 'error' : 'success'}`}>{msg.text}</div>}

      {showAdd && (
        <div className="elite-card animate-in" style={{ marginBottom: '22px' }}>
          <div className="elite-card-title">
            <div className="accent-line"></div>
            <h2>New Medicine</h2>
          </div>
          <form onSubmit={handleAdd}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '12px', alignItems: 'end' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Medicine Name</label>
                <input className="input-saas" placeholder="Paracetamol" value={form.medicineName} onChange={e => setForm(f => ({ ...f, medicineName: e.target.value }))} required />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Quantity</label>
                <input type="number" className="input-saas" min="0" placeholder="200" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} required />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Unit</label>
                <select className="input-saas" value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))}>
                  <option value="tablets">tablets</option>
                  <option value="capsules">capsules</option>
                  <option value="ml">ml</option>
                  <option value="bottles">bottles</option>
                  <option value="sachets">sachets</option>
                  <option value="strips">strips</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary btn-full" id="btn-add-medicine">Add</button>
            </div>
          </form>
        </div>
      )}

      <div className="elite-card animate-in" style={{ animationDelay: '0.1s' }}>
        {loading ? <div className="spinner" /> : items.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}><p>No medicines in inventory.</p></div>
        ) : (
          <div className="table-container-saas">
            <table>
              <thead><tr><th>#</th><th>Medicine</th><th>Quantity</th><th>Unit</th><th>Status</th><th>Last Updated</th><th>Actions</th></tr></thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={item._id}>
                    <td>{i + 1}</td>
                    <td><strong>{item.medicineName}</strong></td>
                    <td>
                      {editId === item._id ? (
                        <input type="number" className="input-saas" style={{ width: '90px', padding: '5px 8px', fontSize: '0.85rem' }}
                          value={editQty} min="0" onChange={e => setEditQty(e.target.value)} autoFocus />
                      ) : item.quantity}
                    </td>
                    <td>{item.unit}</td>
                    <td>{stockBadge(item.quantity)}</td>
                    <td style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>
                      {new Date(item.lastUpdated).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {editId === item._id ? (
                          <>
                            <button className="btn btn-success btn-sm" onClick={() => handleUpdate(item._id)}>Save</button>
                            <button className="btn btn-outline btn-sm" onClick={() => setEditId(null)}>Cancel</button>
                          </>
                        ) : (
                          <>
                            <button className="btn btn-warning btn-sm" onClick={() => { setEditId(item._id); setEditQty(String(item.quantity)); }}>Edit</button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item._id, item.medicineName)}>Delete</button>
                          </>
                        )}
                      </div>
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
window.ManageInventory = ManageInventory;
