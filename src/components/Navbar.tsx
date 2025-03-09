import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import homeIcon from "../assets/logo.png";
import userIcon from "../assets/logo.png";

const Navbar = () => {
  return (
    <nav style={styles.navbar}>
      {/* 왼쪽: 로고 및 부자노트 */}
      <div style={styles.leftSection}>
        <img src={logo} alt="부자노트 로고" style={styles.logo} />
        <span style={styles.brand}>부자노트</span>
      </div>

      {/* 중앙: 네비게이션 메뉴 */}
      <div style={styles.centerSection}>
        <Link to="/dashboard" style={styles.link}>
          대시 보드
        </Link>
        <Link to="/sales" style={styles.link}>
          매출 기록
        </Link>
        <Link to="/reports" style={styles.link}>
          분석 리포트
        </Link>
        <Link to="/settings" style={styles.link}>
          설정
        </Link>
      </div>

      {/* 오른쪽: 홈, 유저 아이콘 */}
      <div style={styles.rightSection}>
        <Link to="/" style={styles.icon}>
          <img src={homeIcon} alt="홈" style={styles.iconImg} />
        </Link>
        <Link to="/profile" style={styles.icon}>
          <img src={userIcon} alt="사용자" style={styles.iconImg} />
        </Link>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 30px",
    background: "#F5F5F5",
    borderBottom: "2px solid #ddd",
  },
  leftSection: {
    display: "flex",
    alignItems: "center",
  },
  logo: {
    width: "30px",
    height: "30px",
    marginRight: "10px",
  },
  brand: {
    fontSize: "18px",
    fontWeight: "bold",
  },
  centerSection: {
    display: "flex",
    gap: "40px",
  },
  link: {
    textDecoration: "none",
    color: "#333",
    fontSize: "16px",
    fontWeight: "500",
  },
  rightSection: {
    display: "flex",
    gap: "20px",
  },
  icon: {
    textDecoration: "none",
  },
  iconImg: {
    width: "24px",
    height: "24px",
  },
};

export default Navbar;
