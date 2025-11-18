import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile')
};

// Loan APIs
export const loanAPI = {
  apply: (data) => api.post('/loans/apply', data),
  getMyLoans: () => api.get('/loans/my-loans'),
  getLoan: (id) => api.get(`/loans/${id}`)
};

// Admin APIs
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getAllLoans: () => api.get('/admin/loans'),
  updateLoanStatus: (loanId, status) =>
    api.put(`/admin/loans/${loanId}/status`, { status }),
  getUsers: () => api.get('/admin/users')
};

export default api;

// localApi.js - mock DB (localStorage)

const LS_USERS_KEY = "microloan_users";
const LS_LOANS_KEY = "microloan_loans";

export function getUsersFromStorage() {
  try {
    const raw = localStorage.getItem(LS_USERS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function getLoansRaw() {
  try {
    const raw = localStorage.getItem(LS_LOANS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveLoansRaw(loans) {
  localStorage.setItem(LS_LOANS_KEY, JSON.stringify(loans));
}

/** Create a loan application - returns saved loan */
export function createLoan({ name, email, amount, duration, purpose }) {
  const loans = getLoansRaw();
  const newLoan = {
    id: "L" + Date.now(),
    name,
    email,
    amount: Number(amount),
    duration: Number(duration),
    purpose,
    status: "Pending",
    createdAt: new Date().toISOString(),
  };
  loans.unshift(newLoan);
  saveLoansRaw(loans);
  return newLoan;
}

/** Get all loans (admin) */
export function getAllLoans() {
  return getLoansRaw();
}

/** Get loans for a specific user email */
export function getLoansByEmail(email) {
  return getLoansRaw().filter(l => l.email?.toLowerCase() === email?.toLowerCase());
}

/** Update loan status */
export function updateLoanStatus(id, status) {
  const loans = getLoansRaw();
  const idx = loans.findIndex(l => l.id === id);
  if (idx === -1) return null;
  loans[idx].status = status;
  saveLoansRaw(loans);
  return loans[idx];
}
