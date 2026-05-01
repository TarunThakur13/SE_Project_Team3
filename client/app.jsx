/**
 * app.jsx – Root application component.
 * Reads JWT from localStorage on load.
 * Routes to the correct role dashboard or the login page.
 */

const App = () => {
  const [user, setUser] = React.useState(() => window.api.getUser());

  /* ── Login handler ── */
  const handleLogin = (userData) => {
    setUser(userData);
  };

  /* ── Logout handler ── */
  const handleLogout = () => {
    window.api.clearToken();
    window.api.clearUser();
    setUser(null);
  };

  /* ── Render correct dashboard based on role ── */
  const renderDashboard = () => {
    if (!user) return <window.Login onLogin={handleLogin} />;

    switch (user.role) {
      case 'patient':
        return <window.PatientDashboard user={user} onLogout={handleLogout} />;
      case 'doctor':
        return <window.DoctorDashboard user={user} onLogout={handleLogout} />;
      case 'pharmacist':
        return <window.PharmacistDashboard user={user} onLogout={handleLogout} />;
      case 'admin':
        return <window.AdminDashboard user={user} onLogout={handleLogout} />;
      default:
        return (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <p>Unknown role: {user.role}</p>
            <button className="btn btn-danger" onClick={handleLogout}>Sign Out</button>
          </div>
        );
    }
  };

  return renderDashboard();
};

/* ── Mount to DOM ── */
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
