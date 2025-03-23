import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import StoreForm from "../components/StoreForm";

// import axios from "axios";
import "../style/SettingsPage.css";

interface Store {
  id: number;
  storeName: string;
  address: string;
  phone: string;
}

export default function SettingsPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // 더미 데이터로 테스트
    const dummyStores: Store[] = [
      {
        id: 1,
        storeName: "제로스토어 강남점",
        address: "서울특별시 강남구 테헤란로 123",
        phone: "010-1234-5678",
      },
      {
        id: 2,
        storeName: "제로스토어 신림점",
        address: "서울특별시 관악구 신림로 456",
        phone: "010-8765-4321",
      },
    ];
    setStores(dummyStores);
  }, []);

  const handleDelete = (storeId: number) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      setStores(stores.filter((store) => store.id !== storeId));
    }
  };

  return (
    <div className="settings-container">
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
        {stores.map((store) => (
          <div key={store.id} className="store-card">
            <h3>{store.storeName}</h3>
            <p>{store.address}</p>
            <p>전화번호: {store.phone}</p>
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

// StoreForm 컴포넌트를 따로 생성해, props로 mode("create" / "edit")와 초기값(store)을 받아 재사용하면 됩니다.
