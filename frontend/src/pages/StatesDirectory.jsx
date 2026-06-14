import { Link, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { INDIA_STATES } from '../data/indiaData';
import { getStorage } from '../utils/storage';

const StatesDirectory = () => {
  const [searchParams] = useSearchParams();
  const filter = searchParams.get('filter');
  const [displayedStates, setDisplayedStates] = useState(INDIA_STATES);
  
  useEffect(() => {
    if (filter === 'recent') {
      try {
        const saved = getStorage('recentStates');
        setDisplayedStates(saved);
      } catch (e) {
        setDisplayedStates(INDIA_STATES);
      }
    } else {
      setDisplayedStates(INDIA_STATES);
    }
  }, [filter]);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800 }}>
          {filter === 'recent' ? (
            <>Your <span className="text-gradient">Recently Viewed States</span></>
          ) : (
            <>Explore <span className="text-gradient">Incredible India</span></>
          )}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginTop: '1rem' }}>
          {filter === 'recent' 
            ? "Here are the states you've been checking out lately." 
            : "Select a state to discover amazing destinations, budgets, and affordable stays."}
        </p>
      </div>

      {displayedStates.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', fontSize: '1.2rem' }}>
          You haven't viewed any states recently.
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '1.5rem'
        }}>
          {displayedStates.map((state, idx) => (
          <Link key={idx} to={`/states/${encodeURIComponent(state.name)}`} style={{ textDecoration: 'none' }}>
            <div
              style={{
                background: 'white',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                cursor: 'pointer',
                border: '1px solid rgba(0,0,0,0.06)'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)';
              }}
            >
              {/* Cultural gradient banner */}
              <div style={{
                height: '130px',
                width: '100%',
                background: state.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Decorative circle pattern */}
                <div style={{
                  position: 'absolute', top: '-20px', right: '-20px',
                  width: '90px', height: '90px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.12)'
                }} />
                <div style={{
                  position: 'absolute', bottom: '-15px', left: '-15px',
                  width: '60px', height: '60px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.10)'
                }} />
                <span style={{
                  fontSize: '3.2rem',
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.25))',
                  zIndex: 1,
                  lineHeight: 1
                }}>
                  {state.emoji}
                </span>
              </div>

              {/* State info */}
              <div style={{ padding: '1rem 1.2rem', textAlign: 'center' }}>
                <h3 style={{
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  color: 'var(--foreground)',
                  marginBottom: '0.2rem'
                }}>
                  {state.name}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                  🏛️ {state.capital}
                </p>
              </div>
            </div>
          </Link>
        ))}
        </div>
      )}
    </div>
  );
};

export default StatesDirectory;
