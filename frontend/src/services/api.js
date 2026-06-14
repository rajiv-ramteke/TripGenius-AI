import axios from 'axios';

// Since we setup Vite proxy, we can just hit /api directly
const API_URL = '/api';

export const tripAPI = {
  recommendDestinations: async (data) => {
    const response = await axios.post(`${API_URL}/destinations/recommend`, data);
    return response.data;
  },
  generateItinerary: async (data) => {
    const response = await axios.post(`${API_URL}/trip/generate-itinerary`, data);
    return response.data;
  },
  estimateBudget: async (data) => {
    const response = await axios.post(`${API_URL}/trip/estimate-budget`, data);
    return response.data;
  },
  getWeather: async (data) => {
    const response = await axios.post(`${API_URL}/trip/weather`, data);
    return response.data;
  }
};
