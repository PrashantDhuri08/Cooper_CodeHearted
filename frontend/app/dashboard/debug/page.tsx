"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";

export default function DebugPage() {
  const [data, setData] = useState<any>({});

  const loadData = () => {
    const events = JSON.parse(localStorage.getItem("cooper_events") || "[]");
    const categories = JSON.parse(localStorage.getItem("cooper_categories") || "[]");
    const bills = JSON.parse(localStorage.getItem("cooper_bills") || "[]");
    
    setData({ events, categories, bills });
  };

  useEffect(() => {
    loadData();
  }, []);

  const clearAll = () => {
    if (confirm("Clear all data?")) {
      localStorage.removeItem("cooper_events");
      localStorage.removeItem("cooper_categories");
      localStorage.removeItem("cooper_bills");
      loadData();
      alert("All data cleared!");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">Debug Data</h1>
        <div className="space-x-2">
          <Button onClick={loadData}>Refresh</Button>
          <Button variant="danger" onClick={clearAll}>Clear All</Button>
        </div>
      </div>

      <Card>
        <h2 className="text-xl font-bold mb-3">Events ({data.events?.length || 0})</h2>
        <pre className="bg-slate-100 p-4 rounded overflow-auto max-h-60 text-xs">
          {JSON.stringify(data.events, null, 2)}
        </pre>
      </Card>

      <Card>
        <h2 className="text-xl font-bold mb-3">Categories ({data.categories?.length || 0})</h2>
        <pre className="bg-slate-100 p-4 rounded overflow-auto max-h-60 text-xs">
          {JSON.stringify(data.categories, null, 2)}
        </pre>
      </Card>

      <Card>
        <h2 className="text-xl font-bold mb-3">Bills ({data.bills?.length || 0})</h2>
        <pre className="bg-slate-100 p-4 rounded overflow-auto max-h-60 text-xs">
          {JSON.stringify(data.bills, null, 2)}
        </pre>
      </Card>

      <Card className="bg-blue-50">
        <h2 className="text-xl font-bold mb-3">Quick Check</h2>
        <div className="space-y-2 text-sm">
          {data.categories?.map((cat: any) => (
            <div key={cat.id} className="p-2 bg-white rounded">
              <strong>{cat.name}</strong> - Total Spent: ${cat.totalSpent || 0} - 
              Expenses: {cat.expenses?.length || 0}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
