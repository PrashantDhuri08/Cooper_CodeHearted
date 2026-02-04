"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  depositToPool,
  createCategory,
  joinCategory,
  createExpense,
  getSettlement,
} from "@/lib/api";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Card } from "@/components/Card";
import { ErrorMessage } from "@/components/ErrorMessage";

interface Category {
  id: number;
  name: string;
  participants: number[];
}

interface Deposit {
  userId: number;
  amount: number;
}

export default function EventDashboard() {
  const params = useParams();
  const eventId = parseInt(params.eventId as string);

  // State for deposits
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [depositUserId, setDepositUserId] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [depositLoading, setDepositLoading] = useState(false);
  const [depositError, setDepositError] = useState("");

  // State for categories
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryName, setCategoryName] = useState("");
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryError, setCategoryError] = useState("");

  // State for joining categories
  const [joinUserId, setJoinUserId] = useState<{ [key: number]: string }>({});
  const [joinLoading, setJoinLoading] = useState<{ [key: number]: boolean }>({});

  // State for expenses
  const [selectedCategory, setSelectedCategory] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseLoading, setExpenseLoading] = useState(false);
  const [expenseError, setExpenseError] = useState("");

  // State for settlement
  const [settlement, setSettlement] = useState<{ [key: string]: number } | null>(null);
  const [settlementLoading, setSettlementLoading] = useState(false);
  const [settlementError, setSettlementError] = useState("");

  // Handle deposit
  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDepositError("");

    const userId = parseInt(depositUserId);
    const amount = parseFloat(depositAmount);

    if (isNaN(userId) || userId <= 0) {
      setDepositError("Valid user ID is required");
      return;
    }

    if (isNaN(amount) || amount <= 0) {
      setDepositError("Valid amount is required");
      return;
    }

    setDepositLoading(true);

    try {
      await depositToPool(eventId, userId, amount);
      setDeposits([...deposits, { userId, amount }]);
      setDepositUserId("");
      setDepositAmount("");
    } catch (err) {
      setDepositError(err instanceof Error ? err.message : "Failed to deposit");
    } finally {
      setDepositLoading(false);
    }
  };

  // Handle create category
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setCategoryError("");

    if (!categoryName.trim()) {
      setCategoryError("Category name is required");
      return;
    }

    setCategoryLoading(true);

    try {
      const category = await createCategory(eventId, categoryName);
      setCategories([...categories, { id: category.id, name: category.name, participants: [] }]);
      setCategoryName("");
    } catch (err) {
      setCategoryError(err instanceof Error ? err.message : "Failed to create category");
    } finally {
      setCategoryLoading(false);
    }
  };

  // Handle join category
  const handleJoinCategory = async (categoryId: number) => {
    const userId = parseInt(joinUserId[categoryId] || "");

    if (isNaN(userId) || userId <= 0) {
      return;
    }

    setJoinLoading({ ...joinLoading, [categoryId]: true });

    try {
      await joinCategory(categoryId, userId);
      setCategories(
        categories.map((cat) =>
          cat.id === categoryId
            ? { ...cat, participants: [...cat.participants, userId] }
            : cat
        )
      );
      setJoinUserId({ ...joinUserId, [categoryId]: "" });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to join category");
    } finally {
      setJoinLoading({ ...joinLoading, [categoryId]: false });
    }
  };

  // Handle create expense
  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    setExpenseError("");

    const categoryId = parseInt(selectedCategory);
    const amount = parseFloat(expenseAmount);

    if (isNaN(categoryId)) {
      setExpenseError("Please select a category");
      return;
    }

    if (isNaN(amount) || amount <= 0) {
      setExpenseError("Valid amount is required");
      return;
    }

    setExpenseLoading(true);

    try {
      const response = await createExpense(eventId, categoryId, amount);
      // Redirect to payment URL
      window.location.href = response.payment_url;
    } catch (err) {
      setExpenseError(err instanceof Error ? err.message : "Failed to create expense");
      setExpenseLoading(false);
    }
  };

  // Handle view settlement
  const handleViewSettlement = async () => {
    setSettlementError("");
    setSettlementLoading(true);

    try {
      const result = await getSettlement(eventId);
      setSettlement(result);
    } catch (err) {
      setSettlementError(err instanceof Error ? err.message : "Failed to load settlement");
    } finally {
      setSettlementLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <a href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold mb-4 transition-colors">
            <span className="mr-1">←</span> Back to Home
          </a>
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Event Dashboard
          </h1>
          <p className="text-slate-600 text-lg">Event ID: <span className="font-semibold text-slate-800">{eventId}</span></p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">
          {/* Deposit Section */}
          <Card title="💰 Deposit to Shared Pool" className="bg-gradient-to-br from-white to-blue-50/30">
            <form onSubmit={handleDeposit} className="space-y-4">
              <Input
                label="User ID"
                type="number"
                placeholder="Enter user ID"
                value={depositUserId}
                onChange={(e) => setDepositUserId(e.target.value)}
                required
                min="1"
              />

              <Input
                label="Amount"
                type="number"
                step="0.01"
                placeholder="Enter amount"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                required
                min="0.01"
              />

              {depositError && <ErrorMessage message={depositError} />}

              <Button type="submit" loading={depositLoading} className="w-full">
                Deposit
              </Button>
            </form>

            {deposits.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold mb-3 text-slate-800">Recent Deposits:</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {deposits.map((deposit, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200 shadow-sm"
                    >
                      <span className="font-medium text-slate-700">User {deposit.userId}</span>
                      <span className="font-bold text-blue-700 text-lg">${deposit.amount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Category Section */}
          <Card title="📁 Expense Categories" className="bg-gradient-to-br from-white to-purple-50/30">
            <form onSubmit={handleCreateCategory} className="space-y-4">
              <Input
                label="Category Name"
                type="text"
                placeholder="e.g., Food, Transport"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                required
              />

              {categoryError && <ErrorMessage message={categoryError} />}

              <Button type="submit" loading={categoryLoading} className="w-full">
                Create Category
              </Button>
            </form>

            {categories.length > 0 && (
              <div className="mt-6 space-y-4 max-h-96 overflow-y-auto">
                <h3 className="font-semibold text-slate-800">Your Categories:</h3>
                {categories.map((category) => (
                  <div key={category.id} className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200 shadow-sm">
                    <div className="font-bold mb-3 text-purple-900 text-lg">{category.name}</div>
                    <div className="flex gap-2 mb-3">
                      <Input
                        type="number"
                        placeholder="User ID"
                        value={joinUserId[category.id] || ""}
                        onChange={(e) =>
                          setJoinUserId({
                            ...joinUserId,
                            [category.id]: e.target.value,
                          })
                        }
                        min="1"
                        className="flex-1"
                      />
                      <Button
                        onClick={() => handleJoinCategory(category.id)}
                        loading={joinLoading[category.id]}
                        variant="secondary"
                      >
                        Join
                      </Button>
                    </div>
                    {category.participants.length > 0 && (
                      <div className="text-sm text-slate-700 bg-white/60 px-3 py-2 rounded border border-purple-100">
                        <span className="font-semibold">Participants: </span>
                        <span className="font-medium text-purple-700">{category.participants.join(", ")}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Expense Section */}
          <Card title="💸 Create Expense" className="bg-gradient-to-br from-white to-green-50/30">
            <form onSubmit={handleCreateExpense} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-2">
                  Select Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2.5 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                  required
                >
                  <option value="">Choose category...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Amount"
                type="number"
                step="0.01"
                placeholder="Enter expense amount"
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(e.target.value)}
                required
                min="0.01"
              />

              {expenseError && <ErrorMessage message={expenseError} />}

              <Button type="submit" loading={expenseLoading} className="w-full">
                Create Expense & Pay
              </Button>

              <p className="text-xs text-slate-600 text-center bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
                💳 You will be redirected to Finternet payment page
              </p>
            </form>
          </Card>

          {/* Settlement Section */}
          <Card title="⚖️ Settlement View" className="bg-gradient-to-br from-white to-amber-50/30">
            <Button
              onClick={handleViewSettlement}
              loading={settlementLoading}
              className="w-full mb-4"
            >
              Calculate Settlement
            </Button>

            {settlementError && <ErrorMessage message={settlementError} />}

            {settlement && (
              <div className="space-y-3">
                <h3 className="font-semibold mb-3 text-slate-800 text-lg">Balances:</h3>
                {Object.entries(settlement).map(([userId, balance]) => (
                  <div
                    key={userId}
                    className={`flex justify-between items-center p-4 rounded-lg shadow-sm border-2 transition-all ${
                      balance > 0
                        ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-300"
                        : balance < 0
                        ? "bg-gradient-to-r from-red-50 to-rose-50 border-red-300"
                        : "bg-gradient-to-r from-slate-50 to-gray-50 border-slate-300"
                    }`}
                  >
                    <span className="font-bold text-slate-800 text-lg">User {userId}</span>
                    <span
                      className={`font-extrabold text-2xl ${
                        balance > 0
                          ? "text-green-700"
                          : balance < 0
                          ? "text-red-700"
                          : "text-slate-600"
                      }`}
                    >
                      {balance > 0 ? "+" : ""}${balance.toFixed(2)}
                    </span>
                  </div>
                ))}
                <div className="mt-6 text-sm text-slate-700 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200 shadow-sm">
                  <div className="font-bold mb-2 text-slate-800">Legend:</div>
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <span className="w-4 h-4 bg-green-200 rounded mr-2 border border-green-400"></span>
                      <span><strong className="text-green-700">Green:</strong> Owed refund (positive balance)</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-4 h-4 bg-red-200 rounded mr-2 border border-red-400"></span>
                      <span><strong className="text-red-700">Red:</strong> Owes money (negative balance)</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-4 h-4 bg-slate-200 rounded mr-2 border border-slate-400"></span>
                      <span><strong className="text-slate-700">Gray:</strong> Settled (zero balance)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
