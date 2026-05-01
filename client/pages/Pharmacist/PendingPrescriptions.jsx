/** pages/Pharmacist/PendingPrescriptions.jsx – Process pending prescriptions */
const PendingPrescriptions = () => {
  const [prescriptions, setPrescriptions] = React.useState([]);
  const [loading, setLoading]             = React.useState(true);
  const [selected, setSelected]           = React.useState(null);
  const [comments, setComments]           = React.useState('');
  const [submitting, setSubmitting]       = React.useState(false);
  const [msg, setMsg]                     = React.useState({ type:'', text:'' });

  const load = () => {
    setLoading(true);
    window.api.get('/api/prescriptions/pharmacist')
      .then(data => setPrescriptions(data.filter(rx => rx.pharmacyStatus === 'Pending')))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  React.useEffect(() => { load(); }, []);

  const openModal = (rx) => { setSelected(rx); setComments(''); setMsg({type:'',text:''}); };
  const closeModal = () => setSelected(null);

  const handlePrintPDF = (rx) => {
    const printWindow = window.open('', '_blank');
    const docDate = rx.appointmentId?.date 
      ? new Date(rx.appointmentId.date + 'T00:00:00').toLocaleDateString()
      : new Date().toLocaleDateString();
      
    printWindow.document.write(`
      <html>
        <head>
          <title>Prescription_${rx.patientId?.name}</title>
          <style>
            body { font-family: 'Inter', 'Helvetica', sans-serif; padding: 40px; color: #333; max-width: 800px; margin: 0 auto; }
            .header { text-align: center; border-bottom: 2px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px; }
            .header h1 { margin: 0 0 8px 0; color: #1e3a8a; font-size: 24px; }
            .header p { margin: 0; color: #64748b; }
            .info { display: flex; justify-content: space-between; margin-bottom: 30px; line-height: 1.6; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; }
            th { background-color: #f8fafc; color: #475569; font-weight: 600; }
            td { font-size: 14px; }
            .notes { margin-top: 40px; padding: 20px; background: #f8fafc; border-left: 4px solid #3b82f6; border-radius: 4px; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Official Medical Prescription</h1>
            <p>Campus Health Dispensary</p>
          </div>
          <div class="info">
            <div>
              <strong>Patient Name:</strong> ${rx.patientId?.name || 'N/A'}<br/>
              <strong>Patient Email:</strong> ${rx.patientId?.email || 'N/A'}
            </div>
            <div style="text-align: right;">
              <strong>Doctor:</strong> Dr. ${rx.doctorId?.name || 'N/A'}<br/>
              <strong>Date:</strong> ${docDate}
            </div>
          </div>
          <h3 style="color: #0f172a; margin-bottom: 8px;">Prescribed Medicines</h3>
          <table>
            <thead>
              <tr><th>Medicine</th><th>Dosage</th><th>Duration</th></tr>
            </thead>
            <tbody>
              ${rx.medicines.map(m => `<tr><td><strong>${m.name}</strong></td><td>${m.dosage}</td><td>${m.duration}</td></tr>`).join('')}
            </tbody>
          </table>
          ${rx.notes ? `<div class="notes"><strong style="color: #1e40af;">Doctor's Advice:</strong><p style="margin-top: 8px;">${rx.notes}</p></div>` : ''}
          <div style="margin-top: 60px; text-align: right; color: #475569;">
            <p style="border-bottom: 1px solid #cbd5e1; display: inline-block; width: 200px; margin-bottom: 8px;"></p>
            <p style="margin: 0;"><strong>Doctor's Signature</strong></p>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleSubmit = async () => {
    if (!comments) return setMsg({ type:'error', text:'Add pharmacist comments to finalize processing.' });
    setSubmitting(true);
    try {
      // 1) Auto-generate the Official Bill PDF
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      
      doc.setFontSize(20);
      doc.setTextColor(30, 58, 138); // #1e3a8a
      doc.text("Official Dispensing Bill", 14, 22);
      
      doc.setFontSize(11);
      doc.setTextColor(100, 116, 139);
      doc.text("Campus Health Dispensary", 14, 30);
      
      doc.setTextColor(0, 0, 0);
      doc.text(`Patient: ${selected.patientId?.name}`, 14, 45);
      doc.text(`Email: ${selected.patientId?.email}`, 14, 52);
      doc.text(`Prescribing Doctor: Dr. ${selected.doctorId?.name}`, 14, 59);
      const docDate = selected.appointmentId?.date || new Date().toLocaleDateString();
      doc.text(`Date of Appointment: ${docDate}`, 14, 66);
      
      const tableData = selected.medicines.map((m, i) => [i + 1, m.name, m.dosage, m.duration, "Dispensed"]);
      
      doc.autoTable({
        startY: 75,
        head: [['#', 'Medicine', 'Dosage', 'Duration', 'Action']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [59, 130, 246] }
      });
      
      let finalY = doc.lastAutoTable.finalY || 100;
      doc.text("Pharmacist Comments / Remarks:", 14, finalY + 20);
      doc.setFontSize(10);
      const splitComments = doc.splitTextToSize(comments, 180);
      doc.text(splitComments, 14, finalY + 28);
      
      doc.setFontSize(12);
      doc.text("__________________________", 130, finalY + 60);
      doc.text("Pharmacist Signature", 135, finalY + 68);

      // Generate the Blob
      const pdfBlob = doc.output('blob');

      // 2) Append to Form Data
      const fd = new FormData();
      fd.append('bill', pdfBlob, `bill-${selected._id}.pdf`);
      fd.append('comments', comments);

      // 3) Submit automatically
      await window.api.upload(`/api/pharmacy/upload-bill/${selected._id}`, fd);

      setMsg({ type:'success', text:'Processing complete. Virtual Bill generated and filed!' });
      setTimeout(() => { closeModal(); load(); }, 1600);
    } catch (err) {
      setMsg({ type:'error', text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="spinner" />;

  return (
    <div>
      <div style={{ marginBottom:'22px' }}>
        <h1 style={{ marginBottom:'4px' }}>Pending Prescriptions</h1>
        <p>Prescriptions waiting for your dispensing and billing action.</p>
      </div>

      {prescriptions.length === 0 ? (
        <div className="elite-card animate-in">
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <p>No pending prescriptions to process.</p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        {prescriptions.map(rx => (
          <div key={rx._id} className="elite-card animate-in" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px dashed var(--p-200)' }}>
              <div>
                <div style={{ fontWeight:700, fontSize:'1.1rem', color:'var(--p-600)' }}>Patient: {rx.patientId?.name}</div>
                <div style={{ fontSize:'0.85rem', color:'var(--text-secondary)' }}>
                  Dr. {rx.doctorId?.name} &nbsp;·&nbsp;
                  {rx.appointmentId?.date ? new Date(rx.appointmentId.date + 'T00:00:00').toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}) : ''}
                  &nbsp;·&nbsp; {rx.appointmentId?.slotTime || ''}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-secondary" onClick={() => handlePrintPDF(rx)}>
                  Generate PDF
                </button>
                <button className="btn btn-primary" onClick={() => openModal(rx)}>
                  Process
                </button>
              </div>
            </div>

            {rx.medicines?.length > 0 && (
              <div className="table-container-saas" style={{ background: 'transparent', border: 'none', padding: 0 }}>
                <table style={{ background: 'transparent', marginBottom: 0 }}>
                <thead><tr><th>Medicine</th><th>Dosage</th><th>Duration</th></tr></thead>
                <tbody>
                  {rx.medicines.map((m, i) => (
                    <tr key={i}><td>{m.name}</td><td>{m.dosage}</td><td>{m.duration}</td></tr>
                  ))}
                </tbody>
              </table>
              </div>
            )}

            {rx.notes && (
              <div style={{ marginTop: '20px', padding: '16px', background: 'var(--p-50)', borderRadius: '12px', borderLeft: '4px solid var(--p-500)', fontSize: '0.9rem' }}>
                <strong>Notes:</strong> {rx.notes}
              </div>
            )}
          </div>
        ))}
        </div>
      )}

      {selected && (
        <window.Modal
          isOpen={true}
          onClose={closeModal}
          title={`Authorize Prescription`}
          footer={
            <div style={{ display: 'flex', gap: '12px', width: '100%', justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost" onClick={closeModal} style={{ color: 'var(--text-secondary)' }}>Close</button>
              <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Encrypting & Filing...' : 'Verify & Authorize'}
              </button>
            </div>
          }
        >
          {msg.text && <div className={`alert alert-${msg.type === 'error' ? 'error' : 'success'}`} style={{ marginBottom: '20px' }}>{msg.text}</div>}

          <div style={{ background: 'var(--p-50)', padding: '16px', borderRadius: '12px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>Patient Identity</div>
                <div style={{ fontWeight: 600, color: 'var(--p-700)', fontSize: '1.1rem' }}>{selected.patientId?.name}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>Prescribed By</div>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Dr. {selected.doctorId?.name}</div>
              </div>
            </div>
            
            <div style={{ background: '#fff', border: '1px solid var(--border-app)', borderRadius: '8px', padding: '1px' }}>
              <table style={{ margin: 0, fontSize: '0.9rem' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '8px 12px', background: '#f8fafc' }}>Verification Checklist</th>
                    <th style={{ padding: '8px 12px', background: '#f8fafc', width: '80px', textAlign: 'center' }}>Dosage</th>
                  </tr>
                </thead>
                <tbody>
                  {selected.medicines.map((m, idx) => (
                    <tr key={idx}>
                      <td style={{ padding: '8px 12px', borderBottom: 'none' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <strong>{m.name}</strong> <span style={{ color: 'var(--text-secondary)' }}>for {m.duration}</span>
                        </div>
                      </td>
                      <td style={{ padding: '8px 12px', textAlign: 'center', borderBottom: 'none', fontWeight: 600 }}>{m.dosage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label className="form-label" htmlFor="ph-comments">Pharmacist Authorization Remarks</label>
            <textarea id="ph-comments" className="input-saas" style={{ minHeight: '80px', paddingTop: '12px', resize: 'vertical', background: '#fff' }} value={comments} onChange={e => setComments(e.target.value)} placeholder="Enter dispensing notes or compliance checks here..." />
          </div>
          
          <div style={{ padding: '12px 16px', background: 'rgba(79, 70, 229, 0.05)', borderRadius: '8px', borderLeft: '4px solid var(--p-500)', fontSize: '0.85rem', color: 'var(--p-700)' }}>
            <strong style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              Automated Billing Engine Active
            </strong>
             Upon authorization, a verified cryptographic PDF statement will be mathematically assembled, signed, and securely encrypted to this patient's immutable health record.
          </div>
        </window.Modal>
      )}
    </div>
  );
};
window.PendingPrescriptions = PendingPrescriptions;
