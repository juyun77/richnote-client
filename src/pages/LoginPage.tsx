import { useState } from "react";
import styled from "styled-components";
//import axios from "axios";

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
  max-width: 400px;
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

interface ButtonProps {
  kakao?: boolean;
}

const Button = styled.button<ButtonProps>`
  width: 100%;
  max-width: 430px;
  padding: 1rem;
  font-size: 1.2rem;
  font-weight: bold;
  border-radius: 8px;
  background: ${(props) => (props.kakao ? "#FEE500" : "#2563EB")};
  color: ${(props) => (props.kakao ? "#000" : "#FFF")};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  border: none;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
`;

const KakaoIcon = styled.img`
  width: 28px;
  height: 28px;
`;

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // 로그인 요청 로직 (백엔드 연결 후 활성화)
    // try {
    //   const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/login`, {
    //     email,
    //     password,
    //   });
    //   localStorage.setItem("token", response.data.token);
    //   navigate("/dashboard");
    // } catch (err) {
    //   setError(err.response?.data?.message || "로그인 실패");
    // }
  };

  const handleKakaoLogin = () => {
    window.location.href = `http://13.124.25.138:8081/api/users/kakao`;
  };

  return (
    <Container>
      <Card>
        <Title>로그인</Title>
        <Form onSubmit={handleLogin}>
          <Input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p style={{ color: "red", fontSize: "1rem" }}>{error}</p>}
          <Button type="submit">로그인</Button>
        </Form>
        <ButtonGroup>
          <Button kakao onClick={handleKakaoLogin}>
            <KakaoIcon src="/images/kakao.png" alt="Kakao Login" />
            카카오 로그인
          </Button>
        </ButtonGroup>
      </Card>
    </Container>
  );
}
