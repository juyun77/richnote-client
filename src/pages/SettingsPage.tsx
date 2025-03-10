import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(to right, #1e3a8a, #1f2937);
`;

const Card = styled.div`
  width: 100%;
  max-width: 500px;
  padding: 3rem;
  background-color: #1f2937;
  border-radius: 12px;
  box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.3);
  color: white;
  text-align: center;
`;

const Title = styled.h2`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  font-size: 1.2rem;
  border-radius: 8px;
  background: #374151;
  border: none;
  color: white;
  text-align: center;
  &:focus {
    outline: 3px solid #3b82f6;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 1rem;
  font-size: 1.2rem;
  font-weight: bold;
  border-radius: 8px;
  background: #2563eb;
  color: white;
  border: none;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
`;

export default function StoreRegistration() {
  const [storeName, setStoreName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState("");

  // 고정 비용 항목
  const [deposit, setDeposit] = useState(""); // 보증금
  const [premium, setPremium] = useState(""); // 권리금
  const [rent, setRent] = useState(""); // 월세
  const [maintenance, setMaintenance] = useState(""); // 관리비

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // 가게 등록 요청 (백엔드 연동 시)
    // try {
    //   const response = await axios.post("https://api.example.com/store", {
    //     storeName,
    //     address,
    //     phone,
    //     category,
    //     deposit,
    //     premium,
    //     rent,
    //     maintenance,
    //   });
    //   navigate("/dashboard");
    // } catch (err) {
    //   setError(err.response?.data?.message || "등록 실패");
    // }
  };

  return (
    <Container>
      <Card>
        <Title>가게 등록</Title>
        <Form onSubmit={handleRegister}>
          <Input
            type="text"
            placeholder="가게 이름"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            required
          />
          <Input
            type="text"
            placeholder="주소"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
          <Input
            type="text"
            placeholder="전화번호"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <Input
            type="text"
            placeholder="업종"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />

          {/* 고정 지출 입력 */}
          <Input
            type="number"
            placeholder="보증금 (원)"
            value={deposit}
            onChange={(e) => setDeposit(e.target.value)}
            required
          />
          <Input
            type="number"
            placeholder="권리금 (원)"
            value={premium}
            onChange={(e) => setPremium(e.target.value)}
          />
          <Input
            type="number"
            placeholder="월세 (원)"
            value={rent}
            onChange={(e) => setRent(e.target.value)}
            required
          />
          <Input
            type="number"
            placeholder="관리비 (원)"
            value={maintenance}
            onChange={(e) => setMaintenance(e.target.value)}
          />

          {error && <p style={{ color: "red", fontSize: "1rem" }}>{error}</p>}
          <Button type="submit">등록하기</Button>
        </Form>
      </Card>
    </Container>
  );
}
