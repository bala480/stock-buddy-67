import { useMemo, useState } from "react";
import { useInventory } from "@/context/InventoryContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["hsl(160,84%,39%)", "hsl(210,100%,52%)", "hsl(38,92%,50%)", "hsl(0,72%,51%)", "hsl(270,60%,50%)"];

export default function Reports() {
  const { products, purchases, sales, getProductName } = useInventory();
  const [period, setPeriod] = useState<"daily" | "monthly">("monthly");

  const salesByDate = useMemo(() => {
    const map: Record<string, number> = {};
    sales.forEach(s => {
      const key = period === "daily"
        ? new Date(s.date).toLocaleDateString()
        : new Date(s.date).toLocaleDateString(undefined, { year: "numeric", month: "short" });
      map[key] = (map[key] || 0) + s.totalAmount;
    });
    return Object.entries(map).map(([date, amount]) => ({ date, amount }));
  }, [sales, period]);

  const purchasesByDate = useMemo(() => {
    const map: Record<string, number> = {};
    purchases.forEach(p => {
      const key = new Date(p.date).toLocaleDateString(undefined, { year: "numeric", month: "short" });
      map[key] = (map[key] || 0) + p.totalCost;
    });
    return Object.entries(map).map(([date, amount]) => ({ date, amount }));
  }, [purchases]);

  const stockData = useMemo(() => products.map(p => ({ name: p.name, quantity: p.quantity })), [products]);

  const totalRevenue = sales.reduce((s, x) => s + x.totalAmount, 0);
  const totalCost = purchases.reduce((s, x) => s + x.totalCost, 0);
  const profit = totalRevenue - totalCost;

  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};
    products.forEach(p => { map[p.category || "Uncategorized"] = (map[p.category || "Uncategorized"] || 0) + p.quantity; });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [products]);

  return (
    <div className="space-y-6">
      <h1 className="page-header">Reports & Analytics</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Total Revenue</p>
          <p className="text-2xl font-bold text-success">${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Total Costs</p>
          <p className="text-2xl font-bold">${totalCost.toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Profit/Loss</p>
          <p className={`text-2xl font-bold ${profit >= 0 ? "text-success" : "text-destructive"}`}>
            ${profit.toFixed(2)}
          </p>
        </div>
      </div>

      <Tabs defaultValue="sales">
        <TabsList>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="purchases">Purchases</TabsTrigger>
          <TabsTrigger value="stock">Stock</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="bg-card border rounded-xl p-5">
          <div className="flex gap-2 mb-4">
            <button onClick={() => setPeriod("daily")} className={`px-3 py-1 rounded-md text-sm ${period === "daily" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>Daily</button>
            <button onClick={() => setPeriod("monthly")} className={`px-3 py-1 rounded-md text-sm ${period === "monthly" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>Monthly</button>
          </div>
          {salesByDate.length === 0 ? <p className="text-muted-foreground py-8 text-center">No sales data</p> : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesByDate}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,16%,88%)" />
                <XAxis dataKey="date" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="amount" fill="hsl(160,84%,39%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </TabsContent>

        <TabsContent value="purchases" className="bg-card border rounded-xl p-5">
          {purchasesByDate.length === 0 ? <p className="text-muted-foreground py-8 text-center">No purchase data</p> : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={purchasesByDate}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,16%,88%)" />
                <XAxis dataKey="date" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="amount" fill="hsl(210,100%,52%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </TabsContent>

        <TabsContent value="stock" className="bg-card border rounded-xl p-5">
          {stockData.length === 0 ? <p className="text-muted-foreground py-8 text-center">No products</p> : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stockData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,16%,88%)" />
                <XAxis type="number" fontSize={12} />
                <YAxis dataKey="name" type="category" fontSize={12} width={120} />
                <Tooltip />
                <Bar dataKey="quantity" fill="hsl(160,84%,39%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </TabsContent>

        <TabsContent value="categories" className="bg-card border rounded-xl p-5">
          {categoryData.length === 0 ? <p className="text-muted-foreground py-8 text-center">No data</p> : (
            <div className="flex justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                    {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
