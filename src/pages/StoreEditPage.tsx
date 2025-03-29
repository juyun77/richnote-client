// StoreEditPage.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import StoreForm from "../components/StoreForm";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function StoreEditPage() {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const [storeData, setStoreData] = useState<any>(null);

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/stores/${storeId}`, {
          withCredentials: true,
        });
        const data = Array.isArray(res.data) ? res.data[0] : res.data;
        setStoreData(data);
      } catch (err) {
        console.error("매장 정보 불러오기 실패:", err);
        navigate("/settings");
      }
    };

    fetchStoreData();
  }, [storeId, navigate]);

  return storeData ? (
    <StoreForm
      mode="edit"
      initialData={{
        storeName: storeData.storeName,
        address: storeData.address,
        phone: storeData.phoneNumber,
        deposit: storeData.deposit?.toString(),
        premium: storeData.premium?.toString(),
        rent: storeData.monthlyRent?.toString(),
        maintenance: storeData.maintenanceFee?.toString(),
        initialInvestment: storeData.initialInvestment?.toString(),
      }}
    />
  ) : (
    <p>로딩 중...</p>
  );
}
