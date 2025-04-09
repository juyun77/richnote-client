import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "../style/inventoryPage.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

interface Product {
  id: number;
  name: string;
  quantity: number;
  salePrice: number;
  costPrice: number;
  storageType: string;
  marginRate?: number;
}

interface Store {
  id: number;
  storeName: string;
}

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [storeList, setStoreList] = useState<Store[]>([]);
  const [storeId, setStoreId] = useState<number | null>(null);
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [newName, setNewName] = useState<string>("");

  const limit = 10;

  useEffect(() => {
    fetchStores();
  }, []);

  useEffect(() => {
    if (storeId !== null) fetchProducts();
  }, [storeId, page, search]);

  const fetchStores = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/users/checkLogin`, {
        withCredentials: true,
      });
      const userId = res.data.user?.id;
      if (userId) {
        const storeRes = await axios.get(`${API_BASE_URL}/stores/${userId}`);
        setStoreList(storeRes.data);
        if (storeRes.data.length > 0) setStoreId(storeRes.data[0].id);
      }
    } catch (err) {
      console.error("매장 불러오기 실패", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/products/${storeId}`, {
        params: { page, limit, search },
      });
      setProducts(res.data.products);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("상품 불러오기 실패", err);
    }
  };

  const handleQuantityChange = async (id: number, quantity: number) => {
    if (quantity < 0) quantity = 0;
    try {
      await axios.put(`${API_BASE_URL}/products/${id}`, { quantity });
      fetchProducts();
    } catch (err) {
      console.error("수량 수정 실패", err);
    }
  };

  const startEditing = (id: number, currentName: string) => {
    setEditingProductId(id);
    setNewName(currentName);
  };

  const saveNameChange = async (id: number) => {
    try {
      await axios.put(`${API_BASE_URL}/products/${id}`, { name: newName });
      setEditingProductId(null);
      fetchProducts();
    } catch (err) {
      console.error("이름 수정 실패", err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="inventory-container"
    >
      <h2>📦 재고 관리</h2>

      <div className="inventory-controls">
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
        <input
          type="text"
          placeholder="상품명 검색"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <table className="inventory-table">
        <thead>
          <tr>
            <th>상품 번호</th>
            <th>상품명</th>
            <th>보관</th>
            <th>판매가</th>
            <th>원가</th>
            <th>마진률</th>
            <th>재고</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan={7}>등록된 상품이 없습니다.</td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>
                  {editingProductId === product.id ? (
                    <>
                      <input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                      />
                      <button onClick={() => saveNameChange(product.id)}>
                        저장
                      </button>
                    </>
                  ) : (
                    <>
                      {product.name}
                      <button
                        onClick={() => startEditing(product.id, product.name)}
                      >
                        ✏️
                      </button>
                    </>
                  )}
                </td>
                <td>{product.storageType}</td>
                <td>{product.salePrice.toLocaleString()}원</td>
                <td>{product.costPrice.toLocaleString()}원</td>
                <td>
                  {product.marginRate !== undefined
                    ? `${product.marginRate.toFixed(2)}%`
                    : "-"}
                </td>
                <td>
                  <div className="quantity-control">
                    <button
                      onClick={() =>
                        handleQuantityChange(product.id, product.quantity - 1)
                      }
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={product.quantity}
                      onChange={(e) =>
                        handleQuantityChange(product.id, Number(e.target.value))
                      }
                      min={0}
                    />
                    <button
                      onClick={() =>
                        handleQuantityChange(product.id, product.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="pagination">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          ◀ 이전
        </button>
        <span>
          {page} / {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
        >
          다음 ▶
        </button>
      </div>
    </motion.div>
  );
}
