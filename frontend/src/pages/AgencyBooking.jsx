import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, User, Phone, Mail, Calendar, Users, Briefcase, MapPin, CheckCircle2, IndianRupee } from 'lucide-react';
import { getStorage, setStorage } from '../utils/storage';

const AgencyBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    travelers: 1,
    notes: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Extract booking details from location state or default to empty
  const bookingData = location.state || {
    agencyName: 'Travel Agency',
    destination: 'Destination',
    state: 'State',
    duration: 3,
    budget: '₹5,000'
  };

  useEffect(() => {
    if (!location.state) {
      // If accessed directly without state, redirect to planner or dashboard
      // navigate('/planner');
    }
  }, [location, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Save to localStorage
    try {
      const newBooking = {
        id: Date.now(),
        ...bookingData,
        ...formData,
        status: 'Confirmed',
        bookingDate: new Date().toISOString()
      };
      
      const existingBookings = getStorage('agencyBookings');
      existingBookings.push(newBooking);
      setStorage('agencyBookings', existingBookings);
      
      setIsSubmitted(true);
    } catch (err) {
      console.error("Failed to save booking", err);
    }
  };

  if (isSubmitted) {
    return (
      <div style={{ maxWidth: '800px', margin: '4rem auto', padding: '2rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', background: '#dcfce7', padding: '2rem', borderRadius: '50%', marginBottom: '2rem' }}>
          <CheckCircle2 size={80} color="#16a34a" />
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>Booking Confirmed!</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '2rem' }}>
          Your trip to <strong>{bookingData.destination}</strong> with <strong>{bookingData.agencyName}</strong> has been successfully booked.
        </p>
        <p style={{ marginBottom: '3rem' }}>The agency will contact you shortly at <strong>{formData.phone}</strong> to finalize the payment and itinerary details.</p>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <Link to="/dashboard" className="btn btn-primary" style={{ padding: '0.8rem 2rem', fontSize: '1.1rem' }}>
            Go to Dashboard
          </Link>
          <Link to="/planner" style={{ padding: '0.8rem 2rem', fontSize: '1.1rem', background: '#f1f5f9', color: '#334155', borderRadius: '12px', textDecoration: 'none', fontWeight: 600 }}>
            Plan Another Trip
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '3rem 2rem' }}>
      <button 
        onClick={() => navigate(-1)}
        style={{ background: 'none', border: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontWeight: 600, marginBottom: '2rem', cursor: 'pointer', padding: 0 }}
      >
        <ArrowLeft size={18} /> Back to Itinerary
      </button>

      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem' }}>Complete Your Booking</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 350px', gap: '3rem', alignItems: 'start' }}>
        
        {/* Left Form */}
        <div style={{ background: 'white', padding: '2.5rem', borderRadius: '20px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Traveler Information</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input required type="text" name="name" value={formData.name} onChange={handleChange} style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.5rem', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem' }} placeholder="John Doe" />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>Phone Number</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.5rem', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem' }} placeholder="+91 98765 43210" />
                </div>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input required type="email" name="email" value={formData.email} onChange={handleChange} style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.5rem', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem' }} placeholder="john@example.com" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>Travel Date</label>
                <div style={{ position: 'relative' }}>
                  <Calendar size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input required type="date" name="date" value={formData.date} onChange={handleChange} style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.5rem', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>Number of Travelers</label>
                <div style={{ position: 'relative' }}>
                  <Users size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input required type="number" min="1" max="20" name="travelers" value={formData.travelers} onChange={handleChange} style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.5rem', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem' }} />
                </div>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>Special Requests (Optional)</label>
              <textarea name="notes" value={formData.notes} onChange={handleChange} rows="4" style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem', resize: 'vertical' }} placeholder="Any dietary restrictions, accessibility needs, or specific preferences..."></textarea>
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: '1rem', fontSize: '1.1rem', marginTop: '1rem' }}>
              Confirm Booking Details
            </button>
          </form>
        </div>

        {/* Right Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ background: 'var(--primary)', color: 'white', padding: '2rem', borderRadius: '20px', boxShadow: 'var(--shadow-md)' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Briefcase size={22} /> Booking Summary
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <p style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: '2px' }}>Destination</p>
                <p style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={16} /> {bookingData.destination}, {bookingData.state}
                </p>
              </div>
              
              <div>
                <p style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: '2px' }}>Agency</p>
                <p style={{ fontSize: '1.1rem', fontWeight: 700 }}>{bookingData.agencyName}</p>
              </div>

              <div>
                <p style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: '2px' }}>Duration</p>
                <p style={{ fontSize: '1.1rem', fontWeight: 700 }}>{bookingData.duration} Days</p>
              </div>

              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                <p style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: '4px' }}>Estimated Total Cost</p>
                <p style={{ fontSize: '1.8rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <IndianRupee size={24} /> {bookingData.budget}
                </p>
                <p style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: '4px' }}>*Final price will be confirmed by the agency.</p>
              </div>
            </div>
          </div>

          <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            <p style={{ fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>What happens next?</p>
            <ol style={{ paddingLeft: '1.2rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>Your details will be securely sent to <strong>{bookingData.agencyName}</strong>.</li>
              <li>An agent will contact you within 24 hours to confirm dates and preferences.</li>
              <li>Payment will be processed directly with the agency.</li>
            </ol>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AgencyBooking;
