"use client";

import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { ErrorMessage } from "@/components/ErrorMessage";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getSettlement } from "@/lib/api";

export default function SettlementPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [settlement, setSettlement] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem("cooper_events") || "[]");
    const userEvents = storedEvents.filter((e: any) =>
      e.participants?.some((p: any) => p.userId === user?.id)
    );
    setEvents(userEvents);
  }, [user]);

  const handleCalculateSettlement = async () => {
    if (!selectedEvent) {
      setError("Please select an event");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const result = await getSettlement(parseInt(selectedEvent));
      setSettlement(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to calculate settlement");
    } finally {
      setLoading(false);
    }
  };

  const getUserName = (userId: string) => {
    // Try to find user in event participants
    const event = events.find(e => e.id === parseInt(selectedEvent));
    const participant = event?.participants.find((p: any) => p.userId === parseInt(userId));
    return participant?.userName || `User ${userId}`;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">Settlement & Refunds</h1>

      <Card>
        <h2 className="text-2xl font-bold mb-4">Calculate Settlement</h2>
        <p className="text-slate-600 mb-4">View final balances and get automatic refunds</p>
        {error && <ErrorMessage message={error} />}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Select Event
            </label>
            <select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose an event...</option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.title} (${event.pooledAmount || 0} pooled)
                </option>
              ))}
            </select>
          </div>
          <Button 
            className="w-full" 
            onClick={handleCalculateSettlement}
            disabled={loading}
          >
            {loading ? "Calculating..." : "Calculate Now"}
          </Button>
        </div>
      </Card>

      {settlement && (
        <Card>
          <h2 className="text-2xl font-bold mb-4">Settlement Balances</h2>
          <div className="space-y-3">
            {Object.entries(settlement).map(([userId, balance]: [string, any]) => (
              <div
                key={userId}
                className={`flex justify-between items-center p-4 rounded-lg ${
                  balance > 0
                    ? "bg-green-50 border border-green-200"
                    : balance < 0
                    ? "bg-red-50 border border-red-200"
                    : "bg-slate-50 border border-slate-200"
                }`}
              >
                <div>
                  <h3 className="font-bold text-slate-800">{getUserName(userId)}</h3>
                  <p className="text-xs text-slate-600">User ID: {userId}</p>
                </div>
                <div className="text-right">
                  <p className={`text-xl font-bold ${
                    balance > 0 ? "text-green-700" : balance < 0 ? "text-red-700" : "text-slate-700"
                  }`}>
                    {balance > 0 ? "+" : ""}${balance.toFixed(2)}
                  </p>
                  <p className="text-xs text-slate-600">
                    {balance > 0 ? "To receive" : balance < 0 ? "To pay" : "Settled"}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-slate-700">
              💡 <strong>Next Steps:</strong> Positive balances will be automatically refunded to participants via Finternet. 
              Negative balances indicate pending payments that will be deducted from the pool.
            </p>
          </div>
        </Card>
      )}

      {!settlement && (
        <Card>
          <h2 className="text-2xl font-bold mb-4">Balances</h2>
          <div className="text-center py-8 text-slate-500">
            No settlements calculated yet
          </div>
        </Card>
      )}

      <Card className="bg-gradient-to-br from-white to-blue-50/30">
        <h2 className="text-xl font-bold mb-3">How Auto-Settlement Works</h2>
        <div className="space-y-2 text-sm text-slate-600">
          <p>✓ System tracks all deposits and expenses</p>
          <p>✓ Calculates fair share for each participant</p>
          <p>✓ Automatically processes refunds via Finternet</p>
          <p>✓ Zero manual calculations needed</p>
          <p>✓ Real-time balance updates</p>
        </div>
      </Card>
    </div>
  );
}
