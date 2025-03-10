import { combineReducers } from "@reduxjs/toolkit";
// import salesReducer from "./slices/salesSlice";
// import expensesReducer from "./slices/expensesSlice";
// import authReducer from "./slices/authSlice";

const rootReducer = combineReducers({
  //   sales: salesReducer,
  //   expenses: expensesReducer,
  //   auth: authReducer,
});

export default rootReducer;

// 🚀 해결 방법: 빈 `export {}` 추가
export {};
