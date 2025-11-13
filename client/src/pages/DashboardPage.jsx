import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { getLoansByEmail } from "../services/localApi";
import Footer from "../components/Footer.jsx";

export default function DashboardPage() {
  const { user } = useAuth();
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    if (user?.email) {
      const list = getLoansByEmail(user.email);
      setLoans(list);
    }
  }, [user]);

  const pending = loans.filter(l => l.status === "Pending").length;
  const approved = loans.filter(l => l.status === "Approved").length;

  return (
    <div className="app-container mt-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="text-slate-400">Total Applications</div>
          <div className="text-3xl font-bold mt-2">{loans.length}</div>
        </div>
        <div className="card">
          <div className="text-slate-400">Pending</div>
          <div className="text-3xl font-bold mt-2">{pending}</div>
        </div>
        <div className="card">
          <div className="text-slate-400">Approved</div>
          <div className="text-3xl font-bold mt-2">{approved}</div>
        </div>
      </div>

      <div className="mt-8 card">
        <h3 className="text-xl font-semibold mb-4">My Loan Applications</h3>

        {loans.length === 0 && <div className="text-slate-400">No applications yet — apply now.</div>}

        {loans.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="text-left text-slate-400">
                  <th className="py-2">ID</th>
                  <th>Amount</th>
                  <th>Duration</th>
                  <th>Status</th>
                  <th>Applied On</th>
                </tr>
              </thead>
              <tbody>
                {loans.map(l => (
                  <tr key={l.id} className="border-t border-slate-800">
                    <td className="py-3">{l.id}</td>
                    <td>₹ {l.amount}</td>
                    <td>{l.duration} mo</td>
                    <td>
                      <span className={`px-2 py-1 rounded-md ${l.status === "Approved" ? "bg-green-600" : l.status === "Rejected" ? "bg-rose-600" : "bg-yellow-600"}`}>
                        {l.status}
                      </span>
                    </td>
                    <td>{new Date(l.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
