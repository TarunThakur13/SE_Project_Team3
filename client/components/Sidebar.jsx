/** pages/Sidebar.jsx – Premium Sidebar Navigation */
const Sidebar = ({ user, activeTab, setActiveTab, onLogout, pendingCount = 0 }) => {
    const navMap = {
        admin: [
            { id: 'doctors', label: 'Manage Staff' },
            { id: 'inventory', label: 'Inventory' },
            { id: 'requests', label: 'Requests', badge: pendingCount },
            { id: 'reports', label: 'Analytics' },
        ],
        doctor: [
            { id: 'requests', label: 'Appointments' },
            { id: 'today', label: 'Patients' },
            { id: 'prescriptions', label: 'Clinical History' },
        ],
        pharmacist: [
            { id: 'pending', label: 'Order Queue' },
            { id: 'records', label: 'Dispensing Logs' },
            { id: 'request', label: 'Inventory Request' },
        ],
        patient: [
            { id: 'book', label: 'Book Appointment' },
            { id: 'appointments', label: 'My Bookings' },
            { id: 'prescriptions', label: 'Medical History' },
        ],
    };

    const items = navMap[user?.role] || navMap.admin;
    const initial = user?.name ? user.name[0].toUpperCase() : '?';
    const role = user?.role || 'admin';

    return (
        <aside className="ds-sidebar">
            {/* Logo */}
            <div className="ds-sidebar-logo">
                <div className="ds-logo-mark">
                    <div className="ds-logo-icon" style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>MC</div>
                    <div className="ds-logo-text">
                        <span className="ds-logo-name">MedCampus</span>
                        <span className="ds-logo-sub">Dispensary Portal</span>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="ds-nav">
                <div className="ds-nav-section">Navigation</div>
                {items.map(item => (
                    <button
                        key={item.id}
                        className={`ds-nav-item ${activeTab === item.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(item.id)}
                    >
                        <span style={{ flex: 1, paddingLeft: 8 }}>{item.label}</span>
                        {item.badge > 0 && (
                            <span className="ds-nav-item-badge">{item.badge}</span>
                        )}
                    </button>
                ))}
            </nav>

            {/* User footer */}
            <div className="ds-sidebar-footer">
                <div className="ds-user-tile">
                    <div className="ds-avatar">{initial}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="ds-user-name">{user?.name || 'User'}</div>
                        <div className="ds-user-role">{role}</div>
                    </div>
                    <button
                        className="ds-logout-btn"
                        title="Sign out"
                        onClick={onLogout}
                        style={{ fontSize: 12, fontWeight: 800 }}
                    >
                        LOGOUT
                    </button>
                </div>
            </div>
        </aside>
    );
};
window.Sidebar = Sidebar;