/** pages/Login.jsx – Premium Login / Register */
const Login = ({ onLogin }) => {
  const [isLogin, setIsLogin] = React.useState(true);
  const [form, setForm] = React.useState({ name: '', email: '', password: '', role: 'patient' });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const roles = [
    { id: 'patient', label: 'Patient' },
    { id: 'doctor', label: 'Doctor' },
    { id: 'pharmacist', label: 'Pharmacist' },
    { id: 'admin', label: 'Admin' },
  ];

  const demoCredentials = {
    patient: { email: 'patient@dispensary.com', password: 'patient123' },
    doctor: { email: 'doctor@dispensary.com', password: 'doctor123' },
    pharmacist: { email: 'pharmacist@dispensary.com', password: 'pharma123' },
    admin: { email: 'admin@dispensary.com', password: 'admin123' },
  };

  const fillDemo = () => setForm(f => ({ ...f, ...demoCredentials[f.role] }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password, role: form.role };

      const data = await window.api.post(endpoint, payload);

      if (isLogin && data.user.role !== form.role) {
        setError(`Access restricted. You are registered as a ${data.user.role}.`);
        return;
      }
      window.api.setToken(data.token);
      window.api.setUser(data.user);

      // Dispatch Email Notification
      if (window.mailer) {
        window.mailer.sendLoginNotification(data.user.email, data.user.name, data.user.role);
      }

      onLogin(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <window.DispensaryStyles />
      <div style={{
        minHeight: '100vh', display: 'flex',
        background: 'var(--n-50)',
        fontFamily: 'var(--font-sans)',
      }}>

        {/* ── Visual Left Panel ── */}
        <div style={{
          width: '44%', minHeight: '100vh',
          background: 'var(--g-700)',
          position: 'relative', overflow: 'hidden',
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
          padding: '48px',
        }}>
          {/* Mesh pattern */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `
              radial-gradient(circle at 20% 25%, rgba(255,255,255,.07) 0%, transparent 45%),
              radial-gradient(circle at 80% 75%, rgba(0,0,0,.18) 0%, transparent 55%)
            `,
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `
              linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px)
            `,
            backgroundSize: '44px 44px',
          }} />
          {/* Decorative circles */}
          <div style={{
            position: 'absolute', top: -60, right: -60,
            width: 280, height: 280, borderRadius: '50%',
            border: '1px solid rgba(255,255,255,.06)',
          }} />
          <div style={{
            position: 'absolute', top: 20, right: -20,
            width: 160, height: 160, borderRadius: '50%',
            border: '1px solid rgba(255,255,255,.06)',
          }} />

          <div style={{ position: 'relative', zIndex: 1 }} className="ds-anim-1">
            {/* Badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,.1)', padding: '6px 14px',
              borderRadius: 999, fontSize: 11.5, fontWeight: 600,
              color: 'rgba(255,255,255,.8)', letterSpacing: '.5px',
              textTransform: 'uppercase', marginBottom: 24,
              backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,.12)',
            }}>
              Campus Health Portal
            </div>

            <h1 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 40, fontWeight: 600, color: '#fff',
              lineHeight: 1.2, marginBottom: 16, letterSpacing: '-.5px',
            }}>
              Healthcare,<br />made simple.
            </h1>

            <p style={{
              color: 'rgba(255,255,255,.68)', fontSize: 15,
              lineHeight: 1.7, marginBottom: 36, maxWidth: 340,
            }}>
              The all-in-one platform connecting patients, doctors and pharmacists across your campus.
            </p>

            {/* Feature tiles */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { title: 'Instant Booking', desc: 'Schedule in under a minute.' },
                { title: 'Secure Records', desc: 'Encrypted, always private.' },
                { title: 'Smart Inventory', desc: 'Real-time stock & alerts.' },
                { title: 'Live Analytics', desc: 'Operational insights daily.' },
              ].map(f => (
                <div key={f.title} style={{
                  background: 'rgba(255,255,255,.07)', padding: '14px 16px',
                  borderRadius: 'var(--r-md)',
                  border: '1px solid rgba(255,255,255,.1)', backdropFilter: 'blur(8px)',
                }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: '#fff', marginBottom: 3 }}>{f.title}</div>
                  <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,.5)', lineHeight: 1.5 }}>{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Form Right Panel ── */}
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '40px 48px',
        }}>
          <div style={{ width: '100%', maxWidth: 420 }} className="ds-anim-2">

            {/* Header */}
            <div style={{ marginBottom: 32 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 'var(--r-md)',
                background: 'var(--g-600)', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 20,
                boxShadow: '0 4px 12px rgba(46,115,48,.3)',
              }}>MC</div>
              <h2 style={{ fontSize: 24, fontWeight: 600, color: 'var(--n-800)', letterSpacing: '-.4px', marginBottom: 6 }}>
                {isLogin ? 'Welcome back' : 'Create account'}
              </h2>
              <p style={{ fontSize: 14, color: 'var(--n-400)' }}>
                {isLogin ? 'Sign in to access your workspace.' : 'Join MedCampus today.'}
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="ds-alert ds-alert-error">
                <span>{error}</span>
              </div>
            )}

            {/* Role Selector */}
            <div style={{ marginBottom: 24 }}>
              <div className="ds-label" style={{ marginBottom: 10 }}>Select your role</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6 }}>
                {roles.map(r => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, role: r.id }))}
                    style={{
                      padding: '10px 4px', borderRadius: 'var(--r-md)',
                      border: form.role === r.id ? '2px solid var(--g-500)' : '1px solid var(--n-200)',
                      background: form.role === r.id ? 'var(--g-50)' : 'var(--n-0)',
                      cursor: 'pointer', fontFamily: 'var(--font-sans)',
                      transition: 'all .12s',
                      boxShadow: form.role === r.id ? '0 0 0 3px rgba(61,143,61,.1)' : 'none',
                    }}
                  >
                    <div style={{
                      fontSize: 12, fontWeight: form.role === r.id ? 700 : 500,
                      color: form.role === r.id ? 'var(--g-700)' : 'var(--n-500)',
                      padding: '8px 0',
                    }}>{r.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} autoComplete="off">
              {!isLogin && (
                <div className="ds-form-group">
                  <label className="ds-label">Full Name <span className="req">*</span></label>
                  <input
                    type="text" className="ds-input"
                    placeholder="Dr. Priya Sharma"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    required={!isLogin}
                  />
                </div>
              )}

              <div className="ds-form-group">
                <label className="ds-label">Email Address <span className="req">*</span></label>
                <input
                  type="email" className="ds-input"
                  placeholder="you@college.edu"
                  value={form.email} autoComplete="off"
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  required
                />
              </div>

              <div className="ds-form-group" style={{ marginBottom: 0 }}>
                <label className="ds-label">Password <span className="req">*</span></label>
                <input
                  type="password" className="ds-input"
                  placeholder="••••••••"
                  value={form.password} autoComplete="new-password"
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                />
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'center', // Centers the button horizontally
                marginTop: 20,
              }}>
                <button
                  type="submit"
                  className="ds-btn ds-btn-primary"
                  disabled={loading}
                  style={{
                    width: '100%',
                    maxWidth: '240px',
                    height: '44px'
                  }}
                >
                  {loading ? 'Authenticating…' : isLogin ? 'Sign In' : 'Create Account'}
                </button>
              </div>
            </form>

            {/* Toggle */}
            <div style={{ marginTop: 22, textAlign: 'center', fontSize: 13.5, color: 'var(--n-400)' }}>
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <a
                href="#"
                onClick={e => { e.preventDefault(); setIsLogin(!isLogin); setError(''); }}
                style={{ color: 'var(--g-600)', fontWeight: 700, textDecoration: 'none' }}
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </a>
            </div>

            <div style={{
              marginTop: 32, paddingTop: 24,
              borderTop: '1px solid var(--n-200)',
              textAlign: 'center', fontSize: 13, color: 'var(--n-400)',
            }}>
              Trouble logging in?{' '}
              <a href="#" style={{ color: 'var(--g-600)', fontWeight: 600, textDecoration: 'none' }}>
                Contact IT Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
window.Login = Login;