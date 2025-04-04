import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import * as XLSX from "xlsx";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

interface Product {
  id?: number;
  name: string;
  quantity: number;
  salePrice: number;
  costPrice: number;
  storageType: string;
  storeId?: number;
  profit?: number;
  marginRate?: number;
}

interface Store {
  id: number;
  storeName: string;
}

const InventoryPage = () => {
  const [storeList, setStoreList] = useState<Store[]>([]);
  const [storeId, setStoreId] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

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
      } catch (err) {
        console.error("매장 불러오기 실패", err);
      }
    };

    fetchStores();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!storeId) return;
      try {
        const res = await axios.get(`${API_BASE_URL}/products/${storeId}`);
        setProducts(res.data);
      } catch (err) {
        console.error("상품 목록 불러오기 실패", err);
      }
    };

    fetchProducts();
  }, [storeId]);

  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !storeId) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const data = new Uint8Array(event.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: "",
      });

      const productList: Product[] = [];

      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i];
        const storageType = String(row[1]).trim();
        const name = String(row[2]).trim();
        const quantity = parseInt(row[3]);
        const costPrice = parseInt(String(row[4]).replace(/[^0-9]/g, ""));
        const salePrice = parseInt(String(row[6]).replace(/[^0-9]/g, ""));

        if (!name || isNaN(quantity) || isNaN(costPrice) || isNaN(salePrice))
          continue;

        productList.push({
          name,
          quantity,
          costPrice,
          salePrice,
          storageType,
          storeId,
        });
      }

      await axios.post(`${API_BASE_URL}/products/`, productList, {
        headers: { "Content-Type": "application/json" },
      });

      const res = await axios.get(`${API_BASE_URL}/products/${storeId}`);
      setProducts(res.data);

      alert("상품 업로드 및 목록 갱신 완료!");
    };

    reader.readAsArrayBuffer(file);
  };

  const saveStock = async () => {
    if (!products.length) {
      alert("등록된 상품이 없습니다.");
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/products/update`, products, {
        headers: { "Content-Type": "application/json" },
      });
      alert("상품 저장 완료!");
    } catch (err) {
      console.error("저장 실패", err);
      alert("저장 중 오류 발생");
    }
  };

  const handleQuantityChange = (index: number, value: number) => {
    setProducts((prev) => {
      const updated = [...prev];
      updated[index].quantity = value;
      return updated;
    });
  };

  const handleSort = () => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
  };

  const filteredProducts = products
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const aValue = a.marginRate ?? 0;
      const bValue = b.marginRate ?? 0;
      return sortOrder === "desc" ? bValue - aValue : aValue - bValue;
    });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="inventory-container"
      style={{ padding: "30px", maxWidth: "1100px", margin: "0 auto" }}
    >
      <h2>📦 재고 관리</h2>

      <div style={{ marginBottom: "20px" }}>
        <label>매장 선택: </label>
        <select
          value={storeId ?? ""}
          onChange={(e) => setStoreId(Number(e.target.value))}
        >
          {storeList.map((store) => (
            <option key={store.id} value={store.id}>
              {store.storeName}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="상품명 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "8px", width: "300px" }}
        />
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleExcelUpload}
          style={{ marginLeft: "20px" }}
        />
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>상품 번호</th> {/* 추가 */}
            <th>상품명</th>
            <th>보관</th>
            <th>판매가</th>
            <th>원가</th>
            <th
              onClick={handleSort}
              style={{ cursor: "pointer", userSelect: "none" }}
            >
              마진률 {sortOrder === "desc" ? "🔽" : "🔼"}
            </th>
            <th>재고</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.length === 0 ? (
            <tr>
              <td colSpan={8} style={{ textAlign: "center", padding: "20px" }}>
                등록된 상품이 없습니다.
              </td>
            </tr>
          ) : (
            filteredProducts.map((product, index) => (
              <tr key={index}>
                <td>{product.id ?? "-"}</td> {/* 상품 번호 추가 */}
                <td>{product.name}</td>
                <td>{product.storageType}</td>
                <td>{product.salePrice.toLocaleString()}원</td>
                <td>{product.costPrice.toLocaleString()}원</td>
                <td
                  style={{
                    color:
                      product.marginRate !== undefined &&
                      product.marginRate < 30
                        ? "red"
                        : "inherit",
                    fontWeight:
                      product.marginRate !== undefined &&
                      product.marginRate < 30
                        ? "bold"
                        : "normal",
                  }}
                >
                  {product.marginRate !== undefined
                    ? `${product.marginRate.toFixed(2)}%`
                    : "-"}
                </td>
                <td>
                  <input
                    type="number"
                    value={product.quantity}
                    min={0}
                    onChange={(e) =>
                      handleQuantityChange(index, Number(e.target.value))
                    }
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={saveStock}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        저장하기
      </motion.button>
    </motion.div>
  );
};

export default InventoryPage;
