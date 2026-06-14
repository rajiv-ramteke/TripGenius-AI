import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { STATE_DESTINATIONS } from '../data/indiaData';
import { MapPin, Hotel, Clock, ArrowLeft, Star, Navigation, CloudSun, Wallet, CheckCircle2, Briefcase, Globe, PhoneCall, Users } from 'lucide-react';
import { getStorage, setStorage } from '../utils/storage';

const timeColors = {
  Morning:   { bg: '#fef3c7', color: '#92400e' },
  Afternoon: { bg: '#dbeafe', color: '#1e40af' },
  Evening:   { bg: '#f3e8ff', color: '#6b21a8' },
};

// ---------- Local Itinerary Generator ----------
const ACTIVITY_TEMPLATES = {
  Pilgrimage: [
    { time: 'Morning',   activity: 'Visit the main temple / shrine and attend morning aarti', location: 'Main Temple' },
    { time: 'Afternoon', activity: 'Explore smaller temples and sacred ghats nearby',         location: 'Old City Area' },
    { time: 'Evening',   activity: 'Attend evening Ganga Aarti / prayer ceremony',            location: 'Main Ghat' },
  ],
  Heritage: [
    { time: 'Morning',   activity: 'Explore the historic fort / palace and its architecture', location: 'Main Heritage Site' },
    { time: 'Afternoon', activity: 'Visit local museum and ancient monuments',                location: 'City Centre' },
    { time: 'Evening',   activity: 'Evening walk through old bazaars and street markets',     location: 'Old Market' },
  ],
  Nature: [
    { time: 'Morning',   activity: 'Early morning nature walk / trek through scenic trails',  location: 'Nature Trail' },
    { time: 'Afternoon', activity: 'Visit waterfalls, lakes, or viewpoints',                  location: 'Scenic Spot' },
    { time: 'Evening',   activity: 'Sunset view from the hilltop / viewpoint',                location: 'Viewpoint' },
  ],
  Beach: [
    { time: 'Morning',   activity: 'Morning walk on the beach and sunrise view',              location: 'Beach' },
    { time: 'Afternoon', activity: 'Water activities and local seafood lunch',                 location: 'Beach Shacks' },
    { time: 'Evening',   activity: 'Beach bonfire / evening stroll along the shore',          location: 'Beach' },
  ],
  Adventure: [
    { time: 'Morning',   activity: 'Trekking / river rafting / adventure sports',             location: 'Adventure Zone' },
    { time: 'Afternoon', activity: 'Rappelling / zip-lining / rock climbing',                 location: 'Activity Centre' },
    { time: 'Evening',   activity: 'Campfire and local folk music performance',                location: 'Camp Base' },
  ],
  Culture: [
    { time: 'Morning',   activity: 'Visit art galleries and cultural museums',                location: 'Culture Hub' },
    { time: 'Afternoon', activity: 'Attend local craft workshops and try regional cuisine',   location: 'Local Market' },
    { time: 'Evening',   activity: 'Folk dance / classical music performance',                location: 'Cultural Centre' },
  ],
  Wildlife: [
    { time: 'Morning',   activity: 'Early morning jungle safari (best time for wildlife)',    location: 'National Park' },
    { time: 'Afternoon', activity: 'Elephant safari / nature interpretation centre',          location: 'Safari Zone' },
    { time: 'Evening',   activity: 'Bird watching near the river / lake',                     location: 'Wetland Area' },
  ],
};

const DEFAULT_ACTIVITIES = [
  { time: 'Morning',   activity: 'Explore the famous local attractions',   location: 'City Centre' },
  { time: 'Afternoon', activity: 'Visit local market and taste street food', location: 'Old Bazaar' },
  { time: 'Evening',   activity: 'Enjoy the local sunset view',             location: 'Viewpoint' },
];

const ARRIVAL_ACTIVITIES = [
  { time: 'Morning',   activity: 'Arrival, hotel check-in and rest', location: 'Hotel' },
  { time: 'Afternoon', activity: 'Light walk around the neighbourhood to acclimatize', location: 'Nearby Area' },
  { time: 'Evening',   activity: 'Welcome dinner with local traditional food', location: 'Local Restaurant' },
];

const DEPARTURE_ACTIVITIES = [
  { time: 'Morning',   activity: 'Relaxed breakfast and local souvenir shopping', location: 'Local Market' },
  { time: 'Afternoon', activity: 'Visit a nearby cafe and pack luggage', location: 'City Centre' },
  { time: 'Evening',   activity: 'Departure to onward destination', location: 'Transit Station' },
];

const DAY_THEMES = [
  'Arrival & Exploration',
  'Deep Dive & Culture',
  'Adventure & Local Life',
  'Spiritual & Heritage',
  'Leisure & Departure',
];

const extractSpots = (desc, destName) => {
  if (!desc) return [`${destName} City Centre`, `${destName} Local Market`, `${destName} Heritage Area`];
  let parts = desc.split(/[.,]/);
  let spots = parts
    .map(p => p.trim())
    .filter(p => p.length > 4)
    .filter(p => !p.toLowerCase().includes('capital') && !p.toLowerCase().includes('famous') && !p.toLowerCase().includes('budget') && !p.toLowerCase().includes('climate') && !p.toLowerCase().includes('season') && !p.toLowerCase().includes('must-visit') && !p.toLowerCase().includes('city'));
  
  spots.push(`${destName} Main Bazaar`);
  spots.push(`${destName} Scenic Viewpoint`);
  spots.push(`${destName} Local Heritage Walk`);
  spots.push(`Central ${destName} Area`);

  return [...new Set(spots)];
};

const generateLocalItinerary = (destination, state, duration = 3) => {
  // Find destination data from local store
  const stateDestinations = STATE_DESTINATIONS[state] || [];
  const destData = stateDestinations.find(d => d.name === destination);

  // Pick activities based on tags
  let activities = DEFAULT_ACTIVITIES;
  if (destData && destData.tags && destData.tags.length > 0) {
    for (const tag of destData.tags) {
      if (ACTIVITY_TEMPLATES[tag]) {
        activities = ACTIVITY_TEMPLATES[tag];
        break;
      }
    }
  }

  const localSpots = extractSpots(destData?.description, destination);

  // Build day-by-day plan
  const days = Array.from({ length: duration }, (_, i) => {
    let theme = '';
    let dayActivities = [];

    if (i === 0) {
      theme = 'Arrival & Initial Exploration';
      // For a 1-day trip, we might want to just show the main tags instead of Arrival activities
      if (duration === 1) {
        dayActivities = (destData && destData.tags) ? (ACTIVITY_TEMPLATES[destData.tags[0]] || DEFAULT_ACTIVITIES) : DEFAULT_ACTIVITIES;
      } else {
        dayActivities = ARRIVAL_ACTIVITIES;
      }
    } else if (i === duration - 1) {
      theme = 'Leisure & Departure';
      dayActivities = DEPARTURE_ACTIVITIES;
    } else {
      if (i < DAY_THEMES.length - 1) theme = DAY_THEMES[i];
      else theme = `Local Immersion & Sightseeing`;

      // Rotate through tags to guarantee different activities every day
      const allTagKeys = Object.keys(ACTIVITY_TEMPLATES);
      const extendedTags = [...new Set([...(destData?.tags || []), ...allTagKeys])];
      const currentTag = extendedTags[(i - 1) % extendedTags.length];
      
      dayActivities = ACTIVITY_TEMPLATES[currentTag] || DEFAULT_ACTIVITIES;
    }

    return {
      day: i + 1,
      theme: theme,
      activities: dayActivities.map((a, idx) => {
        const spot = localSpots[(i * 3 + idx) % localSpots.length];
        const displayLocation = spot.length <= 35 ? spot : `${destination} Area`;
        
        let updatedActivity = a.activity;
        if (updatedActivity.includes('local attractions')) {
          updatedActivity = updatedActivity.replace('local attractions', spot);
        } else if (updatedActivity.includes('local market and taste')) {
          updatedActivity = updatedActivity.replace('local market and taste', `${spot} and taste`);
        }

        return {
          ...a,
          location: displayLocation,
          activity: updatedActivity
        };
      }),
    };
  });

  // Places to visit from dynamic spots
  const places_to_visit = localSpots.slice(0, 4).map(spot => ({
    name: spot.length <= 35 ? spot : `${destination} Attraction`,
    description: `A highly recommended spot to explore and experience the true essence of ${destination}.`,
  }));

  // Hotels from local data
  const hotel_suggestions = destData
    ? destData.hotels.map(h => ({ name: h.name, price_per_night: h.price, type: 'Budget Stay' }))
    : [];

  return { days, places_to_visit, hotel_suggestions };
};

// ---------- Local Budget Generator ----------
const generateLocalBudget = (destination, state, duration, origin, travelers) => {
  const stateDestinations = STATE_DESTINATIONS[state] || [];
  const destData = stateDestinations.find(d => d.name === destination);

  const budgetStr = destData?.budget || '₹3,000 – ₹6,000';
  const match = budgetStr.replace(/[₹,]/g, '').match(/(\d+)/g);
  const perDayCost = match ? parseInt(match[0]) : 3000;
  const total = perDayCost * duration * travelers;

  let travelCostFromOrigin = null;
  if (origin && origin.trim() !== '') {
    const hash = (origin.charCodeAt(0) || 0) + (destination.charCodeAt(0) || 0) + destination.length;
    const costs = [
      "₹800 – ₹1,500 (Bus/Sleeper)",
      "₹1,500 – ₹2,500 (3AC/Volvo)",
      "₹2,500 – ₹4,500 (2AC/Flight)",
      "₹1,200 – ₹2,000 (Express Train)",
      "₹3,000 – ₹6,000 (Direct Flight)"
    ];
    let baseTravelCost = costs[hash % 5];
    travelCostFromOrigin = baseTravelCost.replace(/[₹,]\d+(?:,\d+)?/g, (m) => {
      const num = parseInt(m.replace(/[₹,]/g, ''));
      return `₹${(num * travelers).toLocaleString('en-IN')}`;
    });
  }

  return {
    currency: 'INR',
    total_estimated: total.toLocaleString('en-IN'),
    travelCostFromOrigin,
    breakdown: {
      Accommodation: Math.round(total * 0.35).toLocaleString('en-IN'),
      Food:          Math.round(total * 0.25).toLocaleString('en-IN'),
      Transport:     Math.round(total * 0.20).toLocaleString('en-IN'),
      Activities:    Math.round(total * 0.15).toLocaleString('en-IN'),
      Miscellaneous: Math.round(total * 0.05).toLocaleString('en-IN'),
    },
    money_saving_tips: [
      'Book train tickets in advance using IRCTC for best prices.',
      'Stay at dharamshalas or government guest houses to save on accommodation.',
      'Eat at local dhabas and thalis — hygienic and very affordable.',
      'Use local autos / shared jeeps instead of taxis for short trips.',
      'Visit during off-season (avoid peak holidays) for lower prices.',
    ],
  };
};

// ---------- Local Weather Generator ----------
const WEATHER_DATA = {
  'Uttar Pradesh': { season: 'Winter (Oct–Feb) Best Time', temperature_range: '8°C – 25°C', description: 'Winters are pleasant. Summers get very hot (40°C+). Avoid June–August due to heavy rains.', packing_suggestions: ['Warm shawl/sweater for evenings', 'Cotton clothes for daytime', 'Comfortable walking shoes', 'Sun cap and water bottle'] },
  'Rajasthan':     { season: 'Winter (Nov–Feb) Best Time', temperature_range: '5°C – 25°C',  description: 'Desert climate. Very hot summers (45°C+). Winters are ideal for sightseeing.', packing_suggestions: ['Light cotton clothes + warm jacket for nights', 'Sunscreen and sunglasses', 'Sandals and covered shoes', 'Scarf for dust protection'] },
  'Kerala':        { season: 'Winter (Nov–Feb) Best Time', temperature_range: '20°C – 33°C', description: 'Tropical climate. Monsoon (June–Sept) is green but heavy rain. Winter is perfect.', packing_suggestions: ['Light cotton clothes', 'Umbrella / raincoat', 'Sandals and light footwear', 'Mosquito repellent'] },
  'Himachal Pradesh': { season: 'Summer (Apr–Jun) Best Time', temperature_range: '10°C – 25°C', description: 'Cool mountain climate. Winters can have snowfall. Summer is ideal for treks.', packing_suggestions: ['Heavy woolens and jacket', 'Trekking shoes', 'Raincoat (monsoon season)', 'Sunscreen for high altitude UV'] },
  'Uttarakhand':   { season: 'Summer (Apr–Jun) Best Time', temperature_range: '15°C – 30°C', description: 'Himalayan foothills — cool and pleasant. Char Dham yatra season is May–June.', packing_suggestions: ['Warm layers for evenings', 'Trekking shoes / sandals', 'Rain jacket', 'First aid kit for trekking'] },
  'Goa':           { season: 'Winter (Nov–Feb) Best Time', temperature_range: '20°C – 32°C', description: 'Tropical coastal climate. Monsoon (June–Sept) is beautiful but rough seas. Peak season is Nov–Feb.', packing_suggestions: ['Light beachwear and shorts', 'Sunscreen SPF 50+', 'Slippers and sandals', 'Casual evening wear'] },
  'Maharashtra':   { season: 'Winter (Oct–Feb) Best Time', temperature_range: '15°C – 32°C', description: 'Varies by region. Coastal areas are humid, Western Ghats are lush during monsoon.', packing_suggestions: ['Light cotton clothes', 'Umbrella for monsoon', 'Comfortable walking shoes', 'Water bottle'] },
  'Tamil Nadu':    { season: 'Winter (Nov–Feb) Best Time', temperature_range: '22°C – 35°C', description: 'Hot and humid. Northeast monsoon (Oct–Dec) brings rain. Winter is the best time.', packing_suggestions: ['Light cotton clothes', 'Sunscreen and hat', 'Sandals', 'Modest clothes for temple visits'] },
  'Karnataka':     { season: 'Winter (Oct–Feb) Best Time', temperature_range: '15°C – 30°C', description: 'Pleasant climate in Bangalore/Mysore. Coorg gets heavy rain in monsoon.', packing_suggestions: ['Light cotton for plains', 'Light jacket for Coorg evenings', 'Comfortable footwear', 'Raincoat for monsoon treks'] },
};

const getLocalWeather = (state) => {
  return WEATHER_DATA[state] || {
    season: 'Winter (Oct–Mar) Generally Best Time',
    temperature_range: '15°C – 35°C',
    description: 'Weather varies by season. Winter months are generally the best time to visit most Indian destinations.',
    packing_suggestions: [
      'Check local weather before packing',
      'Carry both light and warm clothes',
      'Comfortable walking shoes are a must',
      'Keep ID proof (Aadhar card) handy for all bookings',
    ],
  };
};

// ---------- Main Component ----------
const ItineraryView = () => {
  const [searchParams] = useSearchParams();
  const destination = searchParams.get('destination') || '';
  const state = searchParams.get('state') || 'India';
  const origin = searchParams.get('origin') || '';
  const duration = parseInt(searchParams.get('duration')) || 3;
  const travelers = parseInt(searchParams.get('travelers')) || 1;

  const [data, setData] = useState(null);
  const [budgetData, setBudgetData] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!destination) return;
    
    // Check if completed
    try {
      const completed = getStorage('completedTrips');
      setIsCompleted(completed.some(t => t.destination === destination));
    } catch(e) {}

    // Generate everything locally — instant, no API needed
    setTimeout(() => {
      const itineraryData = generateLocalItinerary(destination, state, duration);
      const budget = generateLocalBudget(destination, state, duration, origin, travelers);
      setData(itineraryData);
      setBudgetData(budget);
      setWeatherData(getLocalWeather(state));

      // Save to upcoming plans if not completed
      try {
        const completedTrips = getStorage('completedTrips');
        if (!completedTrips.some(t => t.destination === destination)) {
          const upcoming = getStorage('upcomingPlans');
          if (!upcoming.some(t => t.destination === destination)) {
            upcoming.push({ destination, duration, budget: budget.total_estimated });
            setStorage('upcomingPlans', upcoming);
          }
        }
      } catch (e) {
        console.error("Could not save plan", e);
      }
    }, 600);
  }, [destination, state, origin, duration]);

  const handleCompleteTrip = () => {
    try {
      const completed = getStorage('completedTrips');
      if (!completed.some(t => t.destination === destination)) {
        completed.push({ destination, duration, budget: budgetData?.total_estimated || 'N/A' });
        setStorage('completedTrips', completed);
      }
      
      const upcoming = getStorage('upcomingPlans');
      const filtered = upcoming.filter(t => t.destination !== destination);
      setStorage('upcomingPlans', filtered);
      
      setIsCompleted(true);
    } catch(e) {
      console.error(e);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem' }}>

      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <Link to="/destinations" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontWeight: 600, marginBottom: '1.5rem', textDecoration: 'none' }}>
          <ArrowLeft size={18} /> Back to Destinations
        </Link>
        <h1 style={{ fontSize: '2.8rem', fontWeight: 800 }}>
          Trip to <span className="text-gradient">{destination}</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <MapPin size={18} /> {state}, India
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Clock size={16} /> {duration} Days &nbsp;•&nbsp; <Users size={16} /> {travelers} Travelers
        </p>
      </div>

      {/* Loading */}
      {!data && (
        <div style={{ textAlign: 'center', padding: '5rem 0' }}>
          <div style={{ width: '60px', height: '60px', border: '5px solid #e2e8f0', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1.5rem' }} />
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Preparing your Gramin itinerary for {destination}...
          </p>
        </div>
      )}

      {/* Content */}
      {data && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2.5rem', alignItems: 'start' }}>

          {/* Left: Day-by-Day */}
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '1.5rem' }}>📅 Day-by-Day Plan</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {data.days.map((day, i) => (
                <div key={i} style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}>
                  <div style={{ background: 'var(--primary)', color: 'white', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ background: 'rgba(255,255,255,0.25)', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem', flexShrink: 0 }}>{day.day}</span>
                    <div>
                      <p style={{ fontSize: '0.78rem', opacity: 0.8 }}>Day {day.day}</p>
                      <p style={{ fontWeight: 700, fontSize: '1.05rem' }}>{day.theme}</p>
                    </div>
                  </div>
                  <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {day.activities.map((act, j) => {
                      const colors = timeColors[act.time] || { bg: '#f1f5f9', color: '#334155' };
                      return (
                        <div key={j} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                          <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, background: colors.bg, color: colors.color, whiteSpace: 'nowrap', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={12} />{act.time}
                          </span>
                          <div>
                            <p style={{ fontWeight: 600, marginBottom: '2px' }}>{act.activity}</p>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Navigation size={13} /> {act.location}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Must Visit */}
            {data.places_to_visit && data.places_to_visit.length > 0 && (
              <div style={{ marginTop: '2.5rem' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Star size={24} color="var(--primary)" /> Must Visit Places
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {data.places_to_visit.map((place, i) => (
                    <div key={i} style={{ background: 'white', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                      <p style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>{place.name}</p>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>{place.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'sticky', top: '2rem' }}>

            {/* Map */}
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={20} color="var(--primary)" /> Location Map
              </h3>
              <iframe
                width="100%" height="260"
                style={{ border: 0, borderRadius: '14px', boxShadow: 'var(--shadow-sm)', display: 'block' }}
                loading="lazy" allowFullScreen
                title={`Map of ${destination}`}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(destination + ', ' + state + ', India')}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
              />
            </div>

            {/* Hotels */}
            {data.hotel_suggestions && data.hotel_suggestions.length > 0 && (
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Hotel size={20} color="var(--primary)" /> Budget Stays
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {data.hotel_suggestions.map((hotel, i) => (
                    <div key={i} style={{ background: 'white', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <p style={{ fontWeight: 700, fontSize: '0.95rem', margin: 0 }}>{hotel.name}</p>
                      <span style={{ background: '#f0fdf4', color: '#166534', padding: '3px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap', marginLeft: '8px' }}>
                        {hotel.price_per_night}/night
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Weather */}
            {weatherData && (
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CloudSun size={20} color="var(--primary)" /> Weather Intelligence
                </h3>
                <div style={{ background: 'white', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                  <p style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '4px' }}>
                    {weatherData.season}
                  </p>
                  <p style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '8px' }}>
                    🌡️ {weatherData.temperature_range}
                  </p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '1rem' }}>
                    {weatherData.description}
                  </p>
                  <p style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '8px' }}>🎒 Packing Tips:</p>
                  <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {weatherData.packing_suggestions.map((tip, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '0.82rem' }}>
                        <CheckCircle2 size={13} color="var(--primary)" style={{ marginTop: '2px', flexShrink: 0 }} /> {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Budget */}
            {budgetData && (
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Wallet size={20} color="var(--primary)" /> Budget Intelligence
                </h3>
                <div style={{ background: 'white', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ background: '#f0fdf4', color: '#166534', padding: '1rem', borderRadius: '8px', border: '1px solid #bbf7d0', textAlign: 'center', marginBottom: '1rem' }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{duration}-Day Total (Est.)</p>
                    <p style={{ fontSize: '1.8rem', fontWeight: 800 }}>₹{budgetData.total_estimated}</p>
                  </div>
                  <p style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '8px' }}>Breakdown:</p>
                  {budgetData.travelCostFromOrigin && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px', paddingBottom: '6px', borderBottom: '1px solid var(--border)', color: '#15803d' }}>
                      <span style={{ fontWeight: 600 }}>🚆 Travel from {origin}</span>
                      <span style={{ fontWeight: 700 }}>{budgetData.travelCostFromOrigin}</span>
                    </div>
                  )}
                  {Object.entries(budgetData.breakdown).map(([key, val]) => (
                    <div key={key} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px', paddingBottom: '6px', borderBottom: '1px solid var(--border)' }}>
                      <span style={{ color: 'var(--text-muted)' }}>{key}</span>
                      <span style={{ fontWeight: 700 }}>₹{val}</span>
                    </div>
                  ))}
                  <p style={{ fontWeight: 600, fontSize: '0.9rem', margin: '1rem 0 8px' }}>💡 Saving Tips:</p>
                  <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {budgetData.money_saving_tips.map((tip, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '0.8rem' }}>
                        <CheckCircle2 size={13} color="var(--primary)" style={{ marginTop: '2px', flexShrink: 0 }} /> {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Travel Agencies */}
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Briefcase size={20} color="var(--primary)" /> Recommended Travel Agencies
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { name: 'MakeMyTrip / Yatra', type: 'Online Booking (Best Deals)', rating: '4.8', contact: 'www.makemytrip.com' },
                  { name: 'SOTC / Thomas Cook', type: 'Guided Tour Packages', rating: '4.5', contact: '1800-209-3344' },
                  { name: 'Gramin Local Tours', type: 'Local Budget Specialist', rating: '4.9', contact: '+91 98765 43210' }
                ].map((agency, i) => (
                  <div key={i} style={{ background: 'white', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <p style={{ fontWeight: 700, fontSize: '0.95rem', margin: 0 }}>{agency.name}</p>
                      <span style={{ background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Star size={10} fill="currentColor" /> {agency.rating}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{agency.type}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {agency.contact.includes('www') ? <Globe size={13} /> : <PhoneCall size={13} />} {agency.contact}
                      </p>
                      <Link 
                        to="/booking" 
                        state={{ 
                          agencyName: agency.name, 
                          destination: destination, 
                          state: state, 
                          duration: duration, 
                          budget: budgetData?.total_estimated || '₹5,000' 
                        }}
                        style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', background: 'var(--primary)', color: 'white', borderRadius: '6px', textDecoration: 'none', fontWeight: 600 }}
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {isCompleted ? (
              <div style={{ background: '#f0fdf4', color: '#166534', padding: '1rem', borderRadius: '12px', border: '1px solid #bbf7d0', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 600 }}>
                <CheckCircle2 size={20} /> Trip Completed!
              </div>
            ) : (
              <button 
                onClick={handleCompleteTrip}
                className="btn btn-primary" 
                style={{ background: '#10b981', borderColor: '#10b981', textAlign: 'center', padding: '1rem', fontSize: '1.05rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
              >
                <CheckCircle2 size={20} /> Mark as Completed
              </button>
            )}

            <Link to="/planner" className="btn btn-primary" style={{ textAlign: 'center', padding: '1rem', fontSize: '1.05rem' }}>
              Plan Another Trip
            </Link>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default ItineraryView;
