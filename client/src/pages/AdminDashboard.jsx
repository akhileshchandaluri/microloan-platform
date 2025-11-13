import { useEffect, useState } from "react";
import { getAllLoans, updateLoanStatus } from "../services/localApi";
import Footer from "../components/Footer.jsx";

export default function AdminDashboard() {
  const [loans, setLoans] = useState([]);
  useEffect(() => {
    setLoans(getAllLoans());
  }, []);

  const refresh = () => setLoans(getAllLoans());

  const doApprove = (id) => {
    updateLoanStatus(id, "Approved");
    refresh();
  };
  const doReject = (id) => {
    updateLoanStatus(id, "Rejected");
    refresh();
  };

  const total = loans.reduce((s, l) => s + (Number(l.amount) || 0), 0);
  const pending = loans.filter(l => l.status === "Pending").length;

  return (
    <div className="app-container mt-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="text-slate-400">Total Applications</div>
          <div className="text-2xl font-bold mt-2">{loans.length}</div>
        </div>
        <div className="card">
          <div className="text-slate-400">Pending</div>
          <div className="text-2xl font-bold mt-2">{pending}</div>
        </div>
        <div className="card">
          <div className="text-slate-400">Total Amount</div>
          <div className="text-2xl font-bold mt-2">₹ {total}</div>
        </div>
      </div>

      <div className="mt-8 card">
        <h3 className="text-xl font-semibold mb-4">All Applications</h3>

        {loans.length === 0 && <div className="text-slate-400">No applications yet.</div>}

        {loans.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="text-left text-slate-400">
                  <th className="py-2">ID</th>
                  <th>Applicant</th>
                  <th>Amount</th>
                  <th>Duration</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loans.map(l => (
                  <tr key={l.id} className="border-t border-slate-800">
                    <td className="py-3">{l.id}</td>
                    <td>{l.name} <div className="text-slate-400 text-sm">{l.email}</div></td>
                    <td>₹ {l.amount}</td>
                    <td>{l.duration} mo</td>
                    <td>
                      <span className={`px-2 py-1 rounded-md ${l.status === "Approved" ? "bg-green-600" : l.status === "Rejected" ? "bg-rose-600" : "bg-yellow-600"}`}>
                        {l.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        {l.status === "Pending" && (
                          <>
                            <button onClick={()=>doApprove(l.id)} className="px-3 py-1 bg-green-600 rounded text-white">Approve</button>
                            <button onClick={()=>doReject(l.id)} className="px-3 py-1 bg-rose-600 rounded text-white">Reject</button>
                          </>
                        )}
                        <button onClick={()=>navigator.clipboard.writeText(l.id)} className="px-2 py-1 rounded bg-slate-700 text-sm">Copy ID</button>
                      </div>
                    </td>
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
