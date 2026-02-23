"use client";

import { useEffect, useState } from "react";
import { getStats } from "@/lib/reports/getStats/reports";
import { getBorrowedReport } from "@/lib/reports/getBorrowedReport/reports";
import { getPaymentsPerBook } from "@/lib/reports/getPaymentsReport/reports";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { FiPrinter } from "react-icons/fi";

const COLORS = ["#FFCA28", "#FFB300", "#FF8F00", "#F57F17", "#FFD54F", "#FFC107", "#FFAB00"];

export default function ViewReports() {
  const [stats, setStats] = useState<any>(null);
  const [borrowedData, setBorrowedData] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [hoveredPrint, setHoveredPrint] = useState(false);

  useEffect(() => {
    async function fetchReports() {
      const statsRes = await getStats();
      const borrowed = await getBorrowedReport();
      const revenue = await getPaymentsPerBook();

      setStats(statsRes);

      const borrowedCounts = borrowed.reduce((acc: any, b: any) => {
        const title = b.books?.title || "Unknown";
        acc[title] = (acc[title] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      setBorrowedData(Object.entries(borrowedCounts).map(([name, value]) => ({ name, value })));
      setRevenueData(revenue.map((r: any) => ({ name: r.title || "Unknown", value: r.amount || 0 })));
    }
    fetchReports();
  }, []);

  if (!stats) return (
    <div style={{ padding: 40, textAlign: "center", color: "#aaa", fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>
      Loading reports...
    </div>
  );

  const formatCurrency = (value: number) => `R${value.toLocaleString()}`;
  const handlePrint = () => window.print();

  const StatBadge = ({ label, value }: { label: string; value: any }) => (
    <div
      style={{
        background: "#fff",
        border: "1px solid #F0E6C8",
        borderRadius: 12,
        padding: "20px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 4,
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}
    >
      <span style={{ fontSize: 11, fontWeight: 600, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.08em" }}>
        {label}
      </span>
      <span style={{ fontSize: 28, fontWeight: 700, color: "#111", fontFamily: "'Playfair Display', serif" }}>
        {typeof value === "number" && label.toLowerCase().includes("revenue") ? formatCurrency(value) : value}
      </span>
    </div>
  );

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
    <div
      style={{
        background: "#fff",
        borderRadius: 14,
        border: "1px solid #F0E6C8",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h2
        style={{
          margin: "0 0 16px",
          fontFamily: "'Playfair Display', serif",
          fontSize: 17,
          fontWeight: 700,
          color: "#111",
          textAlign: "center",
        }}
      >
        {title}
      </h2>
      {data.length === 0 ? (
        <p style={{ color: "#aaa", fontSize: 13 }}>No data available</p>
      ) : (
        <div style={{ width: "100%", height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={95}
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
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <p style={{ margin: 0, fontSize: 11, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.08em" }}>Overview</p>
          <h1 style={{ margin: "4px 0 0", fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: "#111" }}>
            Reports Dashboard
          </h1>
        </div>
        <button
          onClick={handlePrint}
          onMouseEnter={() => setHoveredPrint(true)}
          onMouseLeave={() => setHoveredPrint(false)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "9px 20px",
            borderRadius: 8,
            border: "none",
            background: hoveredPrint ? "#FFB300" : "linear-gradient(135deg, #FFCA28, #FFB300)",
            color: "#111",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            transition: "background 0.18s",
          }}
        >
          <FiPrinter size={15} />
          Print Report
        </button>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
        <StatBadge label="Total Users" value={stats.users} />
        <StatBadge label="Total Books" value={stats.books} />
        <StatBadge label="Borrowed" value={stats.borrowed} />
        <StatBadge label="Revenue" value={stats.revenue} />
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
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
        <PieCard
          title="Borrowed Books"
          data={borrowedData}
          labelFormatter={(entry) => `${entry.name}: ${entry.value}`}
          tooltipFormatter={(value: any) => value.toString()}
        />
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