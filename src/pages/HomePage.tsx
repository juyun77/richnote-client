import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import backgroundImage from "../assets/background2.jpg";
import React from "react";

const HomePage = () => {
  return (
    <div style={styles.pageContainer}>
      <div style={styles.overlay}></div> {/* 어두운 필터 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        style={styles.content}
      >
        {/* 상단 작은 문구 */}
        <motion.p
          style={styles.smallText}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          사업은 돈을 벌기 위해 하는 것입니다. 하지만, 돈이 어디서 새고 있는지
          모르면 망하는 지름길입니다.
        </motion.p>

        {/* 메인 타이틀 */}
        <motion.h1
          style={styles.bigText}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          매출을 체계적으로 관리하고 <br /> 더 큰 수익을 창출하세요.
        </motion.h1>

        {/* CTA 버튼 */}
        <motion.div
          style={styles.buttonContainer}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Link to="/dashboard">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              style={styles.button}
            >
              📊 지금 시작하기
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  pageContainer: {
    position: "relative",
    width: "100%",
    height: "100vh",
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    color: "white",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    zIndex: 1,
  },
  content: {
    position: "relative",
    zIndex: 2,
    maxWidth: "800px",
    padding: "20px",
  },
  smallText: {
    fontSize: "20px",
    fontWeight: "500",
    marginBottom: "20px",
    color: "#f1f1f1",
    textShadow: "2px 2px 10px rgba(0, 0, 0, 0.8)",
  },
  bigText: {
    fontSize: "48px",
    fontWeight: "bold",
    lineHeight: "1.4",
    marginBottom: "40px",
    textShadow: "3px 3px 15px rgba(0, 0, 0, 1)",
  },
  buttonContainer: {
    marginTop: "20px",
  },
  button: {
    padding: "14px 28px",
    fontSize: "20px",
    fontWeight: "bold",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#FF9800",
    color: "white",
    cursor: "pointer",
    transition: "background 0.3s ease-in-out",
    boxShadow: "0 4px 15px rgba(255, 152, 0, 0.7)",
  },
};

export default HomePage;
