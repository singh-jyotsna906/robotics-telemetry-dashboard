import axios from "axios";

const API_URL = "http://localhost:5000/api";

const api = {
  get: async (path, token) => {
    const res = await axios.get(`${API_URL}${path}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  },
  put: async (path, data, token) => {
    const res = await axios.put(`${API_URL}${path}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  },
  post: async (path, data, token) => {
    const res = await axios.post(`${API_URL}${path}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  }
};

export default api;
