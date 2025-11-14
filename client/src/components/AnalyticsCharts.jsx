import { useEffect, useState } from "react";
import { BarChart, PieChart, TrendingUp } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function AnalyticsCharts({ loans }) {
  const [statusData, setStatusData] = useState(null);
  const [purposeData, setPurposeData] = useState(null);
  const [amountData, setAmountData] = useState(null);

  useEffect(() => {
    if (!loans || loans.length === 0) return;

    // 1. Status Distribution (Bar Chart)
    const pending = loans.filter(l => l.status === "Pending").length;
    const approved = loans.filter(l => l.status === "Approved").length;
    const rejected = loans.filter(l => l.status === "Rejected").length;

    setStatusData({
      labels: ["Pending", "Approved", "Rejected"],
      datasets: [
        {
          label: "Number of Applications",
          data: [pending, approved, rejected],
          backgroundColor: [
            "rgba(234, 179, 8, 0.8)",   // Yellow for Pending
            "rgba(34, 197, 94, 0.8)",   // Green for Approved
            "rgba(239, 68, 68, 0.8)",   // Red for Rejected
          ],
          borderColor: [
            "rgba(234, 179, 8, 1)",
            "rgba(34, 197, 94, 1)",
            "rgba(239, 68, 68, 1)",
          ],
          borderWidth: 2,
          borderRadius: 8,
        },
      ],
    });

    // 2. Purpose Distribution (Pie Chart)
    const purposes = {};
    loans.forEach(loan => {
      purposes[loan.purpose] = (purposes[loan.purpose] || 0) + 1;
    });

    const purposeLabels = Object.keys(purposes);
    const purposeCounts = Object.values(purposes);
    const colors = [
      "rgba(59, 130, 246, 0.8)",
      "rgba(139, 92, 246, 0.8)",
      "rgba(236, 72, 153, 0.8)",
      "rgba(10, 184, 212, 0.8)",
      "rgba(245, 158, 11, 0.8)",
      "rgba(34, 197, 94, 0.8)",
    ];

    setPurposeData({
      labels: purposeLabels,
      datasets: [
        {
          data: purposeCounts,
          backgroundColor: colors.slice(0, purposeLabels.length),
          borderColor: colors.slice(0, purposeLabels.length).map(c => c.replace("0.8", "1")),
          borderWidth: 2,
        },
      ],
    });

    // 3. Amount Distribution by Purpose (Doughnut Chart)
    const amountByPurpose = {};
    loans.forEach(loan => {
      if (!amountByPurpose[loan.purpose]) {
        amountByPurpose[loan.purpose] = 0;
      }
      amountByPurpose[loan.purpose] += Number(loan.amount) || 0;
    });

    const amountLabels = Object.keys(amountByPurpose);
    const amountValues = Object.values(amountByPurpose);

    setAmountData({
      labels: amountLabels,
      datasets: [
        {
          data: amountValues,
          backgroundColor: colors.slice(0, amountLabels.length),
          borderColor: colors.slice(0, amountLabels.length).map(c => c.replace("0.8", "1")),
          borderWidth: 2,
        },
      ],
    });
  }, [loans]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        labels: {
          color: "#cbd5e1",
          font: { size: 12 },
          padding: 15,
        },
        position: "bottom",
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        titleColor: "#fff",
        bodyColor: "#e2e8f0",
        borderColor: "#475569",
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        ticks: { color: "#cbd5e1" },
        grid: { color: "rgba(51, 65, 85, 0.5)" },
        beginAtZero: true,
      },
      x: {
        ticks: { color: "#cbd5e1" },
        grid: { color: "rgba(51, 65, 85, 0.5)" },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        labels: {
          color: "#cbd5e1",
          font: { size: 12 },
          padding: 15,
        },
        position: "bottom",
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        titleColor: "#fff",
        bodyColor: "#e2e8f0",
        borderColor: "#475569",
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            return label + ': ' + value;
          }
        }
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        labels: {
          color: "#cbd5e1",
          font: { size: 12 },
          padding: 15,
        },
        position: "bottom",
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        titleColor: "#fff",
        bodyColor: "#e2e8f0",
        borderColor: "#475569",
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            return label + ': ₹' + value.toLocaleString('en-IN');
          }
        }
      },
    },
  };

  if (!statusData || !purposeData || !amountData) {
    return <div className="text-center text-slate-400 py-8">Loading analytics...</div>;
  }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-500/20 rounded-lg">
          <TrendingUp className="w-6 h-6 text-purple-400" />
        </div>
        <h2 className="text-2xl font-bold text-white">Analytics & Reports</h2>
      </div>

      {/* Charts Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        
        {/* 1. Status Distribution - Bar Chart */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <BarChart className="w-5 h-5 text-blue-400" />
            Loan Status Distribution
          </h3>
          <div className="h-80">
            <Bar data={statusData} options={chartOptions} />
          </div>
        </div>

        {/* 2. Purpose Distribution - Pie Chart */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-green-400" />
            Loans by Purpose
          </h3>
          <div className="h-80">
            <Pie data={purposeData} options={pieOptions} />
          </div>
        </div>

        {/* 3. Amount Distribution - Doughnut Chart */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <BarChart className="w-5 h-5 text-orange-400" />
            Amount by Purpose
          </h3>
          <div className="h-80">
            <Doughnut data={amountData} options={doughnutOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}