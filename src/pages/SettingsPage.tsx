import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../style/SettingsPage.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

interface Store {
  id: number;
  storeName: string;
  address: string;
  phoneNumber: string;
}

export default function SettingsPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginAndFetchStores = async () => {
      try {
        const loginRes = await axios.get(`${API_BASE_URL}/users/checkLogin`, {
          withCredentials: true,
        });
        if (!loginRes.data.isLoggedIn) {
          //toast.warn("로그인이 필요합니다.");
          navigate("/login");
          return;
        }

        const user = loginRes.data.user;

        const storesRes = await axios.get(`${API_BASE_URL}/stores/${user.id}`, {
          withCredentials: true,
        });
        setStores(storesRes.data);
      } catch (err) {
        console.error("에러 발생:", err);
        toast.error("서버 연결 오류, 로그인 페이지로 이동합니다.");
        navigate("/login");
      }
    };

    checkLoginAndFetchStores();
  }, [navigate]);

  const handleDelete = async (storeId: number) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await axios.delete(`${API_BASE_URL}/stores/${storeId}`, {
          withCredentials: true,
        });
        setStores(stores.filter((store) => store.id !== storeId));
        toast.success("매장이 삭제되었습니다.");
      } catch (err) {
        console.error("삭제 오류:", err);
        toast.error("삭제 중 문제가 발생했습니다.");
      }
    }
  };

  return (
    <div className="settings-container">
      <ToastContainer position="top-center" autoClose={2000} hideProgressBar />
      <h2 className="settings-title">내 매장 목록</h2>

      <div style={{ textAlign: "right", marginBottom: "20px" }}>
        <button
          onClick={() => navigate("/store/register")}
          style={{
            padding: "8px 16px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          매장 등록
        </button>
      </div>

      <div className="store-list">
        {stores.length === 0 && (
          <p style={{ textAlign: "center", color: "#888" }}>
            등록된 매장이 없습니다.
          </p>
        )}
        {stores.map((store) => (
          <div key={store.id} className="store-card">
            <h3>{store.storeName}</h3>
            <p>{store.address}</p>
            <p>전화번호: {store.phoneNumber}</p>
            <div className="store-actions">
              <Link to={`/store/${store.id}`}>상세보기</Link>
              <button onClick={() => navigate(`/store/${store.id}/edit`)}>
                수정
              </button>
              <button onClick={() => handleDelete(store.id)}>삭제</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
