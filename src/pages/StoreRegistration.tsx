import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../style/StoreRegistration.css";

export default function StoreRegistration() {
  const [storeName, setStoreName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState("");
  const [deposit, setDeposit] = useState("");
  const [premium, setPremium] = useState("");
  const [rent, setRent] = useState("");
  const [maintenance, setMaintenance] = useState("");
  const [initialInvestment, setInitialInvestment] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // 📌 **카카오 주소 검색 API 실행**
  const handleAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: (data: { address: string }) => {
        setAddress(data.address);
      },
    }).open();
  };

  return (
    <div className="store-container">
      <h2 className="store-title">매장 등록</h2>
      <form className="store-form">
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
          <span className="store-description">업종</span>
          <input
            type="text"
            placeholder="업종 입력"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
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
            required
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
            required
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

        {error && <p className="store-error">{error}</p>}

        <button type="submit" className="store-button-submit">
          등록하기
        </button>
      </form>
    </div>
  );
}
