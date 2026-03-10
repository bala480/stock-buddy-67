import { useState } from "react";
import { useInventory } from "@/context/InventoryContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";

export default function Purchases() {
  const { purchases, products, suppliers, addPurchase, getSupplierName, getProductName } = useInventory();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ date: new Date().toISOString().split("T")[0], supplierId: "", productId: "", quantity: 0, purchasePrice: 0 });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPurchase({ ...form, totalCost: form.quantity * form.purchasePrice });
    setOpen(false);
    setForm({ date: new Date().toISOString().split("T")[0], supplierId: "", productId: "", quantity: 0, purchasePrice: 0 });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="page-header">Purchases</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Record Purchase</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Record Purchase</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5"><Label>Date</Label><Input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Supplier</Label>
                  <Select value={form.supplierId} onValueChange={v => setForm({ ...form, supplierId: v })}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{suppliers.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Product</Label>
                  <Select value={form.productId} onValueChange={v => setForm({ ...form, productId: v })}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{products.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5"><Label>Quantity</Label><Input type="number" min="1" value={form.quantity} onChange={e => setForm({ ...form, quantity: +e.target.value })} /></div>
                <div className="space-y-1.5"><Label>Price</Label><Input type="number" min="0" step="0.01" value={form.purchasePrice} onChange={e => setForm({ ...form, purchasePrice: +e.target.value })} /></div>
              </div>
              <div className="text-sm text-muted-foreground">Total: ${(form.quantity * form.purchasePrice).toFixed(2)}</div>
              <Button type="submit" className="w-full">Record Purchase</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>Date</th><th>Supplier</th><th>Product</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
            <tbody>
              {purchases.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">No purchases recorded</td></tr>
              ) : purchases.map(p => (
                <tr key={p.id}>
                  <td>{new Date(p.date).toLocaleDateString()}</td>
                  <td>{getSupplierName(p.supplierId)}</td>
                  <td className="font-medium">{getProductName(p.productId)}</td>
                  <td>{p.quantity}</td>
                  <td>${p.purchasePrice.toFixed(2)}</td>
                  <td className="font-semibold">${p.totalCost.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
