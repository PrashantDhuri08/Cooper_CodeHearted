"use client";

import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { ErrorMessage } from "@/components/ErrorMessage";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { createCategory, joinCategory, createExpense } from "@/lib/api";

export default function CategoriesPage() {
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showExpensesModal, setShowExpensesModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [selectedCategoryForExpenses, setSelectedCategoryForExpenses] = useState<any>(null);
  const [selectedCategoryForAddExpense, setSelectedCategoryForAddExpense] = useState<any>(null);
  const [categoryName, setCategoryName] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseVendor, setExpenseVendor] = useState("");
  const [events, setEvents] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCategories();
    
    // Reload when page becomes visible (user navigates back)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadCategories();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', loadCategories);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', loadCategories);
    };
  }, [user]);

  const loadCategories = () => {
    const storedEvents = JSON.parse(localStorage.getItem("cooper_events") || "[]");
    const userEvents = storedEvents.filter((e: any) =>
      e.participants?.some((p: any) => p.userId === user?.id)
    );
    setEvents(userEvents);

    // Load categories from localStorage
    const storedCategories = JSON.parse(localStorage.getItem("cooper_categories") || "[]");
    setCategories(storedCategories);
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!selectedEvent) {
        throw new Error("Please select an event");
      }

      const apiCategory = await createCategory(parseInt(selectedEvent), categoryName);

      // Store locally
      const newCategory = {
        id: apiCategory.id,
        eventId: parseInt(selectedEvent),
        name: categoryName,
        participants: [user!.id],
        expenses: [],
        totalSpent: 0,
      };

      const storedCategories = JSON.parse(localStorage.getItem("cooper_categories") || "[]");
      storedCategories.push(newCategory);
      localStorage.setItem("cooper_categories", JSON.stringify(storedCategories));

      setCategories([...categories, newCategory]);
      setShowCreateModal(false);
      setCategoryName("");
      setSelectedEvent("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinCategory = async (categoryId: number) => {
    try {
      await joinCategory(categoryId, user!.id);

      // Update local storage
      const storedCategories = JSON.parse(localStorage.getItem("cooper_categories") || "[]");
      const categoryIndex = storedCategories.findIndex((c: any) => c.id === categoryId);
      
      if (categoryIndex !== -1 && !storedCategories[categoryIndex].participants.includes(user!.id)) {
        storedCategories[categoryIndex].participants.push(user!.id);
        localStorage.setItem("cooper_categories", JSON.stringify(storedCategories));
        setCategories(storedCategories);
      }

      alert("Joined category successfully!");
    } catch (err) {
      alert("Failed to join category");
    }
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!selectedCategoryForAddExpense) {
        throw new Error("No category selected");
      }

      const categoryId = selectedCategoryForAddExpense.id;
      const eventId = selectedCategoryForAddExpense.eventId;

      const result = await createExpense(
        eventId,
        categoryId,
        parseFloat(expenseAmount)
      );

      // Store bill locally
      const newBill = {
        id: Date.now(),
        eventId: eventId,
        categoryId: categoryId,
        amount: parseFloat(expenseAmount),
        vendor: expenseVendor || "Unknown",
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
          (storedCategories[categoryIndex].totalSpent || 0) + parseFloat(expenseAmount);
        if (!storedCategories[categoryIndex].expenses) {
          storedCategories[categoryIndex].expenses = [];
        }
        storedCategories[categoryIndex].expenses.push({
          id: newBill.id,
          amount: parseFloat(expenseAmount),
          vendor: expenseVendor || "Unknown",
          date: new Date().toISOString(),
        });
        localStorage.setItem("cooper_categories", JSON.stringify(storedCategories));
        loadCategories();
      }

      setShowAddExpenseModal(false);
      setExpenseAmount("");
      setExpenseVendor("");
      setSelectedCategoryForAddExpense(null);
      
      alert(`Expense added successfully! Amount: $${parseFloat(expenseAmount).toFixed(2)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  const getEventName = (eventId: number) => {
    const event = events.find(e => e.id === eventId);
    return event?.title || "Unknown Event";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">Expense Categories</h1>
        <Button onClick={() => setShowCreateModal(true)}>Create Category</Button>
      </div>

      {categories.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-slate-500 mb-4">No categories yet</p>
            <Button onClick={() => setShowCreateModal(true)}>Create Your First Category</Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Card key={cat.id} className="hover:shadow-xl transition-all">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-bold">{cat.name}</h3>
                <span className="text-2xl">📁</span>
              </div>
              <p className="text-xs text-slate-500 mb-2">{getEventName(cat.eventId)}</p>
              <p className="text-sm text-slate-600">{cat.participants.length} participants</p>
              <p className="text-sm text-slate-600 mb-1">${cat.totalSpent || 0} spent</p>
              {cat.expenses && cat.expenses.length > 0 && (
                <p className="text-xs text-slate-500">{cat.expenses.length} expense{cat.expenses.length !== 1 ? 's' : ''}</p>
              )}
              <div className="mt-4 space-y-2">
                {!cat.participants.includes(user?.id) && (
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => handleJoinCategory(cat.id)}
                  >
                    Join Category
                  </Button>
                )}
                <Button 
                  variant="secondary" 
                  className="w-full"
                  onClick={() => {
                    setSelectedCategoryForExpenses(cat);
                    setShowExpensesModal(true);
                  }}
                >
                  View Details ({cat.expenses?.length || 0})
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Category Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Create Category</h2>
            {error && <ErrorMessage message={error} />}
            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Select Event
                </label>
                <select
                  value={selectedEvent}
                  onChange={(e) => setSelectedEvent(e.target.value)}
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
              <Input
                label="Category Name"
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="e.g., Food, Transport, Accommodation"
                required
              />
              <div className="flex gap-3">
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create"}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* View Expenses Modal */}
      {showExpensesModal && selectedCategoryForExpenses && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold">{selectedCategoryForExpenses.name}</h2>
                <p className="text-sm text-slate-600">{getEventName(selectedCategoryForExpenses.eventId)}</p>
              </div>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowExpensesModal(false);
                  setSelectedCategoryForExpenses(null);
                }}
              >
                Close
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-slate-600">Total Spent</p>
                <p className="text-2xl font-bold text-blue-700">
                  ${selectedCategoryForExpenses.totalSpent || 0}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-slate-600">Participants</p>
                <p className="text-2xl font-bold text-green-700">
                  {selectedCategoryForExpenses.participants.length}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-slate-600">Expenses</p>
                <p className="text-2xl font-bold text-purple-700">
                  {selectedCategoryForExpenses.expenses?.length || 0}
                </p>
              </div>
            </div>

            <h3 className="text-lg font-bold mb-3">Expense Details</h3>
            {!selectedCategoryForExpenses.expenses || selectedCategoryForExpenses.expenses.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                No expenses in this category yet
              </div>
            ) : (
              <div className="space-y-3">
                {selectedCategoryForExpenses.expenses.map((expense: any) => (
                  <div
                    key={expense.id}
                    className="flex justify-between items-center p-4 bg-slate-50 rounded-lg"
                  >
                    <div>
                      <h4 className="font-bold text-slate-800">{expense.vendor}</h4>
                      <p className="text-xs text-slate-500">
                        {new Date(expense.date).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-blue-700">${expense.amount}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 space-y-3">
              <Button 
                className="w-full"
                onClick={() => {
                  setSelectedCategoryForAddExpense(selectedCategoryForExpenses);
                  setShowAddExpenseModal(true);
                  setShowExpensesModal(false);
                }}
              >
                + Add Expense to This Category
              </Button>
              <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                <p className="text-sm text-slate-700">
                  💡 Each participant in this category will share the costs equally.
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Add Expense Modal */}
      {showAddExpenseModal && selectedCategoryForAddExpense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <h2 className="text-2xl font-bold mb-2">Add Expense</h2>
            <p className="text-sm text-slate-600 mb-4">
              Category: <strong>{selectedCategoryForAddExpense.name}</strong>
            </p>
            {error && <ErrorMessage message={error} />}
            <form onSubmit={handleAddExpense} className="space-y-4">
              <Input
                label="Amount ($)"
                type="number"
                step="0.01"
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(e.target.value)}
                placeholder="0.00"
                required
              />

              <Input
                label="Vendor (Optional)"
                type="text"
                value={expenseVendor}
                onChange={(e) => setExpenseVendor(e.target.value)}
                placeholder="e.g., Restaurant Name"
              />

              <div className="flex gap-3">
                <Button type="submit" disabled={loading}>
                  {loading ? "Adding..." : "Add Expense"}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowAddExpenseModal(false);
                    setExpenseAmount("");
                    setExpenseVendor("");
                    setSelectedCategoryForAddExpense(null);
                    setShowExpensesModal(true);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
