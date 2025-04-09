import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { getDaysInMonth } from "date-fns";
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
  const [selectedMonth, setSelectedMonth] = useState<string>("2025-04");
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

  const COLORS = [
    "#FF9800",
    "#4CAF50",
    "#2196F3",
    "#9C27B0",
    "#FF5722",
    "#00BCD4",
    "#E91E63",
    "#8BC34A",
    "#FFC107",
    "#9E9E9E",
  ];

  useEffect(() => {
    const fetchSales = async () => {
      const storeId = 1;
      const [year, month] = selectedMonth.split("-");

      const lastDay = getDaysInMonth(new Date(Number(year), Number(month) - 1));
      const startDate = `${year}-${month}-01`;
      const endDate = `${year}-${month}-${String(lastDay).padStart(2, "0")}`;

      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/sales`,
          {
            params: { storeId, startDate, endDate },
          }
        );

        const data: SaleRecord[] = res.data;

        const categoryMap: Record<string, number> = {};
        const dailyMap: Record<string, number> = {};

        data.forEach((record) => {
          const price = record.totalPrice;
          dailyMap[record.date] = (dailyMap[record.date] || 0) + price;
          categoryMap[record.productName] =
            (categoryMap[record.productName] || 0) + price;
        });

        const sortedCategories = Object.entries(categoryMap).sort(
          (a, b) => b[1] - a[1]
        );

        const categoryList = sortedCategories
          .slice(0, 10)
          .map(([name, value]) => ({
            name,
            value: Math.round(value),
          }));

        setCategorySalesData(categoryList);

        const totalList = Object.entries(dailyMap).map(([date, total]) => ({
          date,
          total: Math.round(total),
        }));

        setTotalSalesData(totalList);

        setMaxSale(
          totalList.reduce(
            (max, sale) => (sale.total > max.total ? sale : max),
            totalList[0]
          )
        );

        setMinSale(
          totalList.reduce(
            (min, sale) => (sale.total < min.total ? sale : min),
            totalList[0]
          )
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
        <h2>상품별 매출 비율 (상위 10개)</h2>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={categorySalesData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              label={({ index }) => `${index! + 1}위`}
            >
              {categorySalesData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Legend layout="vertical" verticalAlign="middle" align="right" />
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
