import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { STATE_DESTINATIONS, INDIA_STATES } from '../data/indiaData';
import { MapPin, ArrowLeft, Hotel, Tag } from 'lucide-react';
import { getStorage, setStorage } from '../utils/storage';

const StateDestinations = () => {
  const { stateName } = useParams();
  const destinations = STATE_DESTINATIONS[stateName] || [];
  const stateData = INDIA_STATES.find(s => s.name === stateName);

  useEffect(() => {
    if (stateData) {
      try {
        const saved = getStorage('recentStates');
        // Remove if already exists to put it at the front
        const filtered = saved.filter(s => s.name !== stateData.name);
        // Keep up to 50 recent states
        const updated = [stateData, ...filtered].slice(0, 50);
        setStorage('recentStates', updated);

        // Update exploredStates
        const explored = getStorage('exploredStates');
        if (!explored.includes(stateData.name)) {
          explored.push(stateData.name);
          setStorage('exploredStates', explored);
        }
      } catch (e) {
        console.error("Could not save to localStorage", e);
      }
    }
  }, [stateData]);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem' }}>

      {/* Back Link */}
      <Link
        to="/destinations"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontWeight: 600, marginBottom: '2rem', textDecoration: 'none' }}
      >
        <ArrowLeft size={18} /> Back to All States
      </Link>

      {/* State Hero Banner */}
      {stateData && (
        <div style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', marginBottom: '3rem', height: '220px' }}>
          <img
            src={stateData.image}
            alt={stateName}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={e => { e.target.style.display = 'none'; }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to right, rgba(0,0,0,0.75) 50%, rgba(0,0,0,0.2))',
            display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '2.5rem'
          }}>
            <h1 style={{ fontSize: '2.8rem', fontWeight: 800, color: 'white', margin: 0, lineHeight: 1.2 }}>
              Destinations in{' '}
              <span style={{ color: '#fbbf24' }}>{stateName}</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.85)', marginTop: '0.75rem', fontSize: '1.1rem' }}>
              {destinations.length > 0
                ? `${destinations.length} amazing place${destinations.length > 1 ? 's' : ''} to explore`
                : 'Destinations coming soon!'}
            </p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {destinations.length === 0 && (
        <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'white', borderRadius: '16px', border: '1px solid var(--border)' }}>
          <p style={{ fontSize: '3rem' }}>🗺️</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginTop: '1rem' }}>
            We are adding destinations for <strong>{stateName}</strong> soon.
          </p>
          <Link to="/destinations" className="btn btn-primary" style={{ display: 'inline-flex', marginTop: '1.5rem', padding: '0.75rem 2rem' }}>
            Explore Other States
          </Link>
        </div>
      )}

      {/* Destination Cards - 2 column layout: Info + Map side by side */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        {destinations.map((dest, idx) => (
          <div
            key={idx}
            style={{
              background: 'white',
              borderRadius: '20px',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-sm)',
              overflow: 'hidden',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              minHeight: '360px',
            }}
          >
            {/* LEFT: Info Panel */}
            <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
              {/* Name + Budget */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>
                  {dest.name}
                </h2>
                <span style={{
                  background: '#f0fdf4', color: '#166534',
                  padding: '5px 14px', borderRadius: '20px',
                  fontWeight: 700, fontSize: '0.85rem',
                  border: '1px solid #bbf7d0', whiteSpace: 'nowrap', flexShrink: 0
                }}>
                  {dest.budget}
                </span>
              </div>

              {/* Tags */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                {dest.tags.map((tag, tIdx) => (
                  <span key={tIdx} style={{
                    background: '#f1f5f9', color: '#475569',
                    padding: '3px 10px', borderRadius: '12px',
                    fontSize: '0.78rem', fontWeight: 600,
                    display: 'inline-flex', alignItems: 'center', gap: '4px'
                  }}>
                    <Tag size={11} /> {tag}
                  </span>
                ))}
              </div>

              {/* Description */}
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.65, fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                {dest.description}
              </p>

              {/* Hotels */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--foreground)' }}>
                  <Hotel size={16} color="var(--primary)" /> Budget Stays
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  {dest.hotels.map((hotel, hIdx) => (
                    <div key={hIdx} style={{
                      padding: '0.55rem 0.9rem',
                      background: '#f8fafc', borderRadius: '8px',
                      border: '1px solid var(--border)',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}>
                      <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{hotel.name}</span>
                      <span style={{
                        color: 'var(--primary)', fontWeight: 700, fontSize: '0.82rem',
                        background: 'white', padding: '3px 10px',
                        borderRadius: '20px', border: '1px solid var(--border)', whiteSpace: 'nowrap'
                      }}>
                        {hotel.price}/night
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div style={{ marginTop: 'auto' }}>
                <Link
                  to={`/itinerary?destination=${encodeURIComponent(dest.name)}&state=${encodeURIComponent(stateName)}`}
                  className="btn btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '0.85rem 1.75rem', fontSize: '1rem', width: '100%', justifyContent: 'center' }}
                >
                  <MapPin size={18} /> Plan Full Trip to {dest.name}
                </Link>
              </div>
            </div>

            {/* RIGHT: Google Map */}
            <div style={{ position: 'relative', minHeight: '360px' }}>
              <iframe
                title={`Map of ${dest.name}`}
                width="100%"
                height="100%"
                style={{ border: 0, display: 'block', minHeight: '360px' }}
                loading="lazy"
                allowFullScreen
                src={`https://maps.google.com/maps?q=${encodeURIComponent(dest.name + ', ' + stateName + ', India')}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
              />
              {/* Map label */}
              <div style={{
                position: 'absolute', top: '12px', left: '12px',
                background: 'white', padding: '6px 12px',
                borderRadius: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                display: 'flex', alignItems: 'center', gap: '5px',
                fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)'
              }}>
                <MapPin size={13} /> {dest.name}, {stateName}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StateDestinations;
