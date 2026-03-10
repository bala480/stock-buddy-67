import { useInventory } from "@/context/InventoryContext";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LowStock() {
  const { getLowStockProducts } = useInventory();
  const navigate = useNavigate();
  const lowStock = getLowStockProducts();

  return (
    <div className="space-y-6">
      <h1 className="page-header">Low Stock Alerts</h1>

      {lowStock.length === 0 ? (
        <div className="bg-card border rounded-xl p-12 text-center">
          <p className="text-muted-foreground text-lg">All products are adequately stocked!</p>
        </div>
      ) : (
        <div className="bg-card border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead><tr><th>Product</th><th>SKU</th><th>Current Qty</th><th>Threshold</th><th>Action</th></tr></thead>
              <tbody>
                {lowStock.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-warning" />
                        <span className="font-medium">{p.name}</span>
                      </div>
                    </td>
                    <td className="text-muted-foreground">{p.sku}</td>
                    <td className="text-destructive font-semibold">{p.quantity}</td>
                    <td>{p.lowStockThreshold}</td>
                    <td><Button size="sm" variant="outline" onClick={() => navigate("/stock")}>Restock</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
