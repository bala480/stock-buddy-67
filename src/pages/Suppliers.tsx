import { useState } from "react";
import { useInventory, Supplier } from "@/context/InventoryContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";

const emptySupplier = { name: "", contact: "", email: "", address: "", company: "" };

export default function Suppliers() {
  const { suppliers, addSupplier, updateSupplier, deleteSupplier } = useInventory();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Supplier | null>(null);
  const [form, setForm] = useState(emptySupplier);

  const openNew = () => { setEditing(null); setForm(emptySupplier); setOpen(true); };
  const openEdit = (s: Supplier) => { setEditing(s); setForm(s); setOpen(true); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) updateSupplier({ ...editing, ...form });
    else addSupplier(form);
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="page-header">Suppliers</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew}><Plus className="mr-2 h-4 w-4" />Add Supplier</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? "Edit Supplier" : "Add Supplier"}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5"><Label>Supplier Name</Label><Input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                <div className="space-y-1.5"><Label>Company</Label><Input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} /></div>
                <div className="space-y-1.5"><Label>Contact</Label><Input value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} /></div>
                <div className="space-y-1.5"><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
              </div>
              <div className="space-y-1.5"><Label>Address</Label><Input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} /></div>
              <Button type="submit" className="w-full">{editing ? "Update" : "Add"} Supplier</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>Name</th><th>Company</th><th>Contact</th><th>Email</th><th>Actions</th></tr></thead>
            <tbody>
              {suppliers.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-muted-foreground">No suppliers added</td></tr>
              ) : suppliers.map(s => (
                <tr key={s.id}>
                  <td className="font-medium">{s.name}</td>
                  <td>{s.company}</td>
                  <td>{s.contact}</td>
                  <td className="text-muted-foreground">{s.email}</td>
                  <td>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(s)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteSupplier(s.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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
