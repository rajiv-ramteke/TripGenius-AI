import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
const destinations = [
  {
    name: "Varanasi",
    state: "Uttar Pradesh",
    description: "The spiritual capital of India. Extremely affordable stays, holy Ganga ghats, and rich culture. Perfect for Gramin travelers seeking peace and devotion.",
    cost: "₹3,000 - ₹5,000",
    image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Ujjain",
    state: "Madhya Pradesh",
    description: "Home to the Mahakaleshwar Jyotirlinga. Experience grand aartis and local Malwa culture in a budget-friendly city.",
    cost: "₹2,500 - ₹4,000",
    image: "https://images.unsplash.com/photo-1623864500584-c68962649a37?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Rishikesh",
    state: "Uttarakhand",
    description: "The Yoga Capital beside the holy Ganges. Peaceful ashrams, affordable food, and beautiful Himalayan foothills.",
    cost: "₹3,500 - ₹6,000",
    image: "https://images.unsplash.com/photo-1595160841263-d3c5f573d8ab?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Puri",
    state: "Odisha",
    description: "Visit the sacred Jagannath Temple and enjoy beautiful clean beaches. Extremely welcoming for religious and budget trips.",
    cost: "₹3,000 - ₹5,500",
    image: "https://images.unsplash.com/photo-1634563853127-d4624a0d9b4b?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Haridwar",
    state: "Uttarakhand",
    description: "Gateway to the Gods. Famous for the evening Ganga Aarti at Har Ki Pauri and deep cultural roots.",
    cost: "₹2,000 - ₹4,000",
    image: "https://images.unsplash.com/photo-1582260655325-1e3a6a9b4d32?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Dwarka",
    state: "Gujarat",
    description: "The legendary city of Lord Krishna. A serene coastal city that offers affordable pilgrimage and rich history.",
    cost: "₹3,500 - ₹6,000",
    image: "https://images.unsplash.com/photo-1628186259062-8e7c11fba82e?auto=format&fit=crop&w=800&q=80"
  }
];

const Destinations = () => {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800 }}>
          Popular <span className="text-gradient">Bharat Darshan</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginTop: '1rem' }}>
          Discover beautiful, deeply cultural, and affordable destinations across Indian States.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2.5rem'
      }}>
        {destinations.map((dest, idx) => (
          <div key={idx} style={{
            background: 'white',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-md)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            cursor: 'pointer'
          }}
          className="destination-card"
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
          }}
          >
            <div style={{ height: '200px', width: '100%', overflow: 'hidden' }}>
              <img 
                src={dest.image} 
                alt={dest.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
              />
            </div>
            
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--foreground)', marginBottom: '0.25rem' }}>
                    {dest.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary)', fontWeight: 600 }}>
                    <MapPin size={16} />
                    <span>{dest.state}</span>
                  </div>
                </div>
                <div style={{ background: '#f0fdf4', color: '#16a34a', padding: '0.25rem 0.75rem', borderRadius: '20px', fontWeight: 700, fontSize: '0.9rem' }}>
                  Sasta
                </div>
              </div>
              
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.5rem', flexGrow: 1 }}>
                {dest.description}
              </p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                <div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Estimated Cost</p>
                  <p style={{ fontWeight: 700, color: 'var(--foreground)' }}>{dest.cost}</p>
                </div>
                <Link to={`/itinerary?destination=${encodeURIComponent(dest.name)}&state=${encodeURIComponent(dest.state)}`} className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
                  Plan Trip
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Destinations;
