"use client";

import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { ErrorMessage } from "@/components/ErrorMessage";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { depositToPool } from "@/lib/api";

export default function WalletPage() {
  const { user } = useAuth();
  const [amount, setAmount] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("");
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem("cooper_events") || "[]");
    const userEvents = storedEvents.filter((e: any) =>
      e.participants?.some((p: any) => p.userId === user?.id)
    );
    setEvents(userEvents);
  }, [user]);

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (!selectedEvent) {
        throw new Error("Please select an event");
      }

      await depositToPool(
        parseInt(selectedEvent),
        user!.id,
        parseFloat(amount)
      );

      // Update local storage
      const storedEvents = JSON.parse(localStorage.getItem("cooper_events") || "[]");
      const eventIndex = storedEvents.findIndex((e: any) => e.id === parseInt(selectedEvent));
      
      if (eventIndex !== -1) {
        storedEvents[eventIndex].pooledAmount = 
          (storedEvents[eventIndex].pooledAmount || 0) + parseFloat(amount);
        localStorage.setItem("cooper_events", JSON.stringify(storedEvents));
        setEvents(storedEvents.filter((e: any) =>
          e.participants?.some((p: any) => p.userId === user?.id)
        ));
      }

      setSuccess(`Successfully deposited $${amount} to the event pool!`);
      setAmount("");
      setSelectedEvent("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to deposit");
    } finally {
      setLoading(false);
    }
  };

  const totalBalance = events.reduce((sum, e) => sum + (e.pooledAmount || 0), 0);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">Shared Wallet</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
          <h3 className="font-semibold text-slate-600 mb-2">Total Pooled</h3>
          <p className="text-4xl font-bold text-green-700">${totalBalance.toFixed(2)}</p>
          <p className="text-sm text-slate-600 mt-2">Across {events.length} events</p>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
          <h3 className="font-semibold text-slate-600 mb-2">Active Events</h3>
          <p className="text-4xl font-bold text-blue-700">{events.length}</p>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50">
          <h3 className="font-semibold text-slate-600 mb-2">My Wallet</h3>
          <p className="text-4xl font-bold text-purple-700">Connected</p>
          <p className="text-sm text-slate-600 mt-2">Finternet Enabled</p>
        </Card>
      </div>

      <Card>
        <h2 className="text-2xl font-bold mb-4">Deposit Funds</h2>
        {error && <ErrorMessage message={error} />}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
            {success}
          </div>
        )}
        <form onSubmit={handleDeposit} className="space-y-4">
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
                  {event.title} (Pooled: ${event.pooledAmount || 0})
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Amount ($)"
            type="number"
            step="0.01"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Processing..." : "Deposit via Finternet"}
          </Button>
        </form>
      </Card>

      <Card>
        <h2 className="text-2xl font-bold mb-4">Your Events</h2>
        {events.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            No events yet. Create an event to get started!
          </div>
        ) : (
          <div className="space-y-3">
            {events.map((event) => (
              <div
                key={event.id}
                className="flex justify-between items-center p-4 bg-slate-50 rounded-lg"
              >
                <div>
                  <h3 className="font-bold text-slate-800">{event.title}</h3>
                  <p className="text-sm text-slate-600">
                    {event.participants.length} participants
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-700">${event.pooledAmount || 0}</p>
                  <p className="text-xs text-slate-600">Pooled</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
