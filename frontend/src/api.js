import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({ baseURL: API });

export const fetchAttacks = (params = {}) => api.get('/attacks', { params }).then((r) => r.data);
export const fetchAttack = (slug) => api.get(`/attacks/${slug}`).then((r) => r.data);
export const fetchStats = () => api.get('/stats').then((r) => r.data);
export const submitContribution = (payload) => api.post('/submissions', payload).then((r) => r.data);
export const aiAnalyze = (payload) => api.post('/ai/analyze', payload).then((r) => r.data);
