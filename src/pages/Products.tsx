import { useState } from "react";
import { useInventory, Product } from "@/context/InventoryContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";

const emptyProduct = {
  name: "", sku: "", category: "", supplierId: "", purchasePrice: 0,
  sellingPrice: 0, quantity: 0, description: "", lowStockThreshold: 5,
};

export default function Products() {
  const { products, suppliers, addProduct, updateProduct, deleteProduct } = useInventory();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyProduct);
  const [search, setSearch] = useState("");

  const openNew = () => { setEditing(null); setForm(emptyProduct); setOpen(true); };
  const openEdit = (p: Product) => { setEditing(p); setForm(p); setOpen(true); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      updateProduct({ ...editing, ...form });
    } else {
      addProduct(form);
    }
    setOpen(false);
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="page-header">Products</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew}><Plus className="mr-2 h-4 w-4" />Add Product</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Product" : "Add Product"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Product Name</Label>
                  <Input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>SKU</Label>
                  <Input required value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Category</Label>
                  <Input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Supplier</Label>
                  <Select value={form.supplierId} onValueChange={v => setForm({ ...form, supplierId: v })}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {suppliers.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Purchase Price</Label>
                  <Input type="number" min="0" step="0.01" required value={form.purchasePrice} onChange={e => setForm({ ...form, purchasePrice: +e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Selling Price</Label>
                  <Input type="number" min="0" step="0.01" required value={form.sellingPrice} onChange={e => setForm({ ...form, sellingPrice: +e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Quantity</Label>
                  <Input type="number" min="0" required value={form.quantity} onChange={e => setForm({ ...form, quantity: +e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Low Stock Threshold</Label>
                  <Input type="number" min="0" value={form.lowStockThreshold} onChange={e => setForm({ ...form, lowStockThreshold: +e.target.value })} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Description</Label>
                <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
              <Button type="submit" className="w-full">{editing ? "Update" : "Add"} Product</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} className="max-w-sm" />

      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th><th>SKU</th><th>Category</th><th>Price</th><th>Qty</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">No products found</td></tr>
              ) : filtered.map(p => (
                <tr key={p.id}>
                  <td className="font-medium">{p.name}</td>
                  <td className="text-muted-foreground">{p.sku}</td>
                  <td>{p.category}</td>
                  <td>${p.sellingPrice.toFixed(2)}</td>
                  <td>
                    <span className={p.quantity <= p.lowStockThreshold ? "text-destructive font-semibold" : ""}>
                      {p.quantity}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteProduct(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
