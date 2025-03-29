import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../style/StoreRegistration.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function StoreRegistration() {
  const [storeName, setStoreName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [deposit, setDeposit] = useState("");
  const [premium, setPremium] = useState("");
  const [rent, setRent] = useState("");
  const [maintenance, setMaintenance] = useState("");
  const [initialInvestment, setInitialInvestment] = useState("");
  const [userId, setUserId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/users/checkLogin`, {
          withCredentials: true,
        });
        if (res.data.isLoggedIn) {
          setUserId(res.data.user.id);
        } else {
          toast.warn("로그인이 필요합니다.", {
            autoClose: 2000,
            onClose: () => navigate("/login"),
          });
        }
      } catch (err) {
        console.error("로그인 상태 확인 실패", err);
        toast.error("로그인 확인 중 오류 발생", {
          autoClose: 2000,
          onClose: () => navigate("/login"),
        });
      }
    };

    fetchUser();
  }, [navigate]);

  const handleAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: (data: { address: string }) => {
        setAddress(data.address);
      },
    }).open();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!storeName || !address || !phoneNumber || !deposit || !rent) {
      setError("필수 항목을 모두 입력해주세요.");
      return;
    }

    const storeData = {
      userId,
      storeName,
      address,
      phoneNumber,
      deposit: Number(deposit),
      premium: Number(premium),
      monthlyRent: Number(rent),
      maintenanceFee: Number(maintenance),
      initialInvestment: Number(initialInvestment),
    };

    console.log("보낼 데이터 확인:", storeData);

    try {
      await axios.post(`${API_BASE_URL}/stores/`, storeData, {
        withCredentials: true,
      });

      toast.success("매장이 성공적으로 등록되었습니다.", {
        autoClose: 2500,
        onClose: () => navigate("/settings"),
      });
    } catch (err) {
      console.error("등록 오류:", err);
      toast.error("매장 등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="store-container">
      <ToastContainer
        position="top-center"
        autoClose={2500}
        hideProgressBar
        pauseOnHover={false}
      />
      <h2 className="store-title">매장 등록</h2>
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
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
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
