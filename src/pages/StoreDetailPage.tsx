// StoreDetailPage.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../style/StoreDetailPage.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

interface Store {
  id: number;
  storeName: string;
  address: string;
  phoneNumber: string;
  deposit: number;
  premium: number;
  monthlyRent: number;
  maintenanceFee: number;
  initialInvestment: number;
}

export default function StoreDetailPage() {
  const { storeId } = useParams<{ storeId: string }>();
  const [store, setStore] = useState<Store | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/stores/detail/${storeId}`,
          {
            withCredentials: true,
          }
        );
        setStore(res.data);
      } catch (err) {
        console.error("매장 정보 조회 실패:", err);
        alert("매장 정보를 불러올 수 없습니다.");
        navigate("/settings");
      }
    };

    if (storeId) fetchStore();
  }, [storeId, navigate]);

  if (!store) {
    return <div className="store-detail-container">불러오는 중...</div>;
  }

  return (
    <div className="store-detail-container">
      <h2>🏪 매장 상세 정보</h2>
      <p>
        <strong>매장명:</strong> {store.storeName}
      </p>
      <p>
        <strong>주소:</strong> {store.address}
      </p>
      <p>
        <strong>전화번호:</strong> {store.phoneNumber}
      </p>
      <p>
        <strong>보증금:</strong> {store.deposit.toLocaleString()} 원
      </p>
      <p>
        <strong>권리금:</strong> {store.premium.toLocaleString()} 원
      </p>
      <p>
        <strong>월세:</strong> {store.monthlyRent.toLocaleString()} 원
      </p>
      <p>
        <strong>관리비:</strong> {store.maintenanceFee.toLocaleString()} 원
      </p>
      <p>
        <strong>초기 투자 비용:</strong>{" "}
        {store.initialInvestment.toLocaleString()} 원
      </p>

      <button onClick={() => navigate(-1)}>← 돌아가기</button>
    </div>
  );
}
