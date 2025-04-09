import { useEffect, useState } from "react";
import axios from "axios";
import { getDaysInMonth } from "date-fns"; // ✅ 월 마지막 날짜 계산
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
  profitPrice: number;
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
  const [requiredProfit, setRequiredProfit] = useState<number | null>(null);
  const [currentSales, setCurrentSales] = useState<number | null>(null);
  const [currentProfit, setCurrentProfit] = useState<number | null>(null);
  const [finalProfit, setFinalProfit] = useState<number | null>(null); // ✅ 최종 순이익
  const [achievedRate, setAchievedRate] = useState<number | null>(null);
  const [remainingToTarget, setRemainingToTarget] = useState<number | null>(
    null
  );
  const [variableCost, setVariableCost] = useState<number>(0);
  const [dailyTarget, setDailyTarget] = useState<number | null>(null);
  const [profitRate, setProfitRate] = useState<number | null>(null);

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
      const lastDay = getDaysInMonth(new Date(year, month - 1));
      const startDate = `${year}-${paddedMonth}-01`;
      const endDate = `${year}-${paddedMonth}-${String(lastDay).padStart(
        2,
        "0"
      )}`;

      try {
        const res = await axios.get(`${API_BASE_URL}/sales`, {
          params: {
            storeId,
            startDate,
            endDate,
          },
        });

        const sales = res.data as SalesRecord[];

        const totalSalesRaw = sales.reduce(
          (sum, record) => sum + (record.totalPrice || 0),
          0
        );
        const totalSales = Math.round(totalSalesRaw * 0.977); // ✅ 카드수수료 2.3% 반영
        const totalProfit = sales.reduce(
          (sum, record) => sum + (record.profitPrice || 0),
          0
        );

        setCurrentSales(totalSales);
        setCurrentProfit(totalProfit);

        if (totalProfit > 0) {
          setFinalProfit(Math.round(totalProfit * 0.977)); // ✅ 최종 순이익 계산 (2.3% 반영)
        } else {
          setFinalProfit(null);
        }

        if (totalSales > 0) {
          const calculatedProfitRate = (totalProfit / totalSales) * 100;
          setProfitRate(Math.round(calculatedProfitRate));
        } else {
          setProfitRate(null);
        }
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
        setBreakevenMonthly(Math.round(breakeven));
        setBreakevenTotal(Math.round(breakeven * targetMonths));

        if (currentProfit !== null) {
          setRequiredProfit(Math.round(breakeven));
          const achievedProfitRate = (currentProfit / breakeven) * 100;
          const remainingProfitToTarget = Math.max(
            0,
            breakeven - currentProfit
          );

          setAchievedRate(Math.round(achievedProfitRate));
          setRemainingToTarget(Math.round(remainingProfitToTarget));
          setDailyTarget(Math.round(breakeven / 30));

          const estimatedNetProfit = currentProfit - breakeven;
          setNetProfitPerMonth(Math.round(estimatedNetProfit));
        }
      }
    }
  }, [storeId, storeList, targetYears, currentProfit, variableCost]);

  return (
    <div className="reports-container">
      <h2>📊 매출 분석 리포트</h2>

      {/* ✅ 카드수수료 안내 문구 */}
      <p style={{ fontSize: "14px", color: "gray", marginBottom: "10px" }}>
        ※ 카드 수수료 2.3%가 반영된 매출 및 최종 순이익입니다.
      </p>

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
        {breakevenMonthly !== null && requiredProfit !== null ? (
          <ul className="result-list">
            <li>
              ✅ 매달 손익분기점:{" "}
              <strong>{breakevenMonthly.toLocaleString()} 원</strong>
            </li>
            <li>
              ✅ 총 고정지출:{" "}
              <strong>{breakevenTotal?.toLocaleString()} 원</strong>
            </li>
            <li>
              ✅ 필요한 월 순이익:{" "}
              <strong>{requiredProfit?.toLocaleString()} 원</strong>
            </li>
            <li>
              ✅ 하루 평균 목표 순이익:{" "}
              <strong>{dailyTarget?.toLocaleString()} 원</strong>
            </li>
            <li>
              ✅ 예상 순수익 (월 기준):{" "}
              <strong>{netProfitPerMonth?.toLocaleString()} 원</strong>
            </li>

            {currentSales !== null && (
              <li>
                📈 현재까지 누적 총매출:{" "}
                <strong>{currentSales.toLocaleString()} 원</strong>
              </li>
            )}
            {currentProfit !== null && (
              <li>
                💰 현재까지 누적 순이익:{" "}
                <strong>{currentProfit.toLocaleString()} 원</strong>
              </li>
            )}
            {finalProfit !== null && (
              <li>
                💵 카드 수수료 반영 후 최종 순이익 (2.3% 차감):{" "}
                <strong>{finalProfit.toLocaleString()} 원</strong>
              </li>
            )}
            {profitRate !== null && (
              <li>
                📊 총 매출 대비 순이익률: <strong>{profitRate}%</strong>
              </li>
            )}
            {achievedRate !== null && (
              <>
                <li>
                  🎯 목표 달성률 (순이익 기준):{" "}
                  <strong>{achievedRate?.toLocaleString()}%</strong>
                </li>
                <li>
                  📉 손익분기점까지 추가 필요 순이익:{" "}
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
