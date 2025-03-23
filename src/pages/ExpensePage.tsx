import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "../style/ExpensePage.css";

const ExpensePage = () => {
  // 월과 년도 상태 관리
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  // 변동 지출 목록 상태
  const [variableExpenses, setVariableExpenses] = useState<
    { description: string; amount: string }[]
  >([]);

  // 항목 추가
  const handleAddExpense = () => {
    setVariableExpenses((prev) => [...prev, { description: "", amount: "" }]);
  };

  // 항목 삭제
  const handleRemoveExpense = (index: number) => {
    setVariableExpenses((prev) => prev.filter((_, i) => i !== index));
  };

  // 항목 내용 변경
  const handleChangeVariable = (
    index: number,
    field: "description" | "amount",
    value: string
  ) => {
    setVariableExpenses((prev) => {
      const newExpenses = [...prev];
      newExpenses[index][field] = value;
      return newExpenses;
    });
  };

  // 저장
  const handleSave = async () => {
    const payload = {
      year,
      month,
      expenses: variableExpenses.map((expense) => ({
        description: expense.description,
        amount: parseInt(expense.amount) || 0,
      })),
    };

    try {
      const response = await axios.post("/api/expenses", payload);
      console.log("저장 완료:", response.data);
      alert("변동 지출 항목이 저장되었습니다.");
    } catch (error) {
      console.error("저장 실패:", error);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

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

      {/* 년도 선택 */}
      <div className="select-container">
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="year-select"
        >
          {/* 필요에 따라 보여줄 년도를 조정하세요. */}
          {/* 예) 2020년부터 2030년까지 */}
          {[...Array(11)].map((_, i) => {
            const displayYear = 2020 + i;
            return (
              <option key={displayYear} value={displayYear}>
                {displayYear}년
              </option>
            );
          })}
        </select>

        {/* 월 선택 */}
        <select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          className="month-select"
        >
          {[...Array(12)].map((_, i) => (
            <option key={i} value={i + 1}>
              {i + 1}월
            </option>
          ))}
        </select>
      </div>

      {/* 지출 항목 리스트 */}
      <div className="expenses-list">
        {variableExpenses.map((expense, index) => (
          <motion.div
            key={index}
            className="expense-item"
            whileHover={{ scale: 1.01 }}
          >
            <input
              type="text"
              className="expense-input expense-description"
              placeholder="지출 항목명"
              value={expense.description}
              onChange={(e) =>
                handleChangeVariable(index, "description", e.target.value)
              }
            />

            <input
              type="number"
              min="0"
              className="expense-input expense-amount"
              placeholder="금액 (₩)"
              value={expense.amount}
              onChange={(e) =>
                handleChangeVariable(index, "amount", e.target.value)
              }
            />

            <motion.button
              className="remove-button"
              whileTap={{ scale: 0.95 }}
              onClick={() => handleRemoveExpense(index)}
            >
              삭제
            </motion.button>
          </motion.div>
        ))}
      </div>

      {/* 항목 추가 버튼 */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="add-button"
        onClick={handleAddExpense}
      >
        항목 추가
      </motion.button>

      {/* 저장 버튼 */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="save-button"
        onClick={handleSave}
      >
        저장하기
      </motion.button>
    </motion.div>
  );
};

export default ExpensePage;
