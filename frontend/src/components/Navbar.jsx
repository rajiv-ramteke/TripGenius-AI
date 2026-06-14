import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Compass, User, Menu, LogOut } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  let currentUser = null;
  try {
    currentUser = JSON.parse(localStorage.getItem('currentUser'));
  } catch (e) {}

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  return (
    <nav className="glass" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid var(--border)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Compass color="var(--primary)" size={32} />
        <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>
          TripGenius <span className="text-gradient">AI</span>
        </Link>
      </div>
      
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', fontWeight: 500 }}>
        <Link to="/planner" style={{ transition: 'color 0.2s' }}>Trip Planner</Link>
        <Link to="/destinations" style={{ transition: 'color 0.2s' }}>Destinations</Link>
        <Link to="/dashboard" style={{ transition: 'color 0.2s' }}>Dashboard</Link>
        
        {currentUser ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontWeight: 700, color: 'var(--primary)' }}>Hi, {currentUser.name.split(' ')[0]}</span>
            <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--text-muted)' }}>
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <Link to="/login" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <User size={18} /> Sign In
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
