import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import "../style/SalesRecordPage.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

interface Store {
  id: number;
  storeName: string;
}

export default function SalesRecordPage() {
  const [salesData, setSalesData] = useState<any[]>([]);
  const [detectedDate, setDetectedDate] = useState<string>("");

  const [startDate, setStartDate] = useState<string>(
    new Date().toISOString().substring(0, 10)
  );
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().substring(0, 10)
  );

  const [storeList, setStoreList] = useState<Store[]>([]);
  const [storeId, setStoreId] = useState<number | null>(null);

  // ✅ 매장 목록 불러오기
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/users/checkLogin`, {
          withCredentials: true,
        });
        const userId = res.data.user?.id;

        if (userId) {
          const storeRes = await axios.get(`${API_BASE_URL}/stores/${userId}`);
          const stores = storeRes.data;
          setStoreList(stores);
          if (stores.length > 0) setStoreId(stores[0].id);
        }
      } catch (error) {
        console.error("매장 목록 불러오기 실패:", error);
      }
    };

    fetchStores();
  }, []);

  // ✅ 엑셀 파일 업로드 & 서버 저장
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !storeId) return alert("매장을 선택해주세요!");

    const reader = new FileReader();

    reader.onload = async (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: "binary" });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData: any[] = XLSX.utils.sheet_to_json(sheet);

      setSalesData(parsedData);

      const firstRow = parsedData[0];
      const dateKey = Object.keys(firstRow).find(
        (key) => key.includes("날짜") || key.toLowerCase().includes("date")
      );
      if (dateKey && firstRow[dateKey]) {
        setDetectedDate(firstRow[dateKey]);
      }

      try {
        await axios.post(`${API_BASE_URL}/sales/upload`, {
          storeId,
          data: parsedData,
        });
        alert("매출 데이터가 서버에 저장되었습니다.");
      } catch (err) {
        console.error("업로드 실패:", err);
        alert("서버 업로드 실패");
      }
    };

    reader.readAsBinaryString(file);
  };

  // ✅ 기간 조회
  const handleDateRangeSearch = async () => {
    if (!storeId) return alert("매장을 선택해주세요.");

    try {
      const res = await axios.get(`${API_BASE_URL}/sales`, {
        params: { storeId, startDate, endDate },
      });
      setSalesData(res.data);
      setDetectedDate("");
    } catch (err) {
      console.error("조회 실패:", err);
      alert("조회 중 오류 발생");
    }
  };

  return (
    <div className="sales-record-container">
      <h2>📈 매출 기록 업로드 및 조회</h2>

      {/* ✅ 매장 선택 */}
      <div className="sales-date-filter">
        <label>매장 선택: </label>
        <select
          value={storeId ?? ""}
          onChange={(e) => setStoreId(Number(e.target.value))}
        >
          <option value="" disabled>
            매장을 선택하세요
          </option>
          {storeList.map((store) => (
            <option key={store.id} value={store.id}>
              {store.storeName}
            </option>
          ))}
        </select>
      </div>

      {/* ✅ 날짜 선택 */}
      <div className="sales-date-filter">
        <label>조회 시작일: </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <label style={{ marginLeft: "10px" }}>종료일: </label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button onClick={handleDateRangeSearch} className="store-button-submit">
          기간 조회
        </button>
      </div>

      {detectedDate && (
        <p className="detected-date">
          엑셀 파일 내 감지된 날짜: {detectedDate}
        </p>
      )}

      {/* ✅ 파일 업로드 */}
      <input
        type="file"
        accept=".xlsx, .xls, .csv"
        onChange={handleFileUpload}
      />

      {/* ✅ 데이터 테이블 */}
      <div className="sales-table">
        {salesData.length > 0 && (
          <table>
            <thead>
              <tr>
                {Object.keys(salesData[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {salesData.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value, idx) => (
                    <td key={idx}>{value as string}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
