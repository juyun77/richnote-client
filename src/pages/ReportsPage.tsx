import { useEffect, useState } from "react";
import axios from "axios";
import "../style/ReportsPage.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

interface Store {
  id: number;
  storeName: string;
  monthlyRent: number;
  maintenanceFee: number;
  initialInvestment: number;
}

interface SalesRecord {
  totalPrice: number;
}

interface VariableExpense {
  amount: number;
}

export default function ReportsPage() {
  const [storeList, setStoreList] = useState<Store[]>([]);
  const [storeId, setStoreId] = useState<number | null>(null);
  const [targetYears, setTargetYears] = useState<number>(1);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);

  const [breakevenMonthly, setBreakevenMonthly] = useState<number | null>(null);
  const [breakevenTotal, setBreakevenTotal] = useState<number | null>(null);
  const [netProfitPerMonth, setNetProfitPerMonth] = useState<number | null>(
    null
  );
  const [requiredRevenue, setRequiredRevenue] = useState<number | null>(null);
  const [currentSales, setCurrentSales] = useState<number | null>(null);
  const [currentProfit, setCurrentProfit] = useState<number | null>(null);
  const [achievedRate, setAchievedRate] = useState<number | null>(null);
  const [remainingToTarget, setRemainingToTarget] = useState<number | null>(
    null
  );
  const [variableCost, setVariableCost] = useState<number>(0);
  const [dailyTarget, setDailyTarget] = useState<number | null>(null);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const userRes = await axios.get(`${API_BASE_URL}/users/checkLogin`, {
          withCredentials: true,
        });
        const userId = userRes.data.user?.id;

        if (userId) {
          const storeRes = await axios.get(`${API_BASE_URL}/stores/${userId}`);
          setStoreList(storeRes.data);
          if (storeRes.data.length > 0) setStoreId(storeRes.data[0].id);
        }
      } catch (err) {
        console.error("매장 목록 불러오기 실패:", err);
      }
    };

    fetchStores();
  }, []);

  useEffect(() => {
    const fetchSales = async () => {
      if (!storeId) return;
      const paddedMonth = String(month).padStart(2, "0");

      try {
        const res = await axios.get(`${API_BASE_URL}/sales`, {
          params: {
            storeId,
            startDate: `${year}-${paddedMonth}-01`,
            endDate: `${year}-${paddedMonth}-31`,
          },
        });

        const total = res.data.reduce(
          (sum: number, r: SalesRecord) => sum + r.totalPrice,
          0
        );
        setCurrentSales(total);
      } catch (err) {
        console.error("매출 조회 실패:", err);
      }
    };

    const fetchVariableCosts = async () => {
      if (!storeId) return;
      try {
        const res = await axios.get(
          `${API_BASE_URL}/variable-expense/${storeId}/${year}/${month}`
        );
        const sum = res.data.reduce(
          (acc: number, item: VariableExpense) => acc + item.amount,
          0
        );
        setVariableCost(sum);
      } catch (err) {
        console.error("변동 지출 조회 실패:", err);
        setVariableCost(0);
      }
    };

    fetchSales();
    fetchVariableCosts();
  }, [storeId, year, month]);

  useEffect(() => {
    if (storeId) {
      const store = storeList.find((s) => s.id === storeId);
      if (store) {
        const monthlyFixedCosts =
          store.monthlyRent + store.maintenanceFee + variableCost;
        const totalInvestment = store.initialInvestment;
        const targetMonths = targetYears * 12;
        const investmentPerMonth = totalInvestment / targetMonths;

        const breakeven = monthlyFixedCosts + investmentPerMonth;
        const revenueToCoverCosts = breakeven / 0.3;
        const estimatedProfit = revenueToCoverCosts * 0.3 - breakeven;

        setBreakevenMonthly(Math.round(breakeven));
        setBreakevenTotal(Math.round(breakeven * targetMonths));
        setRequiredRevenue(Math.round(revenueToCoverCosts));
        setNetProfitPerMonth(Math.round(estimatedProfit));
        setDailyTarget(Math.round(revenueToCoverCosts / 30));

        if (currentSales !== null) {
          const cost = currentSales * 0.7;
          const profit = currentSales - cost;
          setCurrentProfit(Math.round(profit));

          const rate = (currentSales / revenueToCoverCosts) * 100;
          setAchievedRate(Math.round(rate));

          const remaining = Math.max(0, revenueToCoverCosts - currentSales);
          setRemainingToTarget(Math.round(remaining));
        }
      }
    }
  }, [storeId, storeList, targetYears, currentSales, variableCost]);

  return (
    <div className="reports-container">
      <h2>📊 매출 분석 리포트</h2>

      <div className="filter-section">
        <div className="filter-row">
          <label>매장 선택:</label>
          <select
            value={storeId ?? ""}
            onChange={(e) => setStoreId(Number(e.target.value))}
          >
            {storeList.map((store) => (
              <option key={store.id} value={store.id}>
                {store.storeName}
              </option>
            ))}
          </select>

          <label>투자비용 회수 기간:</label>
          <select
            value={targetYears}
            onChange={(e) => setTargetYears(Number(e.target.value))}
          >
            <option value={1}>1년</option>
            <option value={2}>2년</option>
            <option value={3}>3년</option>
          </select>
        </div>

        <div className="filter-row">
          <label>연도:</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          />

          <label>월:</label>
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
          >
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}월
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="result-box">
        <h3>손익분기점 계산 결과</h3>
        {breakevenMonthly !== null && requiredRevenue !== null ? (
          <ul className="result-list">
            <li>
              ✅ 매달 손익분기점 기준 고정비 + 변동비 + 투자비용:{" "}
              <strong>{breakevenMonthly.toLocaleString()} 원</strong>
            </li>
            <li>
              ✅ 손익분기점 도달까지 총 고정지출:{" "}
              <strong>{breakevenTotal?.toLocaleString()} 원</strong>
            </li>
            <li>
              ✅ 필요한 월 매출 (마진률 30%):{" "}
              <strong>{requiredRevenue.toLocaleString()} 원</strong>
            </li>
            <li>
              ✅ 하루 평균 목표 매출:{" "}
              <strong>{dailyTarget?.toLocaleString()} 원</strong>
            </li>
            <li>
              ✅ 예상 순수익 (월 기준):{" "}
              <strong>{netProfitPerMonth?.toLocaleString()} 원</strong>
            </li>
            {currentSales !== null && (
              <>
                <li>
                  📦 선택한 기간의 매출:{" "}
                  <strong>{currentSales.toLocaleString()} 원</strong>
                </li>
                <li>
                  💰 추정 순수익 (30% 마진):{" "}
                  <strong>{currentProfit?.toLocaleString()} 원</strong>
                </li>
                <li>
                  🎯 목표 달성률:{" "}
                  <strong>{achievedRate?.toLocaleString()}%</strong>
                </li>
                <li>
                  📉 손익분기점까지 추가 필요 매출:{" "}
                  <strong>{remainingToTarget?.toLocaleString()} 원</strong>
                </li>
              </>
            )}
          </ul>
        ) : (
          <p>계산할 수 없습니다. 매장 정보를 확인해주세요.</p>
        )}
      </div>
    </div>
  );
}
