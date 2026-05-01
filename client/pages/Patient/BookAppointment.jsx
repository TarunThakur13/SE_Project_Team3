/** pages/Patient/BookAppointment.jsx – ELITE REDESIGN (v4.0) */
const BookAppointment = ({ setActiveTab }) => {
  const [doctors, setDoctors] = React.useState([]);
  const [slots, setSlots]     = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [slotsLoading, setSlotsLoading] = React.useState(false);
  const [msg, setMsg]         = React.useState({ type:'', text:'' });

  // Form State
  const [form, setForm] = React.useState({ doctorId:'', date:'', slotIndex: null, reason: '' });
  const [booked, setBooked] = React.useState(false);

  React.useEffect(() => {
    window.api.get('/api/appointments/doctors')
      .then(data => setDoctors(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const fetchSlots = async (docId, date) => {
    if (!docId || !date) return;
    setSlotsLoading(true);
    try {
      const data = await window.api.get(`/api/appointments/slots?doctorId=${docId}&date=${date}`);
      setSlots(data);
    } catch (err) { console.error(err); }
    finally { setSlotsLoading(false); }
  };

  const handleDocChange = (e) => {
    const id = e.target.value;
    setForm(f => ({ ...f, doctorId: id, slotIndex: null }));
    fetchSlots(id, form.date);
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setForm(f => ({ ...f, date, slotIndex: null }));
    fetchSlots(form.doctorId, date);
  };

  const handleBook = async () => {
    if (!form.doctorId || !form.date || form.slotIndex === null) return;
    setLoading(true);
    try {
      await window.api.post('/api/appointments/book', {
        doctorId: form.doctorId,
        date: form.date,
        slotIndex: form.slotIndex,
        reason: form.reason
      });
      setBooked(true);
      setForm({ doctorId:'', date:'', slotIndex: null, reason: '' });
      setSlots([]);
    } catch (err) {
      setMsg({ type:'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  if (booked) {
    return (
      <div className="animate-in" style={{ maxWidth: '600px', margin: '40px auto', textAlign: 'center' }}>
        <div className="elite-card" style={{ padding: '48px 32px' }}>
          <div style={{ 
            width: '64px', height: '64px', background: 'var(--g-100)', color: 'var(--g-600)', 
            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '32px', margin: '0 auto 24px', fontWeight: 'bold'
          }}>✓</div>
          <h2 style={{ marginBottom: '12px', color: 'var(--n-800)' }}>Booking Confirmed!</h2>
          <p style={{ color: 'var(--n-500)', marginBottom: '32px', lineHeight: '1.6' }}>
            Your appointment request has been sent to the doctor. You will be notified once it is reviewed.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button className="btn btn-primary btn-full" onClick={() => setActiveTab('appointments')}>
              View My Bookings
            </button>
            <button className="btn btn-ghost btn-full" onClick={() => setBooked(false)}>
              Book Another Appointment
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading && doctors.length === 0) return <div className="spinner" />;

  return (
    <div className="animate-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="elite-card">
        <div className="elite-card-title">
          <div className="accent-line"></div>
          <h2>Schedule an Appointment</h2>
        </div>

        {msg.text && (
          <div className={`alert alert-${msg.type === 'error' ? 'error' : 'success'}`} style={{ marginBottom: '24px', borderRadius: '12px' }}>
             {msg.text}
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Select Doctor</label>
          <select className="input-saas" value={form.doctorId} onChange={handleDocChange}>
            <option value="">Choose a specialist...</option>
            {doctors.map(d => (
              <option key={d._id} value={d._id}>Dr. {d.name} ({d.specialization || 'General'})</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Appointment Date</label>
          <input type="date" className="input-saas" min={new Date().toISOString().split('T')[0]} value={form.date} onChange={handleDateChange} />
        </div>

        {slotsLoading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}><div className="spinner" /></div>
        ) : slots.length > 0 ? (
          <>
            <div className="animate-in">
              <label className="form-label">Available Time Slots</label>
              <div className="slot-grid-elite">
                {slots.map(slot => (
                  <div
                    key={slot.index}
                    className={`slot-card ${!slot.available ? 'booked' : form.slotIndex === slot.index ? 'selected' : ''}`}
                    onClick={() => slot.available && setForm(f => ({ ...f, slotIndex: slot.index }))}
                  >
                    <div style={{ fontSize: '1.1rem' }}>{slot.label}</div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 500, opacity: 0.8 }}>
                      {slot.available ? 'Available' : 'Reserved'}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '40px' }}>
                <button className="btn btn-primary btn-full" disabled={form.slotIndex === null} onClick={handleBook}>
                  Book Appointment
                </button>
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '24px' }}>
              <label className="form-label">Describe your Issue / Reason</label>
              <textarea 
                className="input-saas" 
                rows={3} 
                placeholder="e.g. Fever since 2 days, persistent headache..." 
                value={form.reason}
                onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
              />
            </div>
          </>
        ) : form.doctorId && form.date ? (
          <div style={{ padding: '40px', textAlign: 'center', background: 'var(--bg-app)', borderRadius: '16px' }}>
            <p>No slots available for this doctor on the selected date.</p>
          </div>
        ) : (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <p>Select a doctor and date to view availability.</p>
          </div>
        )}
      </div>

      <div style={{ marginTop: '32px', padding: '24px', background: 'var(--p-50)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--p-500)', display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div style={{ fontSize: '0.875rem', color: 'var(--p-700)', fontWeight: 500 }}>
          <strong>Pro-Tip:</strong> Morning slots (9:00 AM - 11:00 AM) are usually less crowded. Secure your spot early!
        </div>
      </div>
    </div>
  );
};
window.BookAppointment = BookAppointment;
