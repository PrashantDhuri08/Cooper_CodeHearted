"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getEvent, addParticipant, depositToPool, createCategory } from "@/lib/api";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { ErrorMessage } from "@/components/ErrorMessage";
import Link from "next/link";

export default function EventDetailPage() {
  const { eventId } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Modals
  const [showAddParticipant, setShowAddParticipant] = useState(false);
  const [showDeposit, setShowDeposit] = useState(false);
  const [showCreateCategory, setShowCreateCategory] = useState(false);
  
  // Form states
  const [participantId, setParticipantId] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    loadEvent();
  }, [eventId]);

  const loadEvent = () => {
    const events = JSON.parse(localStorage.getItem("cooper_events") || "[]");
    const found = events.find((e: any) => e.id === parseInt(eventId as string));
    if (found) {
      setEvent(found);
    } else {
      router.push("/dashboard/events");
    }
  };

  const handleAddParticipant = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userId = parseInt(participantId);
      await addParticipant(parseInt(eventId as string), userId);

      // Update local storage
      const events = JSON.parse(localStorage.getItem("cooper_events") || "[]");
      const eventIndex = events.findIndex((e: any) => e.id === parseInt(eventId as string));
      
      if (eventIndex !== -1) {
        events[eventIndex].participants.push({
          userId: userId,
          userName: `User ${userId}`,
          status: "joined"
        });
        localStorage.setItem("cooper_events", JSON.stringify(events));
        setEvent(events[eventIndex]);
      }

      setShowAddParticipant(false);
      setParticipantId("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add participant");
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await depositToPool(
        parseInt(eventId as string),
        user!.id,
        parseFloat(depositAmount)
      );

      // Update local storage
      const events = JSON.parse(localStorage.getItem("cooper_events") || "[]");
      const eventIndex = events.findIndex((e: any) => e.id === parseInt(eventId as string));
      
      if (eventIndex !== -1) {
        events[eventIndex].pooledAmount = (events[eventIndex].pooledAmount || 0) + parseFloat(depositAmount);
        localStorage.setItem("cooper_events", JSON.stringify(events));
        setEvent(events[eventIndex]);
      }

      setShowDeposit(false);
      setDepositAmount("");
      alert("Deposit successful!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to deposit");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await createCategory(parseInt(eventId as string), categoryName);
      
      setShowCreateCategory(false);
      setCategoryName("");
      alert("Category created! Go to Categories page to manage it.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  if (!event) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard/events" className="text-blue-600 hover:text-blue-700 font-semibold mb-4 inline-block">
          ← Back to Events
        </Link>
        <h1 className="text-3xl font-bold text-slate-800">{event.title}</h1>
        <p className="text-slate-600 mt-1">Event ID: {event.id}</p>
      </div>

      {error && <ErrorMessage message={error} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <h3 className="font-bold text-lg mb-3">👥 Participants</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {event.participants.map((p: any, idx: number) => (
              <div key={idx} className="flex justify-between items-center p-2 bg-slate-50 rounded">
                <span>{p.userName}</span>
                {p.userId === event.organizerId && <span className="text-xs bg-blue-100 px-2 py-1 rounded">Organizer</span>}
              </div>
            ))}
          </div>
          <Button 
            className="w-full mt-4" 
            variant="secondary"
            onClick={() => setShowAddParticipant(true)}
          >
            Add Participant
          </Button>
        </Card>

        <Card>
          <h3 className="font-bold text-lg mb-3">💰 Wallet</h3>
          <p className="text-3xl font-bold text-blue-700">${event.pooledAmount || 0}</p>
          <p className="text-sm text-slate-600 mt-1">Total Pooled</p>
          <Button 
            className="w-full mt-4"
            onClick={() => setShowDeposit(true)}
          >
            Deposit Funds
          </Button>
        </Card>

        <Card>
          <h3 className="font-bold text-lg mb-3">📁 Categories</h3>
          <p className="text-slate-600 text-sm">Manage expense categories</p>
          <Button 
            className="w-full mt-4" 
            variant="secondary"
            onClick={() => setShowCreateCategory(true)}
          >
            Create Category
          </Button>
        </Card>
      </div>

      <Card>
        <h3 className="font-bold text-lg mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button 
            variant="secondary"
            onClick={() => router.push("/dashboard/bills")}
          >
            Upload Bill
          </Button>
          <Button 
            variant="secondary"
            onClick={() => router.push("/dashboard/categories")}
          >
            Manage Categories
          </Button>
          <Button 
            variant="secondary"
            onClick={() => router.push("/dashboard/settlement")}
          >
            View Settlement
          </Button>
          <Button variant="danger">End Event</Button>
        </div>
      </Card>

      {/* Add Participant Modal */}
      {showAddParticipant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Add Participant</h2>
            <form onSubmit={handleAddParticipant} className="space-y-4">
              <Input
                label="User ID"
                type="number"
                value={participantId}
                onChange={(e) => setParticipantId(e.target.value)}
                placeholder="Enter user ID"
                required
              />
              <div className="flex gap-3">
                <Button type="submit" disabled={loading}>
                  {loading ? "Adding..." : "Add Participant"}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowAddParticipant(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Deposit Modal */}
      {showDeposit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Deposit to Pool</h2>
            <form onSubmit={handleDeposit} className="space-y-4">
              <Input
                label="Amount ($)"
                type="number"
                step="0.01"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="Enter amount"
                required
              />
              <div className="flex gap-3">
                <Button type="submit" disabled={loading}>
                  {loading ? "Processing..." : "Deposit"}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowDeposit(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Create Category Modal */}
      {showCreateCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Create Category</h2>
            <form onSubmit={handleCreateCategory} className="space-y-4">
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
                  onClick={() => setShowCreateCategory(false)}
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
