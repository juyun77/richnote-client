import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

interface Sale {
  date: string;
  category: string;
  amount: number;
}

const Dashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>("2025-03");
  const [categorySalesData, setCategorySalesData] = useState<
    { name: string; value: number }[]
  >([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [maxSale, setMaxSale] = useState<{
    date: string;
    total: number;
  } | null>(null);
  const [minSale, setMinSale] = useState<{
    date: string;
    total: number;
  } | null>(null);
  const [totalSalesData, setTotalSalesData] = useState<
    { date: string; total: number }[]
  >([]);
  const COLORS = ["#FF9800", "#4CAF50", "#2196F3"];

  useEffect(() => {
    const rawData: Sale[] = [
      { date: "2025-03-10", amount: 150000, category: "음료" },
      { date: "2025-03-10", amount: 180000, category: "스낵" },
      { date: "2025-03-10", amount: 210000, category: "기타" },
      { date: "2025-02-15", amount: 220000, category: "음료" },
      { date: "2025-02-15", amount: 240000, category: "스낵" },
      { date: "2025-02-15", amount: 200000, category: "기타" },
      { date: "2025-03-09", amount: 170000, category: "음료" },
      { date: "2025-03-09", amount: 210000, category: "스낵" },
      { date: "2025-03-09", amount: 190000, category: "기타" },
      { date: "2025-03-08", amount: 250000, category: "음료" },
      { date: "2025-03-08", amount: 200000, category: "스낵" },
      { date: "2025-03-08", amount: 220000, category: "기타" },
      { date: "2025-03-07", amount: 160000, category: "음료" },
      { date: "2025-03-07", amount: 190000, category: "스낵" },
      { date: "2025-03-07", amount: 180000, category: "기타" },
      { date: "2025-03-06", amount: 230000, category: "음료" },
      { date: "2025-03-06", amount: 220000, category: "스낵" },
      { date: "2025-03-06", amount: 210000, category: "기타" },
      { date: "2025-03-05", amount: 180000, category: "음료" },
      { date: "2025-03-05", amount: 200000, category: "스낵" },
      { date: "2025-03-05", amount: 170000, category: "기타" },
      { date: "2025-03-04", amount: 240000, category: "음료" },
      { date: "2025-03-04", amount: 230000, category: "스낵" },
      { date: "2025-03-04", amount: 250000, category: "기타" },
      { date: "2025-03-03", amount: 190000, category: "음료" },
      { date: "2025-03-03", amount: 210000, category: "스낵" },
      { date: "2025-03-03", amount: 200000, category: "기타" },
    ];

    const filteredData = rawData.filter((sale) =>
      sale.date.startsWith(selectedMonth)
    );

    const categorySales = filteredData.reduce((acc, sale) => {
      const existing = acc.find((item) => item.name === sale.category);
      if (existing) {
        existing.value += sale.amount;
      } else {
        acc.push({ name: sale.category, value: sale.amount });
      }
      return acc;
    }, [] as { name: string; value: number }[]);

    const uniqueCategories = Array.from(
      new Set(rawData.map((sale) => sale.category))
    );
    setCategories(uniqueCategories);

    const totalSales = filteredData.reduce((acc, sale) => {
      const existing = acc.find((item) => item.date === sale.date);
      if (existing) {
        existing.total += sale.amount;
      } else {
        acc.push({ date: sale.date, total: sale.amount });
      }
      return acc;
    }, [] as { date: string; total: number }[]);

    setMaxSale(
      totalSales.length > 0
        ? totalSales.reduce(
            (max, sale) => (sale.total > max.total ? sale : max),
            totalSales[0]
          )
        : null
    );
    setMinSale(
      totalSales.length > 0
        ? totalSales.reduce(
            (min, sale) => (sale.total < min.total ? sale : min),
            totalSales[0]
          )
        : null
    );
    setCategorySalesData(categorySales);
    setTotalSalesData(totalSales);
  }, [selectedMonth]);

  return (
    <div style={styles.container}>
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={styles.title}
      >
        📊 대시보드
      </motion.h1>

      <label style={styles.label}>
        월 선택:
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          style={styles.input}
        />
      </label>

      <div style={styles.salesOverview}>
        <h2>카테고리별 매출 비율</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categorySalesData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {categorySalesData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div style={styles.salesOverview}>
        <h2>하루 총매출</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={totalSalesData}>
            <XAxis dataKey="date" stroke="#8884d8" />
            <YAxis />
            <Tooltip
              formatter={(value: number) => `₩${value.toLocaleString()}`}
            />
            <Legend />
            <Bar dataKey="total" name="총매출" fill="#FF5722" barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={styles.salesOverview}>
        <h2>최고 및 최저 매출</h2>
        <p>
          🔥 최고 매출일:{" "}
          {maxSale
            ? `${maxSale.date} - ₩${maxSale.total.toLocaleString()}`
            : "데이터 없음"}
        </p>
        <p>
          ❄️ 최저 매출일:{" "}
          {minSale
            ? `${minSale.date} - ₩${minSale.total.toLocaleString()}`
            : "데이터 없음"}
        </p>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: { padding: "40px", maxWidth: "1200px", margin: "0 auto" },
  title: { fontSize: "28px", fontWeight: "bold", marginBottom: "20px" },
  salesOverview: {
    background: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    marginTop: "20px",
  },
  label: {
    fontSize: "16px",
    fontWeight: "bold",
    marginBottom: "10px",
    display: "block",
  },
  input: {
    fontSize: "16px",
    padding: "5px",
    margin: "10px 0",
    borderRadius: "5px",
    border: "1px solid #ddd",
  },
};

export default Dashboard;
