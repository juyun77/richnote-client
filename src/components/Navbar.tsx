import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faHouse } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
          {["dashboard", "sales", "reports", "settings"].map((menu, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              <Link to={`/${menu}`} style={styles.link}>
                {menu === "dashboard"
                  ? "대시 보드"
                  : menu === "sales"
                  ? "매출 기록"
                  : menu === "reports"
                  ? "분석 리포트"
                  : "설정"}
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
            <Link to="/login" style={styles.icon}>
              <FontAwesomeIcon
                icon={faUser}
                style={{ fontSize: "30px", color: "#333" }}
              />
            </Link>
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
    justifyContent: "center", // 네비게이션을 중앙에 배치
  },
  navScrolled: {
    background: "rgba(255, 255, 255, 1)",
    borderBottom: "2px solid #ddd",
  },
  navContainer: {
    width: "100%",
    maxWidth: "1440px", // 데스크탑 화면 최대 너비 설정
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
    flexWrap: "nowrap", // 줄바꿈 방지
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
