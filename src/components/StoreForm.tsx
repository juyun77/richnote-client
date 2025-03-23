import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../style/StoreRegistration.css";
interface StoreFormProps {
  mode: "create" | "edit";
  initialData?: {
    storeName: string;
    address: string;
    phone: string;
    deposit?: string;
    premium?: string;
    rent?: string;
    maintenance?: string;
    initialInvestment?: string;
  };
}

export default function StoreForm({ mode, initialData }: StoreFormProps) {
  const [storeName, setStoreName] = useState(initialData?.storeName || "");
  const [address, setAddress] = useState(initialData?.address || "");
  const [phone, setPhone] = useState(initialData?.phone || "");
  const [deposit, setDeposit] = useState(initialData?.deposit || "");
  const [premium, setPremium] = useState(initialData?.premium || "");
  const [rent, setRent] = useState(initialData?.rent || "");
  const [maintenance, setMaintenance] = useState(
    initialData?.maintenance || ""
  );
  const [initialInvestment, setInitialInvestment] = useState(
    initialData?.initialInvestment || ""
  );

  const navigate = useNavigate();

  const handleAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: (data: { address: string }) => {
        setAddress(data.address);
      },
    }).open();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // mode에 따라 create 또는 edit 처리 분기
    if (mode === "create") {
      console.log("매장 등록:", {
        storeName,
        address,
        phone,
        deposit,
        premium,
        rent,
        maintenance,
        initialInvestment,
      });
    } else {
      console.log("매장 수정:", {
        storeName,
        address,
        phone,
        deposit,
        premium,
        rent,
        maintenance,
        initialInvestment,
      });
    }
    navigate("/settings");
  };

  return (
    <div className="store-container">
      <h2 className="store-title">
        {mode === "create" ? "매장 등록" : "매장 수정"}
      </h2>
      <form className="store-form" onSubmit={handleSubmit}>
        <div className="store-form-group">
          <span className="store-description">매장 이름</span>
          <input
            type="text"
            placeholder="입력하세요"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            required
            className="store-input"
          />
        </div>

        <div className="store-form-group">
          <span className="store-description">주소</span>
          <div className="store-address-wrapper">
            <input
              type="text"
              placeholder="주소를 선택하세요"
              value={address}
              readOnly
              required
              className="store-input"
            />
            <button
              type="button"
              onClick={handleAddressSearch}
              className="store-button"
            >
              검색
            </button>
          </div>
        </div>

        <div className="store-form-group">
          <span className="store-description">전화번호</span>
          <input
            type="text"
            placeholder="숫자만 입력"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="store-input"
          />
        </div>

        <div className="store-form-group">
          <span className="store-description">보증금 (원)</span>
          <input
            type="number"
            placeholder="금액 (₩)"
            value={deposit}
            onChange={(e) => setDeposit(e.target.value)}
            className="store-input"
          />
        </div>

        <div className="store-form-group">
          <span className="store-description">권리금 (원)</span>
          <input
            type="number"
            placeholder="금액 (₩)"
            value={premium}
            onChange={(e) => setPremium(e.target.value)}
            className="store-input"
          />
        </div>

        <div className="store-form-group">
          <span className="store-description">월세 (원)</span>
          <input
            type="number"
            placeholder="금액 (₩)"
            value={rent}
            onChange={(e) => setRent(e.target.value)}
            className="store-input"
          />
        </div>

        <div className="store-form-group">
          <span className="store-description">관리비 (원)</span>
          <input
            type="number"
            placeholder="금액 (₩)"
            value={maintenance}
            onChange={(e) => setMaintenance(e.target.value)}
            className="store-input"
          />
        </div>

        <div className="store-form-group">
          <span className="store-description">
            초기 투자 비용 (인테리어, 집기 등) (원)
          </span>
          <input
            type="number"
            placeholder="금액 (₩)"
            value={initialInvestment}
            onChange={(e) => setInitialInvestment(e.target.value)}
            className="store-input"
          />
        </div>

        <button type="submit" className="store-button-submit">
          {mode === "create" ? "등록하기" : "수정하기"}
        </button>
      </form>
    </div>
  );
}
