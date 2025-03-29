// StoreForm.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../style/StoreForm.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

interface StoreFormProps {
  mode: "create" | "edit";
  initialData?: {
    storeName: string;
    address: string;
    phone: string;
    deposit: string;
    premium: string;
    rent: string;
    maintenance: string;
    initialInvestment: string;
  };
}

export default function StoreForm({ mode, initialData }: StoreFormProps) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    storeName: initialData?.storeName || "",
    address: initialData?.address || "",
    phone: initialData?.phone || "",
    deposit: initialData?.deposit || "0",
    premium: initialData?.premium || "0",
    rent: initialData?.rent || "0",
    maintenance: initialData?.maintenance || "0",
    initialInvestment: initialData?.initialInvestment || "0",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        storeName: form.storeName,
        address: form.address,
        phoneNumber: form.phone,
        deposit: parseInt(form.deposit),
        premium: parseInt(form.premium),
        monthlyRent: parseInt(form.rent),
        maintenanceFee: parseInt(form.maintenance),
        initialInvestment: parseInt(form.initialInvestment),
      };

      if (mode === "create") {
        await axios.post(`${API_BASE_URL}/stores`, payload, {
          withCredentials: true,
        });
      } else {
        const id = window.location.pathname.split("/").at(-2); // ✅ 수정된 부분
        await axios.patch(`${API_BASE_URL}/stores/${id}`, payload, {
          withCredentials: true,
        });
      }

      alert("저장되었습니다.");
      navigate("/settings");
    } catch (err) {
      console.error("저장 실패:", err);
      alert("저장 중 오류 발생");
    }
  };

  return (
    <div className="store-form-container">
      <h2>{mode === "create" ? "매장 등록" : "매장 수정"}</h2>
      <form onSubmit={handleSubmit} className="store-form">
        <label>
          매장 이름
          <input
            name="storeName"
            value={form.storeName}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          주소
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          전화번호
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          보증금 (원)
          <input name="deposit" value={form.deposit} onChange={handleChange} />
        </label>

        <label>
          권리금 (원)
          <input name="premium" value={form.premium} onChange={handleChange} />
        </label>

        <label>
          월세 (원)
          <input name="rent" value={form.rent} onChange={handleChange} />
        </label>

        <label>
          관리비 (원)
          <input
            name="maintenance"
            value={form.maintenance}
            onChange={handleChange}
          />
        </label>

        <label>
          초기 투자 비용 (인터리어, 집기 등) (원)
          <input
            name="initialInvestment"
            value={form.initialInvestment}
            onChange={handleChange}
          />
        </label>

        <button type="submit">
          {mode === "create" ? "등록하기" : "수정하기"}
        </button>
      </form>
    </div>
  );
}
