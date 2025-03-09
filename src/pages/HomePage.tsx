import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>🚀 매출 관리 시스템</h1>
      <p>쉽고 빠르게 매출과 지출을 관리하세요.</p>

      <div style={{ marginTop: "20px" }}>
        <Link to="/dashboard">
          <button>📊 대시보드</button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
