import { useInventory } from "@/context/InventoryContext";
import {
  Package, Users, ShoppingCart, TrendingUp, DollarSign, AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { products, suppliers, purchases, sales, getLowStockProducts } = useInventory();
  const navigate = useNavigate();
  const lowStock = getLowStockProducts();

  const totalStockValue = products.reduce((sum, p) => sum + p.quantity * p.purchasePrice, 0);
  const totalSalesAmount = sales.reduce((sum, s) => sum + s.totalAmount, 0);

  const stats = [
    { label: "Total Products", value: products.length, icon: Package, color: "text-primary" },
    { label: "Total Suppliers", value: suppliers.length, icon: Users, color: "text-info" },
    { label: "Total Purchases", value: purchases.length, icon: ShoppingCart, color: "text-accent-foreground" },
    { label: "Total Sales", value: sales.length, icon: TrendingUp, color: "text-success" },
    { label: "Stock Value", value: `$${totalStockValue.toLocaleString()}`, icon: DollarSign, color: "text-primary" },
    { label: "Low Stock Items", value: lowStock.length, icon: AlertTriangle, color: "text-warning", onClick: () => navigate("/low-stock") },
  ];

  return (
    <div className="space-y-6">
      <h1 className="page-header">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`stat-card ${s.onClick ? "cursor-pointer" : ""}`}
            onClick={s.onClick}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold mt-1">{s.value}</p>
              </div>
              <s.icon className={`h-8 w-8 ${s.color} opacity-80`} />
            </div>
          </div>
        ))}
      </div>

      {lowStock.length > 0 && (
        <div className="bg-card border border-warning/30 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-5 w-5 text-warning" />
            <h2 className="font-semibold text-foreground">Low Stock Alerts</h2>
          </div>
          <div className="space-y-2">
            {lowStock.slice(0, 5).map((p) => (
              <div key={p.id} className="flex items-center justify-between text-sm py-1.5 border-b last:border-0">
                <span className="font-medium">{p.name}</span>
                <span className="text-destructive font-semibold">{p.quantity} left (min: {p.lowStockThreshold})</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card border rounded-xl p-5">
          <h2 className="font-semibold mb-3">Recent Sales</h2>
          {sales.length === 0 ? (
            <p className="text-sm text-muted-foreground">No sales recorded yet.</p>
          ) : (
            <div className="space-y-2">
              {sales.slice(-5).reverse().map((s) => (
                <div key={s.id} className="flex justify-between text-sm py-1.5 border-b last:border-0">
                  <span>{new Date(s.date).toLocaleDateString()}</span>
                  <span className="font-medium text-success">${s.totalAmount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="bg-card border rounded-xl p-5">
          <h2 className="font-semibold mb-3">Recent Purchases</h2>
          {purchases.length === 0 ? (
            <p className="text-sm text-muted-foreground">No purchases recorded yet.</p>
          ) : (
            <div className="space-y-2">
              {purchases.slice(-5).reverse().map((p) => (
                <div key={p.id} className="flex justify-between text-sm py-1.5 border-b last:border-0">
                  <span>{new Date(p.date).toLocaleDateString()}</span>
                  <span className="font-medium">${p.totalCost.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
