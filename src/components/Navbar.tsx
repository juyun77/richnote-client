import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faHouse } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 로그인 버튼 클릭 시 처리 함수
  const handleLoginClick = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/users/checkLogin`, {
        withCredentials: true,
      });
      if (res.data.isLoggedIn) {
        navigate("/settings");
      } else {
        navigate("/login");
      }
    } catch (err) {
      console.error("로그인 상태 확인 오류:", err);
      navigate("/login");
    }
  };

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ ...styles.navbar, ...(scrolled ? styles.navScrolled : {}) }}
    >
      <div style={styles.navContainer}>
        <motion.div
          style={styles.leftSection}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <Link to="/" style={styles.logoLink}>
            <img src={logo} alt="부자노트 로고" style={styles.logo} />
            <span style={styles.brand}>부자노트</span>
          </Link>
        </motion.div>

        <div style={styles.centerSection}>
          {[
            "dashboard",
            "salesRecord",
            "reports",
            "expenses",
            "inventory",
            "settings",
          ].map((menu, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              <Link to={`/${menu}`} style={styles.link}>
                {menu === "dashboard"
                  ? "대시 보드"
                  : menu === "salesRecord"
                  ? "매출 기록"
                  : menu === "reports"
                  ? "분석 리포트"
                  : menu === "expenses"
                  ? "지출 관리"
                  : menu === "inventory"
                  ? "재고 관리"
                  : "매장 설정"}
              </Link>
            </motion.div>
          ))}
        </div>

        <div style={styles.rightSection}>
          <motion.div
            whileHover={{ scale: 1.2 }}
            transition={{ duration: 0.3 }}
          >
            <Link to="/" style={styles.icon}>
              <FontAwesomeIcon
                icon={faHouse}
                style={{ fontSize: "30px", color: "#333" }}
              />
            </Link>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.2 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={handleLoginClick}
              style={{ all: "unset", cursor: "pointer" }}
            >
              <FontAwesomeIcon
                icon={faUser}
                style={{ fontSize: "30px", color: "#333" }}
              />
            </button>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  navbar: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    background: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(10px)",
    transition: "background 0.3s ease-in-out",
    borderBottom: "2px solid transparent",
    zIndex: 1000,
    display: "flex",
    justifyContent: "center",
  },
  navScrolled: {
    background: "rgba(255, 255, 255, 1)",
    borderBottom: "2px solid #ddd",
  },
  navContainer: {
    width: "100%",
    maxWidth: "1440px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 30px",
  },
  leftSection: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },
  logoLink: {
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
  },
  logo: {
    width: "40px",
    height: "40px",
    marginRight: "10px",
  },
  brand: {
    fontSize: "22px",
    fontWeight: "bold",
    color: "#000",
  },
  centerSection: {
    display: "flex",
    gap: "40px",
    flexWrap: "wrap",
  },
  link: {
    textDecoration: "none",
    color: "#333",
    fontSize: "18px",
    transition: "color 0.3s ease-in-out",
  },
  rightSection: {
    display: "flex",
    gap: "20px",
    flexWrap: "nowrap",
    alignItems: "center",
  },
  icon: {
    textDecoration: "none",
  },
  iconImg: {
    width: "30px",
    height: "30px",
    transition: "transform 0.3s ease-in-out",
  },
};

export default Navbar;
