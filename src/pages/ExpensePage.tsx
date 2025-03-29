import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "../style/ExpensePage.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

interface VariableExpense {
  id?: number;
  description: string;
  amount: string;
}

interface Store {
  id: number;
  storeName: string;
}

const ExpensePage = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [storeId, setStoreId] = useState<number | null>(null);

  const [storeList, setStoreList] = useState<Store[]>([]);
  const [expenses, setExpenses] = useState<VariableExpense[]>([]);

  // ✅ 매장 목록 불러오기
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/users/checkLogin`, {
          withCredentials: true,
        });
        const userId = res.data.user?.id;

        if (userId) {
          const storeRes = await axios.get(`${API_BASE_URL}/stores/${userId}`);
          const stores = storeRes.data;
          setStoreList(stores);
          if (stores.length > 0) setStoreId(stores[0].id);
        }
      } catch (error) {
        console.error("매장 목록 불러오기 실패:", error);
      }
    };

    fetchStores();
  }, []);

  // ✅ 지출 항목 불러오기
  useEffect(() => {
    const fetchExpenses = async () => {
      if (!storeId) {
        setExpenses([]);
        return;
      }

      try {
        const res = await axios.get(
          `${API_BASE_URL}/variable-expense/${storeId}/${year}/${month}`
        );
        const mapped = res.data.map((item: any) => ({
          id: item.id,
          description: item.name,
          amount: String(item.amount),
        }));
        setExpenses(mapped);
      } catch (error) {
        console.error("지출 항목 불러오기 실패:", error);
        setExpenses([]);
      }
    };

    fetchExpenses();
  }, [storeId, year, month]);

  // ✅ 항목 추가
  const addExpense = () => {
    setExpenses((prev) => [...prev, { description: "", amount: "" }]);
  };

  // ✅ 항목 삭제 (서버 + 프론트)
  const removeExpense = async (index: number) => {
    const target = expenses[index];

    if (target.id) {
      try {
        await axios.delete(`${API_BASE_URL}/variable-expense/${target.id}`);
      } catch (error) {
        console.error("서버 삭제 실패:", error);
        alert("삭제 중 오류 발생");
        return;
      }
    }

    setExpenses((prev) => prev.filter((_, i) => i !== index));
  };

  // ✅ 항목 내용 수정
  const updateExpense = (
    index: number,
    field: "description" | "amount",
    value: string
  ) => {
    setExpenses((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  // ✅ 저장
  const saveExpenses = async () => {
    if (!storeId) return alert("매장을 선택해주세요.");

    const payload = expenses.map((e) => ({
      storeId,
      year,
      month,
      name: e.description,
      amount: parseInt(e.amount) || 0,
    }));

    try {
      await axios.post(`${API_BASE_URL}/variable-expense`, payload);
      alert("변동 지출 항목이 저장되었습니다.");
    } catch (error) {
      console.error("저장 실패:", error);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  const yearOptions = Array.from({ length: 11 }, (_, i) => 2020 + i);
  const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <motion.div
      className="expense-page-container"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="expense-title">
        📊 {year}년 {month}월 변동 지출 관리
      </h2>

      {/* 매장 선택 */}
      <div className="select-container">
        <select
          value={storeId ?? ""}
          onChange={(e) => setStoreId(Number(e.target.value))}
          className="store-select"
        >
          <option value="" disabled>
            매장 선택
          </option>
          {storeList.map((store) => (
            <option key={store.id} value={store.id}>
              {store.storeName}
            </option>
          ))}
        </select>
      </div>

      {/* 연도/월 선택 */}
      <div className="select-container">
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="year-select"
        >
          {yearOptions.map((y) => (
            <option key={y} value={y}>
              {y}년
            </option>
          ))}
        </select>

        <select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          className="month-select"
        >
          {monthOptions.map((m) => (
            <option key={m} value={m}>
              {m}월
            </option>
          ))}
        </select>
      </div>

      {/* 지출 항목 입력 */}
      <div className="expenses-list">
        {expenses.map((expense, index) => (
          <motion.div
            key={index}
            className="expense-item"
            whileHover={{ scale: 1.01 }}
          >
            <input
              type="text"
              placeholder="지출 항목명"
              className="expense-input expense-description"
              value={expense.description}
              onChange={(e) =>
                updateExpense(index, "description", e.target.value)
              }
            />
            <input
              type="number"
              min="0"
              placeholder="금액 (₩)"
              className="expense-input expense-amount"
              value={expense.amount}
              onChange={(e) => updateExpense(index, "amount", e.target.value)}
            />
            <motion.button
              className="remove-button"
              whileTap={{ scale: 0.95 }}
              onClick={() => removeExpense(index)}
            >
              삭제
            </motion.button>
          </motion.div>
        ))}
      </div>

      {/* 버튼들 */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="add-button"
        onClick={addExpense}
      >
        항목 추가
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="save-button"
        onClick={saveExpenses}
      >
        저장하기
      </motion.button>
    </motion.div>
  );
};

export default ExpensePage;
