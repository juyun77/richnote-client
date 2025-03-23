import { useState } from "react";
import * as XLSX from "xlsx";
// import axios from "axios";
import "../style/SalesRecordPage.css";

export default function SalesRecordPage() {
  const [salesData, setSalesData] = useState<any[]>([]);
  const [detectedDate, setDetectedDate] = useState<string>("");
  const [startDate, setStartDate] = useState<string>(
    new Date().toISOString().substring(0, 10)
  );
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().substring(0, 10)
  );

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const parsedData: any[] = XLSX.utils.sheet_to_json(sheet);

        setSalesData(parsedData);

        if (parsedData.length > 0) {
          const firstRow = parsedData[0];
          const dateKey = Object.keys(firstRow).find(
            (key) => key.includes("날짜") || key.toLowerCase().includes("date")
          );

          if (dateKey && firstRow[dateKey]) {
            setDetectedDate(firstRow[dateKey]);
          }
        }

        // 서버 업로드 (백엔드 연결 시 사용)
        // axios
        //   .post("/api/sales/upload", { data: parsedData })
        //   .then(() => alert("매출 데이터가 성공적으로 저장되었습니다."))
        //   .catch((err) => console.error("업로드 실패:", err));
      };

      reader.readAsBinaryString(file);
    }
  };

  const handleDateRangeSearch = () => {
    // axios
    //   .get(`/api/sales?startDate=${startDate}&endDate=${endDate}`)
    //   .then((response) => setSalesData(response.data))
    //   .catch((err) => console.error("조회 실패:", err));

    alert(`조회: ${startDate} ~ ${endDate}`);
  };

  return (
    <div className="sales-record-container">
      <h2>매출 기록 엑셀 업로드 및 기간별 조회</h2>

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

      <input
        type="file"
        accept=".xlsx, .xls, .csv"
        onChange={handleFileUpload}
      />

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
