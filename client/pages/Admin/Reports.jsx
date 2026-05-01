/** pages/Admin/Reports.jsx – Premium Analytics UI */
const Reports = () => {
  const [report, setReport] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const apptChartRef = React.useRef(null);
  const stockChartRef = React.useRef(null);
  const apptChart = React.useRef(null);
  const stockChart = React.useRef(null);

  React.useEffect(() => {
    window.api.get('/api/admin/reports')
      .then(setReport).catch(console.error).finally(() => setLoading(false));
  }, []);

  React.useEffect(() => {
    if (!report) return;

    // Destroy old charts
    if (apptChart.current) { apptChart.current.destroy(); apptChart.current = null; }
    if (stockChart.current) { stockChart.current.destroy(); stockChart.current = null; }

    // Appointment doughnut
    if (apptChartRef.current) {
      apptChart.current = new Chart(apptChartRef.current, {
        type: 'doughnut',
        data: {
          labels: ['Pending', 'Accepted', 'Rejected'],
          datasets: [{
            data: [
              report.appointments.pending,
              report.appointments.accepted,
              report.appointments.rejected,
            ],
            backgroundColor: ['#FBBF24', '#3D8F3D', '#F87171'],
            borderWidth: 3,
            borderColor: '#fff',
            hoverBorderColor: '#fff',
            hoverOffset: 6,
          }],
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          cutout: '68%',
          plugins: {
            legend: {
              position: 'bottom',
              labels: { padding: 16, font: { family: 'DM Sans', size: 12 }, usePointStyle: true, pointStyleWidth: 10 },
            },
            tooltip: {
              callbacks: {
                label: ctx => ` ${ctx.label}: ${ctx.parsed} appointments`,
              },
            },
          },
        },
      });
    }

    // Stock bar chart
    if (stockChartRef.current && report.inventory.length > 0) {
      const labels = report.inventory.map(i => i.medicineName);
      const data = report.inventory.map(i => i.quantity);
      const colors = data.map(q =>
        q === 0 ? '#F87171' : q < 20 ? '#FBBF24' : '#5AA85A'
      );
      stockChart.current = new Chart(stockChartRef.current, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Units in Stock',
            data, backgroundColor: colors,
            borderRadius: 6,
            borderSkipped: false,
            barThickness: 28,
          }],
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: ctx => ` ${ctx.parsed.y} ${report.inventory[ctx.dataIndex]?.unit || 'units'}`,
              },
            },
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { font: { family: 'DM Sans', size: 11 }, color: '#A8A89C' },
            },
            y: {
              beginAtZero: true,
              grid: { color: '#F4F4F0' },
              ticks: { font: { family: 'DM Sans', size: 11 }, color: '#A8A89C' },
            },
          },
        },
      });
    }

    return () => {
      if (apptChart.current) apptChart.current.destroy();
      if (stockChart.current) stockChart.current.destroy();
    };
  }, [report]);

  if (loading) return <div className="ds-spinner-wrap"><div className="ds-spinner" /></div>;
  if (!report) return (
    <div className="ds-alert ds-alert-error">
      <span>Failed to load report data.</span>
    </div>
  );

  const { appointments, inventory, pendingRequests } = report;
  const lowStockItems = inventory.filter(i => i.quantity < 20);

  const tiles = [
    { label: 'Total Appointments', value: appointments.total, bg: 'var(--blue-50)', color: 'var(--blue-600)' },
    { label: 'Accepted', value: appointments.accepted, bg: 'var(--g-50)', color: 'var(--g-700)' },
    { label: 'Pending', value: appointments.pending, bg: 'var(--amber-50)', color: 'var(--amber-700)' },
    { label: 'Rejected', value: appointments.rejected, bg: 'var(--red-50)', color: 'var(--red-600)' },
    { label: 'Medicine Types', value: inventory.length, bg: 'var(--ol-50)', color: 'var(--ol-600)' },
    { label: 'Pending Requests', value: pendingRequests, bg: 'var(--amber-50)', color: 'var(--amber-700)' },
  ];

  return (
    <div>
      {/* ── Page Header ── */}
      <div className="ds-page-head ds-anim-1">
        <div>
          <h1 className="ds-page-title">System Analytics</h1>
          <p className="ds-page-sub">Live overview of dispensary operations and inventory health.</p>
        </div>
        <div style={{ fontSize: 12.5, color: 'var(--n-400)' }}>
          Last updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </div>
      </div>

      {/* ── KPI Tiles ── */}
      <div className="ds-stats ds-anim-1">
        {tiles.map((t, idx) => (
          <div className="ds-stat" key={idx} style={{ borderLeft: `3px solid ${t.color}22` }}>
            <div className="ds-stat-val" style={{ color: t.color }}>{t.value}</div>
            <div className="ds-stat-lbl">{t.label}</div>
          </div>
        ))}
      </div>

      {/* ── Charts Row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20, marginBottom: 22 }} className="ds-anim-2">
        {/* Doughnut */}
        <div className="ds-card">
          <div className="ds-card-header">
            <div className="ds-card-header-left">
              <div>
                <div className="ds-card-title">Appointment Status</div>
                <div className="ds-card-sub">Distribution overview</div>
              </div>
            </div>
          </div>
          <div style={{ padding: '24px 24px 20px' }}>
            {/* Center metric */}
            <div style={{ textAlign: 'center', marginBottom: 4 }}>
              <div style={{ fontSize: 11, color: 'var(--n-400)', textTransform: 'uppercase', letterSpacing: '.6px', fontWeight: 600, marginBottom: 2 }}>Total</div>
              <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--n-800)', letterSpacing: '-.5px' }}>{appointments.total}</div>
            </div>
            <div className="ds-chart">
              <canvas ref={apptChartRef} id="chart-appointments" />
            </div>
            {/* Quick legend */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 8 }}>
              {[
                { color: '#FBBF24', label: `${appointments.pending} Pending` },
                { color: '#3D8F3D', label: `${appointments.accepted} Accepted` },
                { color: '#F87171', label: `${appointments.rejected} Rejected` },
              ].map(l => (
                <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--n-500)' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: l.color }} />
                  {l.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bar chart */}
        <div className="ds-card">
          <div className="ds-card-header">
            <div className="ds-card-header-left">
              <div>
                <div className="ds-card-title">Medicine Stock Levels</div>
                <div className="ds-card-sub">Current quantities per medicine</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              {[
                { color: '#5AA85A', label: 'In Stock (≥20)' },
                { color: '#FBBF24', label: 'Low (<20)' },
                { color: '#F87171', label: 'Out' },
              ].map(l => (
                <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: 'var(--n-400)' }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: l.color }} />
                  {l.label}
                </div>
              ))}
            </div>
          </div>
          <div style={{ padding: '20px 24px' }}>
            {inventory.length === 0 ? (
              <div className="ds-empty">
                <div className="ds-empty-title">No inventory data</div>
              </div>
            ) : (
              <div className="ds-chart">
                <canvas ref={stockChartRef} id="chart-stock" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Low / Out of Stock Warning ── */}
      {lowStockItems.length > 0 && (
        <div className="ds-warn-section ds-anim-3">
          <div className="ds-warn-head">
            <h3>Low / Out of Stock Medicines</h3>
            <span style={{
              marginLeft: 'auto', padding: '2px 10px',
              background: 'var(--amber-400)', color: '#fff',
              borderRadius: 999, fontSize: 11.5, fontWeight: 700,
            }}>
              {lowStockItems.length} items
            </span>
          </div>
          <div className="ds-table-wrap">
            <table className="ds-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Medicine</th>
                  <th>Quantity</th>
                  <th>Unit</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {lowStockItems.map((item, i) => (
                  <tr key={item._id}>
                    <td className="td-muted">{i + 1}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className="td-name">{item.medicineName}</span>
                      </div>
                    </td>
                    <td>
                      <span className="td-mono" style={{
                        fontWeight: 700,
                        color: item.quantity === 0 ? 'var(--red-600)' : 'var(--amber-700)',
                      }}>
                        {item.quantity}
                      </span>
                    </td>
                    <td className="td-muted">{item.unit}</td>
                    <td>
                      {item.quantity === 0
                        ? <span className="ds-badge ds-badge-red">Out of Stock</span>
                        : <span className="ds-badge ds-badge-amber">Low Stock</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
window.Reports = Reports;