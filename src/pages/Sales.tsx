import { useState } from "react";
import { useInventory } from "@/context/InventoryContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";

export default function Sales() {
  const { sales, products, addSale, getProductName } = useInventory();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ date: new Date().toISOString().split("T")[0], productId: "", quantity: 0, sellingPrice: 0 });

  const selectedProduct = products.find(p => p.id === form.productId);

  const handleProductChange = (id: string) => {
    const p = products.find(x => x.id === id);
    setForm({ ...form, productId: id, sellingPrice: p?.sellingPrice || 0 });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addSale({ ...form, totalAmount: form.quantity * form.sellingPrice });
    setOpen(false);
    setForm({ date: new Date().toISOString().split("T")[0], productId: "", quantity: 0, sellingPrice: 0 });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="page-header">Sales</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Record Sale</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Record Sale</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5"><Label>Date</Label><Input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Product</Label>
                  <Select value={form.productId} onValueChange={handleProductChange}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{products.map(p => <SelectItem key={p.id} value={p.id}>{p.name} (Stock: {p.quantity})</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5"><Label>Quantity</Label><Input type="number" min="1" max={selectedProduct?.quantity || 999} value={form.quantity} onChange={e => setForm({ ...form, quantity: +e.target.value })} /></div>
                <div className="space-y-1.5 col-span-2"><Label>Selling Price</Label><Input type="number" min="0" step="0.01" value={form.sellingPrice} onChange={e => setForm({ ...form, sellingPrice: +e.target.value })} /></div>
              </div>
              <div className="text-sm text-muted-foreground">Total: ${(form.quantity * form.sellingPrice).toFixed(2)}</div>
              <Button type="submit" className="w-full">Record Sale</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>Date</th><th>Product</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
            <tbody>
              {sales.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-muted-foreground">No sales recorded</td></tr>
              ) : sales.map(s => (
                <tr key={s.id}>
                  <td>{new Date(s.date).toLocaleDateString()}</td>
                  <td className="font-medium">{getProductName(s.productId)}</td>
                  <td>{s.quantity}</td>
                  <td>${s.sellingPrice.toFixed(2)}</td>
                  <td className="font-semibold text-success">${s.totalAmount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
