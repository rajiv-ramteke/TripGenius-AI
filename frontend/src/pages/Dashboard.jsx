import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Map, Wallet, Calendar, Compass, ArrowRight, MapPin, Briefcase } from 'lucide-react';
import { getStorage } from '../utils/storage';

const Dashboard = () => {
  const [recentStates, setRecentStates] = useState([]);
  const [exploredCount, setExploredCount] = useState(0);
  const [completedTripsCount, setCompletedTripsCount] = useState(0);
  const [upcomingPlansCount, setUpcomingPlansCount] = useState(0);
  const [agencyBookingsCount, setAgencyBookingsCount] = useState(0);
  const [userName, setUserName] = useState('Traveler');

  useEffect(() => {
    try {
      const saved = getStorage('recentStates');
      setRecentStates(saved.slice(0, 3)); // Only show top 3 on dashboard
      
      const explored = getStorage('exploredStates');
      setExploredCount(explored.length);

      const completed = getStorage('completedTrips');
      setCompletedTripsCount(completed.length);

      const upcoming = getStorage('upcomingPlans');
      setUpcomingPlansCount(upcoming.length);

      const bookings = getStorage('agencyBookings');
      setAgencyBookingsCount(bookings.length);

      const user = JSON.parse(localStorage.getItem('currentUser'));
      if (user && user.name) {
        setUserName(user.name.split(' ')[0]); // Use first name if possible
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const stats = [
    { icon: <Map size={24} color="#3b82f6" />, label: "States Explored", value: exploredCount.toString() },
    { icon: <Wallet size={24} color="#10b981" />, label: "Sasta Trips Completed", value: completedTripsCount.toString() },
    { icon: <Calendar size={24} color="#8b5cf6" />, label: "Upcoming Plans", value: upcomingPlansCount.toString() },
    { icon: <Briefcase size={24} color="#f59e0b" />, label: "Active Bookings", value: agencyBookingsCount.toString() },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem' }}>
      
      {/* Welcome Section */}
      <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Namaste, <span className="text-gradient">{userName}!</span></h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '0.5rem' }}>Here is a summary of your Gramin journeys.</p>
        </div>
        <Link to="/planner" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem' }}>
          <Compass size={20} /> Plan New Trip
        </Link>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
        {stats.map((stat, idx) => (
          <div key={idx} style={{ 
            background: 'white', 
            padding: '2rem', 
            borderRadius: '16px', 
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            border: '1px solid var(--border)'
          }}>
            <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '12px' }}>
              {stat.icon}
            </div>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.25rem' }}>{stat.label}</p>
              <h3 style={{ fontSize: '2rem', fontWeight: 800 }}>{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Recently Viewed States Section */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Recently Viewed States</h2>
          <Link to="/destinations?filter=recent" style={{ color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            View All <ArrowRight size={18} />
          </Link>
        </div>
        
        {recentStates.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '16px', border: '1px solid var(--border)' }}>
            <Compass size={40} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>You haven't viewed any states yet.</p>
            <Link to="/destinations" className="btn btn-primary" style={{ marginTop: '1.5rem', display: 'inline-block' }}>
              Explore Destinations
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {recentStates.map((state, idx) => (
              <Link to={`/states/${encodeURIComponent(state.name)}`} key={idx} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{
                  background: 'white',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-sm)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }}>
                  <div style={{ height: '140px', width: '100%', background: state.gradient || 'linear-gradient(135deg, #e0e7ff, #c7d2fe)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '4rem' }}>{state.emoji || '🗺️'}</span>
                  </div>
                  <div style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.5rem' }}>{state.name}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 500 }}>
                      <MapPin size={16} /> Capital: {state.capital || 'Unknown'}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Dashboard;
