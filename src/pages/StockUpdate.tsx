import { useState } from "react";
import { useInventory } from "@/context/InventoryContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function StockUpdate() {
  const { products, addStockUpdate } = useInventory();
  const [productId, setProductId] = useState("");
  const [type, setType] = useState<"increase" | "decrease">("increase");
  const [quantity, setQuantity] = useState(0);
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId || quantity <= 0) return;
    addStockUpdate({ productId, type, quantity, date: new Date().toISOString(), notes });
    setProductId(""); setQuantity(0); setNotes("");
  };

  return (
    <div className="space-y-6">
      <h1 className="page-header">Stock Update</h1>

      <div className="bg-card border rounded-xl p-6 max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Product</Label>
            <Select value={productId} onValueChange={setProductId}>
              <SelectTrigger><SelectValue placeholder="Select product" /></SelectTrigger>
              <SelectContent>
                {products.map(p => <SelectItem key={p.id} value={p.id}>{p.name} (Qty: {p.quantity})</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select value={type} onValueChange={v => setType(v as "increase" | "decrease")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="increase">Increase</SelectItem>
                  <SelectItem value="decrease">Decrease</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Quantity</Label>
              <Input type="number" min="1" value={quantity} onChange={e => setQuantity(+e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Notes</Label>
            <Textarea value={notes} onChange={e => setNotes(e.target.value)} />
          </div>
          <Button type="submit" className="w-full">Update Stock</Button>
        </form>
      </div>

      <div className="bg-card border rounded-xl overflow-hidden">
        <table className="data-table">
          <thead><tr><th>Product</th><th>Current Stock</th><th>Status</th></tr></thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td className="font-medium">{p.name}</td>
                <td>{p.quantity}</td>
                <td>
                  {p.quantity <= p.lowStockThreshold ? (
                    <span className="inline-flex items-center rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-semibold text-destructive">Low</span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">OK</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
