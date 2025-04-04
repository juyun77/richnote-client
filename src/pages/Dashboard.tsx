import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import React from "react";
import axios from "axios";
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

interface SaleRecord {
  date: string;
  productName: string;
  totalPrice: number;
}

const Dashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>("2025-03");
  const [categorySalesData, setCategorySalesData] = useState<
    { name: string; value: number }[]
  >([]);
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
  const COLORS = ["#FF9800", "#4CAF50", "#2196F3", "#9C27B0", "#FF5722"];

  useEffect(() => {
    const fetchSales = async () => {
      const storeId = 1; // 실제 storeId 사용 시 로그인 정보 또는 props로 대체
      const [year, month] = selectedMonth.split("-");

      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/sales`,
          {
            params: {
              storeId,
              startDate: `${year}-${month}-01`,
              endDate: `${year}-${month}-31`,
            },
          }
        );

        const data: SaleRecord[] = res.data;

        const categoryMap: Record<string, number> = {};
        const dailyMap: Record<string, number> = {};

        data.forEach((record) => {
          const dateKey = record.date;
          dailyMap[dateKey] = (dailyMap[dateKey] || 0) + record.totalPrice;

          const category = record.productName; // 카테고리 분류 기준이 있을 경우 수정
          categoryMap[category] =
            (categoryMap[category] || 0) + record.totalPrice;
        });

        const categoryList = Object.entries(categoryMap).map(
          ([name, value]) => ({
            name,
            value,
          })
        );
        setCategorySalesData(categoryList);

        const totalList = Object.entries(dailyMap).map(([date, total]) => ({
          date,
          total,
        }));
        setTotalSalesData(totalList);

        setMaxSale(
          totalList.length > 0
            ? totalList.reduce(
                (max, sale) => (sale.total > max.total ? sale : max),
                totalList[0]
              )
            : null
        );
        setMinSale(
          totalList.length > 0
            ? totalList.reduce(
                (min, sale) => (sale.total < min.total ? sale : min),
                totalList[0]
              )
            : null
        );
      } catch (error) {
        console.error("매출 데이터 불러오기 실패:", error);
      }
    };

    fetchSales();
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
        <h2>상품별 매출 비율</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categorySalesData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
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
