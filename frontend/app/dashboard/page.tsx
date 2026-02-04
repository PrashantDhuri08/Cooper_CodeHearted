"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/Card";

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalEvents: 0,
    activeEvents: 0,
    totalPooled: 0,
    totalExpenses: 0,
    pendingSettlement: 0,
  });
  const [recentBills, setRecentBills] = useState<any[]>([]);

  useEffect(() => {
    loadStats();
    
    // Reload when page becomes visible
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadStats();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', loadStats);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', loadStats);
    };
  }, [user]);

  const loadStats = () => {
    // Load stats from localStorage
    const events = JSON.parse(localStorage.getItem("cooper_events") || "[]");
    const userEvents = events.filter((e: any) => 
      e.participants?.some((p: any) => p.userId === user?.id)
    );
    
    // Calculate total expenses
    const bills = JSON.parse(localStorage.getItem("cooper_bills") || "[]");
    const totalExpenses = bills.reduce((sum: number, bill: any) => sum + (bill.amount || 0), 0);
    
    // Get recent bills (last 3)
    const sortedBills = [...bills].sort((a: any, b: any) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ).slice(0, 3);
    setRecentBills(sortedBills);
    
    setStats({
      totalEvents: userEvents.length,
      activeEvents: userEvents.filter((e: any) => e.status === "active").length,
      totalPooled: userEvents.reduce((sum: number, e: any) => sum + (e.pooledAmount || 0), 0),
      totalExpenses: totalExpenses,
      pendingSettlement: userEvents.filter((e: any) => e.status === "pending_settlement").length,
    });
  };

  const quickActions = [
    {
      title: "Create Event",
      description: "Start a new group expense event",
      icon: "🎉",
      href: "/dashboard/events?action=create",
      color: "from-blue-500 to-indigo-600",
    },
    {
      title: "Add Funds",
      description: "Deposit to shared wallet",
      icon: "💰",
      href: "/dashboard/wallet",
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "Upload Bill",
      description: "Scan and categorize expenses",
      icon: "🧾",
      href: "/dashboard/bills",
      color: "from-purple-500 to-pink-600",
    },
    {
      title: "View Settlement",
      description: "Check balances and refunds",
      icon: "⚖️",
      href: "/dashboard/settlement",
      color: "from-amber-500 to-orange-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-4xl font-extrabold text-slate-800 mb-2">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-lg text-slate-600">
          Manage your group expenses with ease
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-600">Total Events</p>
              <p className="text-3xl font-bold text-blue-700 mt-1">{stats.totalEvents}</p>
            </div>
            <div className="text-4xl">🎉</div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-600">Active Events</p>
              <p className="text-3xl font-bold text-green-700 mt-1">{stats.activeEvents}</p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-600">Total Pooled</p>
              <p className="text-3xl font-bold text-purple-700 mt-1">${stats.totalPooled}</p>
            </div>
            <div className="text-4xl">💰</div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-600">Total Expenses</p>
              <p className="text-3xl font-bold text-amber-700 mt-1">${stats.totalExpenses.toFixed(2)}</p>
            </div>
            <div className="text-4xl">🧾</div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action) => (
            <Link key={action.title} href={action.href}>
              <Card className="h-full hover:shadow-xl transition-all cursor-pointer group">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${action.color} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform`}>
                  {action.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{action.title}</h3>
                <p className="text-sm text-slate-600">{action.description}</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Recent Expenses</h2>
        <div className="space-y-3">
          {recentBills.length === 0 ? (
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-xl">
                  🧾
                </div>
                <div>
                  <p className="font-semibold text-slate-800">No expenses yet</p>
                  <p className="text-sm text-slate-500">Upload bills to track your expenses</p>
                </div>
              </div>
              <Link href="/dashboard/bills">
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-all">
                  Add Expense
                </button>
              </Link>
            </div>
          ) : (
            <>
              {recentBills.map((bill: any) => (
                <div key={bill.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-xl">
                      🧾
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{bill.vendor}</p>
                      <p className="text-sm text-slate-500">
                        {new Date(bill.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-700">${bill.amount}</p>
                    <p className="text-xs text-slate-500">{bill.status}</p>
                  </div>
                </div>
              ))}
              <Link href="/dashboard/bills">
                <button className="w-full px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-semibold text-sm transition-all">
                  View All Expenses
                </button>
              </Link>
            </>
          )}
        </div>
      </Card>

      {/* How It Works */}
      <Card className="bg-gradient-to-br from-white to-blue-50/30">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">How Cooper Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-3xl mx-auto mb-3">
              1️⃣
            </div>
            <h3 className="font-bold text-slate-800 mb-2">Create & Invite</h3>
            <p className="text-sm text-slate-600">Set up events and add participants with clear rules</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-3xl mx-auto mb-3">
              2️⃣
            </div>
            <h3 className="font-bold text-slate-800 mb-2">Pool & Spend</h3>
            <p className="text-sm text-slate-600">Everyone deposits funds, expenses are paid from shared pool</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-3xl mx-auto mb-3">
              3️⃣
            </div>
            <h3 className="font-bold text-slate-800 mb-2">Auto-Settle</h3>
            <p className="text-sm text-slate-600">System calculates balances and handles refunds automatically</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
