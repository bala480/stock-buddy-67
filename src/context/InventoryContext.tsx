import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  supplierId: string;
  purchasePrice: number;
  sellingPrice: number;
  quantity: number;
  description: string;
  lowStockThreshold: number;
  createdAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
  address: string;
  company: string;
  createdAt: string;
}

export interface Purchase {
  id: string;
  date: string;
  supplierId: string;
  productId: string;
  quantity: number;
  purchasePrice: number;
  totalCost: number;
  createdAt: string;
}

export interface Sale {
  id: string;
  date: string;
  productId: string;
  quantity: number;
  sellingPrice: number;
  totalAmount: number;
  createdAt: string;
}

export interface StockUpdate {
  id: string;
  productId: string;
  type: "increase" | "decrease";
  quantity: number;
  date: string;
  notes: string;
  createdAt: string;
}

interface InventoryContextType {
  products: Product[];
  suppliers: Supplier[];
  purchases: Purchase[];
  sales: Sale[];
  stockUpdates: StockUpdate[];
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  addProduct: (p: Omit<Product, "id" | "createdAt">) => void;
  updateProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
  addSupplier: (s: Omit<Supplier, "id" | "createdAt">) => void;
  updateSupplier: (s: Supplier) => void;
  deleteSupplier: (id: string) => void;
  addPurchase: (p: Omit<Purchase, "id" | "createdAt">) => void;
  addSale: (s: Omit<Sale, "id" | "createdAt">) => void;
  addStockUpdate: (s: Omit<StockUpdate, "id" | "createdAt">) => void;
  getLowStockProducts: () => Product[];
  getSupplierName: (id: string) => string;
  getProductName: (id: string) => string;
}

const InventoryContext = createContext<InventoryContextType | null>(null);

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

const uid = () => crypto.randomUUID();

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => loadFromStorage("inv_products", []));
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => loadFromStorage("inv_suppliers", []));
  const [purchases, setPurchases] = useState<Purchase[]>(() => loadFromStorage("inv_purchases", []));
  const [sales, setSales] = useState<Sale[]>(() => loadFromStorage("inv_sales", []));
  const [stockUpdates, setStockUpdates] = useState<StockUpdate[]>(() => loadFromStorage("inv_stockUpdates", []));
  const [isAuthenticated, setIsAuthenticated] = useState(() => loadFromStorage("inv_auth", false));

  useEffect(() => { localStorage.setItem("inv_products", JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem("inv_suppliers", JSON.stringify(suppliers)); }, [suppliers]);
  useEffect(() => { localStorage.setItem("inv_purchases", JSON.stringify(purchases)); }, [purchases]);
  useEffect(() => { localStorage.setItem("inv_sales", JSON.stringify(sales)); }, [sales]);
  useEffect(() => { localStorage.setItem("inv_stockUpdates", JSON.stringify(stockUpdates)); }, [stockUpdates]);
  useEffect(() => { localStorage.setItem("inv_auth", JSON.stringify(isAuthenticated)); }, [isAuthenticated]);

  const login = useCallback((username: string, password: string) => {
    if (username === "admin" && password === "admin123") {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => setIsAuthenticated(false), []);

  const addProduct = useCallback((p: Omit<Product, "id" | "createdAt">) => {
    setProducts(prev => [...prev, { ...p, id: uid(), createdAt: new Date().toISOString() }]);
  }, []);

  const updateProduct = useCallback((p: Product) => {
    setProducts(prev => prev.map(x => x.id === p.id ? p : x));
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => prev.filter(x => x.id !== id));
  }, []);

  const addSupplier = useCallback((s: Omit<Supplier, "id" | "createdAt">) => {
    setSuppliers(prev => [...prev, { ...s, id: uid(), createdAt: new Date().toISOString() }]);
  }, []);

  const updateSupplier = useCallback((s: Supplier) => {
    setSuppliers(prev => prev.map(x => x.id === s.id ? s : x));
  }, []);

  const deleteSupplier = useCallback((id: string) => {
    setSuppliers(prev => prev.filter(x => x.id !== id));
  }, []);

  const addPurchase = useCallback((p: Omit<Purchase, "id" | "createdAt">) => {
    setPurchases(prev => [...prev, { ...p, id: uid(), createdAt: new Date().toISOString() }]);
    setProducts(prev => prev.map(x => x.id === p.productId ? { ...x, quantity: x.quantity + p.quantity } : x));
  }, []);

  const addSale = useCallback((s: Omit<Sale, "id" | "createdAt">) => {
    setSales(prev => [...prev, { ...s, id: uid(), createdAt: new Date().toISOString() }]);
    setProducts(prev => prev.map(x => x.id === s.productId ? { ...x, quantity: Math.max(0, x.quantity - s.quantity) } : x));
  }, []);

  const addStockUpdate = useCallback((s: Omit<StockUpdate, "id" | "createdAt">) => {
    setStockUpdates(prev => [...prev, { ...s, id: uid(), createdAt: new Date().toISOString() }]);
    setProducts(prev => prev.map(x => {
      if (x.id !== s.productId) return x;
      const newQty = s.type === "increase" ? x.quantity + s.quantity : Math.max(0, x.quantity - s.quantity);
      return { ...x, quantity: newQty };
    }));
  }, []);

  const getLowStockProducts = useCallback(() => products.filter(p => p.quantity <= p.lowStockThreshold), [products]);
  const getSupplierName = useCallback((id: string) => suppliers.find(s => s.id === id)?.name || "Unknown", [suppliers]);
  const getProductName = useCallback((id: string) => products.find(p => p.id === id)?.name || "Unknown", [products]);

  return (
    <InventoryContext.Provider value={{
      products, suppliers, purchases, sales, stockUpdates, isAuthenticated,
      login, logout, addProduct, updateProduct, deleteProduct,
      addSupplier, updateSupplier, deleteSupplier,
      addPurchase, addSale, addStockUpdate,
      getLowStockProducts, getSupplierName, getProductName,
    }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const ctx = useContext(InventoryContext);
  if (!ctx) throw new Error("useInventory must be used within InventoryProvider");
  return ctx;
}
