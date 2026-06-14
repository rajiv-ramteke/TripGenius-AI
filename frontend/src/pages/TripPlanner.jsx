import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, DollarSign, Clock, Heart, Navigation, Sparkles, Users } from 'lucide-react';
import { INDIA_STATES, STATE_DESTINATIONS } from '../data/indiaData';

// Tag-to-style mapping for smart matching
const STYLE_TAG_MAP = {
  'Explorer':     ['Adventure', 'Nature', 'Hill Station', 'Wildlife'],
  'Foodie':       ['Food', 'Culture', 'Street Food'],
  'History Buff': ['Heritage', 'History', 'Culture'],
  'Party Goer':   ['Beach', 'Adventure', 'Night Life'],
};

const MOOD_TAG_MAP = {
  'relaxing':    ['Nature', 'Hill Station', 'Beach', 'Backwaters'],
  'adventurous': ['Adventure', 'Trekking', 'Wildlife'],
  'spiritual':   ['Pilgrimage', 'Spiritual'],
  'cultural':    ['Culture', 'Heritage', 'History'],
  'romantic':    ['Hill Station', 'Nature', 'Beach'],
};

// Extract lower bound cost from budget string like "₹3,000 – ₹5,500"
const extractCost = (budgetStr) => {
  const match = budgetStr.replace(/[₹,]/g, '').match(/(\d+)/);
  return match ? parseInt(match[1]) : 5000;
};

// Budget tiers
const BUDGET_MAX = {
  'Sasta (Budget-Friendly)': 5000,
  'Moderate': 9000,
  'Luxury': 99999,
};

// Helper to scale cost strings based on travelers
const scaleCostString = (costStr, multiplier) => {
  if (!costStr) return costStr;
  return costStr.replace(/[₹,]\d+(?:,\d+)?/g, (match) => {
    const num = parseInt(match.replace(/[₹,]/g, ''));
    return `₹${(num * multiplier).toLocaleString('en-IN')}`;
  });
};

// Smart local recommender - no API, instant results
const getSmartRecommendations = ({ budget, duration, travel_style, mood, preferred_state, origin, preferred_destination, travelers }) => {
  // Build candidate pool
  let candidates = [];

  if (preferred_state && preferred_state !== 'Anywhere in India') {
    const dests = STATE_DESTINATIONS[preferred_state] || [];
    candidates = dests.map(d => ({ ...d, stateName: preferred_state }));
  } else {
    Object.entries(STATE_DESTINATIONS).forEach(([state, dests]) => {
      dests.forEach(d => candidates.push({ ...d, stateName: state }));
    });
  }

  // Score each candidate
  const maxCost = BUDGET_MAX[budget] || 9000;
  const styleTags = STYLE_TAG_MAP[travel_style] || [];
  const moodKey = mood.toLowerCase();
  const moodTags = Object.entries(MOOD_TAG_MAP).find(([k]) => moodKey.includes(k))?.[1] || [];

  const scored = candidates
    .filter(d => {
      // Always include the specifically requested destination, ignore budget limits for it
      if (preferred_destination && preferred_destination !== 'Any' && d.name === preferred_destination) return true;
      return extractCost(d.budget) <= maxCost;
    })
    .map(d => {
      let score = 0;
      if (preferred_destination && preferred_destination !== 'Any' && d.name === preferred_destination) {
        score += 1000; // Guarantee it comes first
      } else {
        d.tags.forEach(tag => {
          if (styleTags.includes(tag)) score += 2;
          if (moodTags.includes(tag)) score += 2;
        });
        // Add some randomness so results vary
        score += Math.random() * 2;
      }
      return { ...d, score };
    })
    .sort((a, b) => b.score - a.score);

  // Pick top 3 (ensure diversity — different states if possible)
  const picked = [];
  const usedStates = new Set();
  for (const item of scored) {
    if (picked.length >= 3) break;
    if (!usedStates.has(item.stateName) || picked.length < 3) {
      picked.push(item);
      usedStates.add(item.stateName);
    }
  }

  // Map to the expected result format
  return picked.map(dest => {
    // Basic deterministic mock travel cost based on names
    let travelCost = null;
    if (origin && origin.trim() !== '') {
      const hash = (origin.charCodeAt(0) || 0) + (dest.name.charCodeAt(0) || 0) + dest.name.length;
      const costs = [
        "₹800 – ₹1,500 (Bus / Sleeper Train)",
        "₹1,500 – ₹2,500 (3AC Train / Volvo Bus)",
        "₹2,500 – ₹4,500 (2AC Train / Budget Flight)",
        "₹1,200 – ₹2,000 (Express Train)",
        "₹3,000 – ₹6,000 (Direct Flight)"
      ];
      travelCost = costs[hash % 5];
    }

    return {
      destination: dest.name,
      state: dest.stateName,
      reason: dest.description,
      estimated_cost_inr: scaleCostString(dest.budget, travelers),
      travel_cost_from_origin: scaleCostString(travelCost, travelers),
      highlights: dest.tags,
      hotel_suggestions: dest.hotels.map(h => ({
        name: h.name,
        price_per_night: h.price,
      })),
    };
  });
};

const TripPlanner = () => {
  const [formData, setFormData] = useState({
    origin: '',
    budget: 'Sasta (Budget-Friendly)',
    duration: 5,
    travelers: 1,
    travel_style: 'Explorer',
    mood: 'Relaxing',
    preferred_state: 'Anywhere in India',
    preferred_destination: 'Any',
  });

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setResults(null);

    // Simulate a small thinking delay for UX
    setTimeout(() => {
      const recommendations = getSmartRecommendations(formData);
      setResults(recommendations);
      setLoading(false);
    }, 800);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'preferred_state') {
      setFormData({ ...formData, [name]: value, preferred_destination: 'Any' });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '4rem 2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800 }}>
          Gramin Trip <span className="text-gradient">Planner</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
          Destination Cost Planner for Indian Village Citizens. Tell us what you want!
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{
        background: 'white',
        padding: '2rem',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1.5rem',
      }}>
        {/* Location Group */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={18} color="var(--primary)" /> From (Starting City)
          </label>
          <input type="text" name="origin" value={formData.origin} onChange={handleChange}
            placeholder="e.g. Delhi, Mumbai, Patna"
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Navigation size={18} color="var(--primary)" /> Select State (To)
          </label>
          <select name="preferred_state" value={formData.preferred_state} onChange={handleChange}
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem' }}>
            <option value="Anywhere in India">Anywhere in India</option>
            {INDIA_STATES.map((s, idx) => (
              <option key={idx} value={s.name}>{s.name}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: '1 / -1' }}>
          <label style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={18} color="var(--primary)" /> Specific Destination (Substate)
          </label>
          <select name="preferred_destination" value={formData.preferred_destination} onChange={handleChange}
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem', opacity: formData.preferred_state === 'Anywhere in India' ? 0.6 : 1 }}
            disabled={formData.preferred_state === 'Anywhere in India'}
          >
            <option value="Any">Any Destination in {formData.preferred_state !== 'Anywhere in India' ? formData.preferred_state : 'State'}</option>
            {formData.preferred_state !== 'Anywhere in India' && STATE_DESTINATIONS[formData.preferred_state]?.map((dest, idx) => (
              <option key={idx} value={dest.name}>{dest.name}</option>
            ))}
          </select>
        </div>

        {/* Preferences Group */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <DollarSign size={18} color="var(--primary)" /> Budget
          </label>
          <select name="budget" value={formData.budget} onChange={handleChange}
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem' }}>
            <option>Sasta (Budget-Friendly)</option>
            <option>Moderate</option>
            <option>Luxury</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={18} color="var(--primary)" /> Duration (Days)
          </label>
          <input type="number" name="duration" value={formData.duration} onChange={handleChange}
            min="1" max="30"
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={18} color="var(--primary)" /> Travelers (Persons)
          </label>
          <input type="number" name="travelers" value={formData.travelers} onChange={handleChange}
            min="1" max="20"
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={18} color="var(--primary)" /> Travel Style
          </label>
          <select name="travel_style" value={formData.travel_style} onChange={handleChange}
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem' }}>
            <option>Explorer</option>
            <option>Foodie</option>
            <option>History Buff</option>
            <option>Party Goer</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Heart size={18} color="var(--primary)" /> Mood
          </label>
          <select name="mood" value={formData.mood} onChange={handleChange}
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem' }}>
            <option>Relaxing</option>
            <option>Adventurous</option>
            <option>Spiritual</option>
            <option>Cultural</option>
            <option>Romantic</option>
          </select>
        </div>

        <div style={{ gridColumn: '1 / -1', marginTop: '0.5rem' }}>
          <button type="submit" className="btn btn-primary"
            style={{ width: '100%', padding: '16px', fontSize: '1.125rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            disabled={loading}>
            <Sparkles size={20} />
            {loading ? 'Finding Best Destinations...' : 'Generate My Trip'}
          </button>
        </div>
      </form>

      {/* Results */}
      {results && (
        <div style={{ marginTop: '4rem' }} className="animate-fade-in-up">
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
            ✨ <span className="text-gradient">AI Recommendations</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            Top 3 destinations matching your preferences
          </p>

          {results.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '16px', border: '1px solid var(--border)' }}>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>
                No destinations found for your budget in the selected state. Try <strong>Anywhere in India</strong> or a higher budget.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {results.map((dest, idx) => (
                <div key={idx} style={{
                  background: 'white',
                  borderRadius: '20px',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  overflow: 'hidden',
                  minHeight: '360px',
                }}>
                  {/* Left: Info */}
                  <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
                    {/* Rank badge & Travel Cost Badge */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{
                          background: 'var(--primary)', color: 'white',
                          width: '32px', height: '32px', borderRadius: '50%',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 800, fontSize: '1rem', flexShrink: 0,
                        }}>#{idx + 1}</span>
                        <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>
                          {dest.destination}
                        </h3>
                      </div>

                      {dest.travel_cost_from_origin && (
                        <div style={{ background: '#f0fdf4', color: '#15803d', padding: '6px 12px', borderRadius: '12px', fontWeight: 600, fontSize: '0.8rem', border: '1px solid #bbf7d0', textAlign: 'right' }}>
                          🚆 Travel from {formData.origin}<br/>
                          <strong style={{ fontSize: '0.95rem' }}>{dest.travel_cost_from_origin.split(' (')[0]}</strong>
                        </div>
                      )}
                    </div>

                    <p style={{ fontWeight: 500, color: 'var(--text-muted)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={15} /> {dest.state}, India
                    </p>

                    {/* Tags */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '1rem' }}>
                      {dest.highlights && dest.highlights.map((tag, t) => (
                        <span key={t} style={{ background: '#f1f5f9', color: '#475569', padding: '3px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 600 }}>
                          {tag}
                        </span>
                      ))}
                    </div>

                    <p style={{ lineHeight: 1.65, color: 'var(--text-muted)', marginBottom: '1.25rem', fontSize: '0.95rem' }}>
                      {dest.reason}
                    </p>

                    {/* Cost */}
                    <div style={{ padding: '0.85rem 1.1rem', background: '#f0fdf4', color: '#166534', borderRadius: '10px', marginBottom: '1.25rem', border: '1px solid #bbf7d0' }}>
                      <p style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: dest.travel_cost_from_origin ? '4px' : '0' }}>
                        🏨 Stay & Food (Est): {dest.estimated_cost_inr}
                      </p>
                      {dest.travel_cost_from_origin && (
                        <p style={{ fontWeight: 600, fontSize: '0.95rem', color: '#15803d' }}>
                          🚆 Travel from {formData.origin}: {dest.travel_cost_from_origin}
                        </p>
                      )}
                    </div>

                    {/* Hotels */}
                    {dest.hotel_suggestions && dest.hotel_suggestions.length > 0 && (
                      <div style={{ marginBottom: '1.25rem' }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.6rem' }}>🏨 Budget Stays</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                          {dest.hotel_suggestions.map((hotel, hIdx) => (
                            <div key={hIdx} style={{ padding: '0.55rem 0.9rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{hotel.name}</span>
                              <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.82rem', background: 'white', padding: '3px 10px', borderRadius: '20px', border: '1px solid var(--border)', whiteSpace: 'nowrap' }}>
                                {hotel.price_per_night}/night
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* CTA */}
                    <div style={{ marginTop: 'auto' }}>
                      <Link
                        to={`/itinerary?destination=${encodeURIComponent(dest.destination)}&state=${encodeURIComponent(dest.state)}&origin=${encodeURIComponent(formData.origin)}&duration=${formData.duration}&travelers=${formData.travelers}`}
                        className="btn btn-primary"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '0.85rem', fontSize: '1rem' }}
                      >
                        <MapPin size={18} /> Plan Full Trip to {dest.destination}
                      </Link>
                    </div>
                  </div>

                  {/* Right: Map */}
                  <div style={{ position: 'relative', minHeight: '360px' }}>
                    <iframe
                      title={`map-${dest.destination}`}
                      width="100%"
                      height="100%"
                      style={{ border: 0, display: 'block', minHeight: '360px' }}
                      loading="lazy"
                      allowFullScreen
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(dest.destination + ', ' + dest.state + ', India')}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                    />
                    <div style={{
                      position: 'absolute', top: '12px', left: '12px',
                      background: 'white', padding: '5px 12px',
                      borderRadius: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                      fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary)',
                      display: 'flex', alignItems: 'center', gap: '4px',
                    }}>
                      <MapPin size={12} /> {dest.destination}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TripPlanner;
