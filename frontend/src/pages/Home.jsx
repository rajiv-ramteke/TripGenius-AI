import HeroSection from '../components/HeroSection';
import FeatureCard from '../components/FeatureCard';
import { Compass, Wallet, Briefcase, Map } from 'lucide-react';

const Home = () => {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem 4rem 2rem' }}>
      <HeroSection />
      
      <div style={{ marginTop: '4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Everything You Need for the Perfect Trip</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>Powered by advanced Multi-Agent AI architecture</p>
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '2rem' 
        }}>
          <FeatureCard 
            icon={<Map size={32} />}
            title="Smart Itineraries"
            description="Get day-by-day activity schedules personalized to your exact interests and travel style."
          />
          <FeatureCard 
            icon={<Wallet size={32} />}
            title="Budget Forecasting"
            description="Our Budget Agent predicts costs for hotels, food, and transport with real-time accuracy."
          />
          <FeatureCard 
            icon={<Briefcase size={32} />}
            title="Packing Assistant"
            description="Never forget the essentials. Get tailored packing lists based on your destination's weather."
          />
          <FeatureCard 
            icon={<Compass size={32} />}
            title="Hidden Gems"
            description="Discover off-the-beaten-path locations recommended by our Destination Agent."
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
