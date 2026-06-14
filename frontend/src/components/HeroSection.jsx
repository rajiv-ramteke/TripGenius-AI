import { Link } from 'react-router-dom';
import { MapPin, Calendar, Sparkles } from 'lucide-react';

const HeroSection = () => {
  return (
    <div style={{
      padding: '6rem 2rem',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '2rem'
    }} className="animate-fade-in-up">

      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#f1f5f9', borderRadius: '20px', color: 'var(--primary)', fontWeight: 600, fontSize: '0.875rem' }}>
        <Sparkles size={16} /> Turn Your Travel Dreams Into Reality
      </div>

      <h1 style={{ fontSize: '4rem', fontWeight: 800, lineHeight: 1.1, maxWidth: '800px' }}>
        Describe Your <span className="text-gradient">Dream Trip.</span><br/>Let AI Plan Everything.
      </h1>
      
      <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '600px' }}>
        TripGenius AI is a smart travel agent that generates personalized itineraries, budgets, packing lists, and journals in seconds.
      </p>
      
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <Link to="/planner" className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '1.125rem' }}>
          <MapPin size={20} /> Start Planning Free
        </Link>
        <Link to="/destinations" className="btn btn-secondary" style={{ padding: '16px 32px', fontSize: '1.125rem' }}>
          <Calendar size={20} /> Explore Destinations
        </Link>
      </div>
    </div>
  );
};

export default HeroSection;
