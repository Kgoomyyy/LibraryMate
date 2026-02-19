"use client";

import { useEffect, useState } from "react";
import { getStats } from "@/lib/reports/getStats/reports";
import { getBorrowedReport } from "@/lib/reports/getBorrowedReport/reports";
import { getPaymentsPerBook } from "@/lib/reports/getPaymentsReport/reports";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Printer } from "lucide-react";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA336A", "#33AA99", "#FF5555"];

export default function ViewReports() {
  const [stats, setStats] = useState<any>(null);
  const [borrowedData, setBorrowedData] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);

  useEffect(() => {
    async function fetchReports() {
      const statsRes = await getStats();
      const borrowed = await getBorrowedReport();
      const revenue = await getPaymentsPerBook();

      setStats(statsRes);

      // Borrowed Books
      const borrowedCounts = borrowed.reduce((acc: any, b: any) => {
        const title = b.books?.title || "Unknown";
        acc[title] = (acc[title] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const borrowedChartData = Object.entries(borrowedCounts).map(([name, value]) => ({
        name,
        value,
      }));
      setBorrowedData(borrowedChartData);

      // Revenue Per Book
      const revenueChartData = revenue.map((r: any) => ({
        name: r.title || "Unknown",
        value: r.amount || 0,
      }));
      setRevenueData(revenueChartData);
    }

    fetchReports();
  }, []);

  if (!stats) return <p>Loading reports...</p>;

  const formatCurrency = (value: number) => `R${value.toLocaleString()}`;

  // Print handler
  const handlePrint = () => window.print();

  // Reusable PieChart Card Component
  const PieCard = ({
    title,
    data,
    labelFormatter,
    tooltipFormatter,
  }: {
    title: string;
    data: any[];
    labelFormatter?: (entry: any) => string;
    tooltipFormatter?: (value: any) => string;
  }) => (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-2 text-center">{title}</h2>
      {data.length === 0 ? (
        <p>No data</p>
      ) : (
        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={labelFormatter}
              >
                {data.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={tooltipFormatter} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6">
      {/* --- Taskbar / Toolbar --- */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Reports Dashboard</h1>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <Printer size={20} />
          Print
        </button>
      </div>

      {/* --- Charts Container --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stats Overview */}
        <PieCard
          title="Stats Overview"
          data={[
            { name: "Users", value: stats.users },
            { name: "Books", value: stats.books },
            { name: "Borrowed", value: stats.borrowed },
            { name: "Revenue", value: stats.revenue },
          ]}
          labelFormatter={(entry) => `${entry.name}: ${entry.value}`}
          tooltipFormatter={(value: any) => value.toString()}
        />

        {/* Borrowed Books */}
        <PieCard
          title="Borrowed Books"
          data={borrowedData}
          labelFormatter={(entry) => `${entry.name}: ${entry.value}`}
          tooltipFormatter={(value: any) => value.toString()}
        />

        {/* Revenue Per Book */}
        <PieCard
          title="Revenue Per Book"
          data={revenueData}
          labelFormatter={(entry) => `${entry.name}: R${entry.value.toLocaleString()}`}
          tooltipFormatter={(value: any) => formatCurrency(Number(value))}
        />
      </div>
    </div>
  );
}
