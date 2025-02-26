import axios from "axios";

const API_BASE = "https://recipe-mern-noa1.onrender.com/api";

export const loginUser = (email, password) => 
  axios.post(`${API_BASE}/auth/login`, { email, password });

export const fetchUserProfile = (token) => 
  axios.get(`${API_BASE}/user/profile`, { headers: { Authorization: `Bearer ${token}` } });
