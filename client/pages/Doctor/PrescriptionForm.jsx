/** pages/Doctor/PrescriptionForm.jsx – ELITE REDESIGN */
const PrescriptionForm = ({ appointment, onSuccess }) => {
  const [medicines, setMedicines] = React.useState([{ name: '', dosage: '', duration: '' }]);
  const [notes, setNotes]         = React.useState('');
  const [loading, setLoading]     = React.useState(false);
  const [error, setError]         = React.useState('');

  const addMed = () => setMedicines([...medicines, { name: '', dosage: '', duration: '' }]);
  const removeMed = (i) => setMedicines(medicines.filter((_, idx) => idx !== i));
  const updateMed = (i, field, val) => {
    const newMeds = [...medicines];
    newMeds[i][field] = val;
    setMedicines(newMeds);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (medicines.some(m => !m.name || !m.dosage)) return setError('Please fill medicine name and dosage.');
    setLoading(true);
    try {
      await window.api.post('/api/prescriptions', {
        appointmentId: appointment._id,
        patientId: appointment.patientId?._id || appointment.patientId,
        medicines,
        notes
      });
      onSuccess();
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="animate-in">
      {error && <div className="alert alert-error" style={{ marginBottom: '20px' }}>{error}</div>}

      <div style={{ marginBottom: '24px' }}>
        <div className="form-label" style={{ marginBottom: '12px' }}>Medicines</div>
        {medicines.map((med, i) => (
          <div key={i} className="animate-in" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr auto', gap: '10px', marginBottom: '10px', alignItems: 'end' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <input 
                className="input-saas" 
                placeholder="Medicine Name" 
                value={med.name} 
                onChange={e => updateMed(i, 'name', e.target.value)} 
                required 
              />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <input 
                className="input-saas" 
                placeholder="Dosage" 
                value={med.dosage} 
                onChange={e => updateMed(i, 'dosage', e.target.value)} 
                required 
              />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <input 
                className="input-saas" 
                placeholder="Duration" 
                value={med.duration} 
                onChange={e => updateMed(i, 'duration', e.target.value)} 
                required 
              />
            </div>
            {medicines.length > 1 && (
              <button type="button" className="btn btn-icon" onClick={() => removeMed(i)} style={{ color: 'var(--error)', background: 'rgba(239, 68, 68, 0.1)', fontSize: '11px', fontWeight: 700 }}>
                REMOVE
              </button>
            )}
          </div>
        ))}
        <button type="button" className="btn btn-ghost" onClick={addMed} style={{ marginTop: '10px', fontSize: '0.85rem' }}>
          Add Another Medicine
        </button>
      </div>

      <div className="form-group">
        <label className="form-label">Doctor's Notes / Advice</label>
        <textarea 
          className="input-saas" 
          rows={3} 
          placeholder="e.g. Bed rest for 2 days. Drink plenty of water." 
          value={notes} 
          onChange={e => setNotes(e.target.value)} 
        />
      </div>

      <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
        <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
          {loading ? 'Creating Prescription...' : 'Finalize & Send'}
        </button>
      </div>
    </form>
  );
};
window.PrescriptionForm = PrescriptionForm;
