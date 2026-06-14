import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import TripPlanner from './pages/TripPlanner';
import StatesDirectory from './pages/StatesDirectory';
import StateDestinations from './pages/StateDestinations';
import Dashboard from './pages/Dashboard';
import ItineraryView from './pages/ItineraryView';
import Login from './pages/Login';
import Register from './pages/Register';
import AgencyBooking from './pages/AgencyBooking';

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <main style={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/planner" element={<TripPlanner />} />
            <Route path="/destinations" element={<StatesDirectory />} />
            <Route path="/states/:stateName" element={<StateDestinations />} />
            <Route path="/itinerary" element={<ItineraryView />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/booking" element={<AgencyBooking />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
