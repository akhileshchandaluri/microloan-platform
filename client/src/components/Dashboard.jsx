import { useEffect, useState } from "react";
import fakeApi from "../services/fakeApi";
import toast from "react-hot-toast";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export default function Dashboard(){
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLoans = async () => {
    setLoading(true);
    try {
      const data = await fakeApi.getLoans();
      setLoans(data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(()=>{ fetchLoans(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await fakeApi.updateLoan(id, { status });
      toast.success("Updated");
      fetchLoans();
    } catch (e) { toast.error("Failed"); }
  };

  const total = loans.reduce((s, l) => s + (Number(l.amount)||0), 0);
  const approved = loans.filter(l=>l.status==="Approved").length;
  const pending = loans.filter(l=>l.status==="Pending").length;

  const barData = { labels: loans.slice(0,6).map(l => new Date(l.createdAt).toLocaleDateString()), datasets: [{ label: "Amount", data: loans.slice(0,6).map(l=>l.amount), backgroundColor: "#2563EB" }]};
  const pieData = { labels:["Approved","Pending"], datasets:[{ data:[approved,pending], backgroundColor:["#22C55E","#FACC15"] }]};

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">Admin Dashboard</h2>
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded bg-white dark:bg-gray-800 shadow">Total Loans<br/><div className="text-2xl font-bold">₹{total}</div></div>
        <div className="p-4 rounded bg-white dark:bg-gray-800 shadow">Approved<br/><div className="text-2xl font-bold">{approved}</div></div>
        <div className="p-4 rounded bg-white dark:bg-gray-800 shadow">Pending<br/><div className="text-2xl font-bold">{pending}</div></div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow"><Bar data={barData} /></div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow"><Pie data={pieData} /></div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <table className="w-full">
          <thead><tr className="text-left"><th>Name</th><th>Amount</th><th>EMI</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {loading ? <tr><td>Loading...</td></tr> : loans.map(l=>(
              <tr key={l._id} className="border-t">
                <td className="p-2">{l.name}</td>
                <td className="p-2">₹{l.amount}</td>
                <td className="p-2">₹{l.emi}</td>
                <td className="p-2">{l.status}</td>
                <td className="p-2">
                  <button onClick={()=>updateStatus(l._id,"Approved")} className="mr-2 bg-green-500 text-white px-3 py-1 rounded">Approve</button>
                  <button onClick={()=>updateStatus(l._id,"Rejected")} className="bg-red-500 text-white px-3 py-1 rounded">Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
