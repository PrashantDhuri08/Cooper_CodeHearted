"use client";

import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { ErrorMessage } from "@/components/ErrorMessage";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { createExpense } from "@/lib/api";

export default function BillsPage() {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [bills, setBills] = useState<any[]>([]);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [vendor, setVendor] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem("cooper_events") || "[]");
    const userEvents = storedEvents.filter((e: any) =>
      e.participants?.some((p: any) => p.userId === user?.id)
    );
    setEvents(userEvents);

    const storedCategories = JSON.parse(localStorage.getItem("cooper_categories") || "[]");
    setCategories(storedCategories);

    const storedBills = JSON.parse(localStorage.getItem("cooper_bills") || "[]");
    setBills(storedBills);
  }, [user]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Simulate OCR detection
      setTimeout(() => {
        alert("Bill scanned! In production, this would use OCR to extract details. For now, enter manually.");
        setShowManualEntry(true);
      }, 1000);
    }
  };

  const handleSubmitExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!selectedEvent || !selectedCategory) {
        throw new Error("Please select event and category");
      }

      // Validate that category ID is a valid number
      const categoryId = parseInt(selectedCategory);
      const eventId = parseInt(selectedEvent);
      
      if (isNaN(categoryId) || isNaN(eventId)) {
        throw new Error("Invalid event or category selection");
      }

      const result = await createExpense(
        eventId,
        categoryId,
        parseFloat(amount)
      );

      // Store bill locally
      const newBill = {
        id: Date.now(),
        eventId: eventId,
        categoryId: categoryId,
        amount: parseFloat(amount),
        vendor: vendor || "Unknown",
        date: new Date().toISOString(),
        paymentUrl: result.payment_url,
        status: result.status,
      };

      const storedBills = JSON.parse(localStorage.getItem("cooper_bills") || "[]");
      storedBills.push(newBill);
      localStorage.setItem("cooper_bills", JSON.stringify(storedBills));

      // Update category total spent
      const storedCategories = JSON.parse(localStorage.getItem("cooper_categories") || "[]");
      const categoryIndex = storedCategories.findIndex((c: any) => c.id === categoryId);
      if (categoryIndex !== -1) {
        storedCategories[categoryIndex].totalSpent = 
          (storedCategories[categoryIndex].totalSpent || 0) + parseFloat(amount);
        if (!storedCategories[categoryIndex].expenses) {
          storedCategories[categoryIndex].expenses = [];
        }
        storedCategories[categoryIndex].expenses.push({
          id: newBill.id,
          amount: parseFloat(amount),
          vendor: vendor || "Unknown",
          date: new Date().toISOString(),
        });
        localStorage.setItem("cooper_categories", JSON.stringify(storedCategories));
      }

      setBills([...bills, newBill]);
      setShowManualEntry(false);
      setSelectedFile(null);
      setAmount("");
      setVendor("");
      setSelectedEvent("");
      setSelectedCategory("");

      alert(`Expense created successfully! Amount: $${parseFloat(amount).toFixed(2)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create expense");
    } finally {
      setLoading(false);
    }
  };

  const getEventName = (eventId: number) => {
    const event = events.find(e => e.id === eventId);
    return event?.title || "Unknown Event";
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || "Unknown Category";
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">Bill Scanner</h1>

      {!showManualEntry ? (
        <Card className="bg-gradient-to-br from-white to-purple-50/30">
          <h2 className="text-2xl font-bold mb-4">Upload Bill</h2>
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-12 text-center">
            <div className="text-6xl mb-4">📸</div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Upload or Scan Bill</h3>
            <p className="text-slate-600 mb-4">Auto-detect amount, vendor, and date</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="bill-upload"
            />
            <label htmlFor="bill-upload" className="inline-block">
              <span className="px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 shadow-sm hover:shadow-md bg-slate-200 hover:bg-slate-300 text-slate-800 active:bg-slate-400 cursor-pointer">
                Choose File
              </span>
            </label>
            {selectedFile && (
              <p className="mt-4 text-sm text-slate-600">Selected: {selectedFile.name}</p>
            )}
          </div>
          <div className="mt-4 text-center">
            <Button onClick={() => setShowManualEntry(true)}>
              Or Enter Manually
            </Button>
          </div>
        </Card>
      ) : (
        <Card>
          <h2 className="text-2xl font-bold mb-4">Add Expense</h2>
          {error && <ErrorMessage message={error} />}
          <form onSubmit={handleSubmitExpense} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Select Event
              </label>
              <select
                value={selectedEvent}
                onChange={(e) => {
                  setSelectedEvent(e.target.value);
                  // Filter categories by event
                  setSelectedCategory("");
                }}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Choose an event...</option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Select Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={!selectedEvent}
              >
                <option value="">Choose a category...</option>
                {categories
                  .filter(c => c.eventId === parseInt(selectedEvent))
                  .map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
              </select>
            </div>

            <Input
              label="Amount ($)"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
            />

            <Input
              label="Vendor (Optional)"
              type="text"
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
              placeholder="e.g., Restaurant Name"
            />

            <div className="flex gap-3">
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Expense"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowManualEntry(false);
                  setSelectedFile(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card>
        <h2 className="text-2xl font-bold mb-4">Recent Bills</h2>
        {bills.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            No bills uploaded yet
          </div>
        ) : (
          <div className="space-y-3">
            {bills.map((bill) => (
              <div
                key={bill.id}
                className="flex justify-between items-center p-4 bg-slate-50 rounded-lg"
              >
                <div>
                  <h3 className="font-bold text-slate-800">{bill.vendor}</h3>
                  <p className="text-sm text-slate-600">
                    {getEventName(bill.eventId)} • {getCategoryName(bill.categoryId)}
                  </p>
                  <p className="text-xs text-slate-500">
                    {new Date(bill.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-700">${bill.amount}</p>
                  <p className="text-xs text-slate-600">{bill.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
