/* src/pages/SalesRecordPage.tsx */
import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../style/SalesRecordPage.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

/* ───────── 타입 ───────── */
interface Store {
  id: number;
  storeName: string;
}
interface UploadError {
  productName: string;
  reason: string;
}

/* ───────── 컴포넌트 ───────── */
export default function SalesRecordPage() {
  /* ■■■ 상태값 모두 선언 ■■■ */
  const [salesData, setSalesData] = useState<any[]>([]);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [uploadDate, setUploadDate] = useState<Date>(new Date());

  const [storeList, setStoreList] = useState<Store[]>([]);
  const [storeId, setStoreId] = useState<number | null>(null);

  const [totalProfit, setTotalProfit] = useState<number>(0);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedDate, setUploadedDate] = useState<string | null>(null);
  const [uploadErrors, setUploadErrors] = useState<UploadError[]>([]);

  /* ───────── 매장 목록 가져오기 ───────── */
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/users/checkLogin`, {
          withCredentials: true,
        });
        const userId = data.user?.id;
        if (userId) {
          const storeRes = await axios.get(`${API_BASE_URL}/stores/${userId}`);
          setStoreList(storeRes.data);
          if (storeRes.data.length > 0) setStoreId(storeRes.data[0].id);
        }
      } catch (err) {
        console.error("매장 목록 불러오기 실패:", err);
      }
    })();
  }, []);

  /* ───────── 엑셀 업로드 핸들러 ───────── */
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !storeId) {
      alert("매장을 선택해주세요!");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (ev) => {
      const wb = XLSX.read(ev.target?.result as string, { type: "binary" });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const parsed: any[] = XLSX.utils.sheet_to_json(sheet);

      const filled = parsed
        .filter((r) => r["상품명"] || r["productName"])
        .map((r) => ({
          productName: r["상품명"] || r["productName"],
          quantity: parseInt(r["판매수량"] || r["수량"] || r["quantity"]) || 0,
          totalPrice:
            parseInt(r["판매금액"] || r["합계"] || r["totalPrice"]) || 0,
          costPrice: parseInt(r["매입금액"] || r["costPrice"]) || 0,
          profitPrice: parseInt(r["수익금액"] || r["profitPrice"]) || 0,
          barcode: r["바코드"] || r["barcode"] || null,
          date: uploadDate.toISOString().slice(0, 10),
        }));

      setSalesData(filled);
      setTotalProfit(filled.reduce((s, i) => s + (i.profitPrice || 0), 0));

      try {
        await axios.post(`${API_BASE_URL}/sales/upload`, {
          storeId,
          data: filled,
        });

        const { data: deduct } = await axios.post(
          `${API_BASE_URL}/sales/auto-deduct`,
          {
            storeId,
            salesData: filled.map((i) => ({
              productName: i.productName,
              quantity: i.quantity,
            })),
          }
        );

        setUploadErrors(deduct.errors ?? []);
        alert("✅ 매출 데이터 저장 및 재고 차감 완료!");

        setUploadedFileName(file.name);
        setUploadedDate(uploadDate.toISOString().slice(0, 10));
      } catch (err: any) {
        if (err.response?.status === 409) {
          alert("❗ 이미 해당 날짜에 업로드된 데이터가 있습니다.");
        } else {
          console.error(err);
          alert("❗ 업로드 / 재고 차감 중 오류 발생");
        }
      }
    };
    reader.readAsBinaryString(file);
  };

  /* ───────── 기간 조회 ───────── */
  const handleDateRangeSearch = async () => {
    if (!storeId) return alert("매장을 선택해주세요.");
    try {
      const { data } = await axios.get(`${API_BASE_URL}/sales`, {
        params: {
          storeId,
          startDate: startDate.toISOString().slice(0, 10),
          endDate: endDate.toISOString().slice(0, 10),
        },
      });
      setSalesData(data);
      setTotalProfit(
        data.reduce((s: number, i: any) => s + (i.profitPrice || 0), 0)
      );
    } catch (err) {
      console.error(err);
      alert("조회 중 오류 발생");
    }
  };

  /* ───────── JSX ───────── */
  return (
    <div className="sales-record-container">
      <h2>📈 매출 기록 업로드 / 조회</h2>

      {/* 필터 & 업로드 */}
      <div className="sales-filter-controls">
        {/* 매장 */}
        <div className="field-group">
          <label>🏬 매장 선택</label>
          <select
            value={storeId ?? ""}
            onChange={(e) => setStoreId(Number(e.target.value))}
          >
            <option value="" disabled>
              매장을 선택하세요
            </option>
            {storeList.map((s) => (
              <option key={s.id} value={s.id}>
                {s.storeName}
              </option>
            ))}
          </select>
        </div>

        {/* 판매 날짜 */}
        <div className="field-group">
          <label>📅 판매 기록 날짜(엑셀용)</label>
          <DatePicker
            selected={uploadDate}
            onChange={(d) => d && setUploadDate(d)}
            dateFormat="yyyy-MM-dd"
            className="date-picker-input"
          />
          <small className="hint">※ 이 날짜로 모든 행이 저장됩니다</small>
        </div>

        {/* 파일 업로드 */}
        <div className="field-group">
          <label className="file-label">📂 매출 엑셀 업로드</label>
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileUpload}
          />
          <small className="hint">.xlsx / .xls / .csv 지원</small>
        </div>

        {/* 조회 기간 */}
        <div className="field-group">
          <label>🔍 조회 기간</label>
          <div className="range-row">
            <DatePicker
              selected={startDate}
              onChange={(d) => d && setStartDate(d)}
              dateFormat="yyyy-MM-dd"
              className="date-picker-input"
            />
            <span>~</span>
            <DatePicker
              selected={endDate}
              onChange={(d) => d && setEndDate(d)}
              dateFormat="yyyy-MM-dd"
              className="date-picker-input"
            />
            <button onClick={handleDateRangeSearch}>기간 조회</button>
          </div>
          <small className="hint">※ 버튼을 누르면 테이블이 갱신됩니다</small>
        </div>
      </div>

      {/* 업로드 정보 */}
      {uploadedFileName && uploadedDate && (
        <div className="upload-info">
          <p>
            ✅ 업로드 파일: <strong>{uploadedFileName}</strong>
          </p>
          <p>
            ✅ 업로드 날짜: <strong>{uploadedDate}</strong>
          </p>
        </div>
      )}

      {/* 매칭 실패 */}
      {uploadErrors.length > 0 && (
        <div className="upload-errors">
          <h4>❗ 매칭 실패 / 재고 부족</h4>
          <ul>
            {uploadErrors.map((e, i) => (
              <li key={i}>
                {e.productName} - {e.reason}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 총 수익 */}
      {salesData.length > 0 && (
        <h3 className="total-profit">
          💰 총 수익: {totalProfit.toLocaleString()}원
        </h3>
      )}

      {/* 테이블 */}
      <div className="sales-table">
        {salesData.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>상품명</th>
                <th>판매수량</th>
                <th>판매금액</th>
                <th>매입금액</th>
                <th>수익금액</th>
                <th>바코드</th>
                <th>판매날짜</th>
              </tr>
            </thead>
            <tbody>
              {salesData.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.productName}</td>
                  <td>{row.quantity}</td>
                  <td>{row.totalPrice.toLocaleString()}</td>
                  <td>{row.costPrice.toLocaleString()}</td>
                  <td>{row.profitPrice.toLocaleString()}</td>
                  <td>{row.barcode ?? "-"}</td>
                  <td>{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
