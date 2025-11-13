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
