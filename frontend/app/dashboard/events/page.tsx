"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { createEvent } from "@/lib/api";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { ErrorMessage } from "@/components/ErrorMessage";

interface Event {
  id: number;
  title: string;
  organizerId: number;
  organizerName: string;
  status: "active" | "completed" | "pending_settlement";
  participants: Array<{ userId: number; userName: string; status: string }>;
  pooledAmount: number;
  createdAt: string;
}

export default function EventsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [events, setEvents] = useState<Event[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDuration, setEventDuration] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Load events from localStorage
    const storedEvents = JSON.parse(localStorage.getItem("cooper_events") || "[]");
    const userEvents = storedEvents.filter((e: Event) =>
      e.participants?.some((p) => p.userId === user?.id)
    );
    setEvents(userEvents);

    // Check if create modal should open
    if (searchParams?.get("action") === "create") {
      setShowCreateModal(true);
    }
  }, [user, searchParams]);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Create event via API
      const apiEvent = await createEvent(eventTitle, user!.id);

      // Store locally with additional data
      const newEvent: Event = {
        id: apiEvent.id,
        title: eventTitle,
        organizerId: user!.id,
        organizerName: user!.name,
        status: "active",
        participants: [
          {
            userId: user!.id,
            userName: user!.name,
            status: "joined",
          },
        ],
        pooledAmount: 0,
        createdAt: new Date().toISOString(),
      };

      const storedEvents = JSON.parse(localStorage.getItem("cooper_events") || "[]");
      storedEvents.push(newEvent);
      localStorage.setItem("cooper_events", JSON.stringify(storedEvents));

      setEvents([...events, newEvent]);
      setShowCreateModal(false);
      setEventTitle("");
      setEventDuration("");
      
      // Navigate to event detail
      router.push(`/dashboard/events/${apiEvent.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinEvent = () => {
    // Implement join via code
    alert("Join event feature coming soon!");
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: "bg-green-100 text-green-700 border-green-300",
      completed: "bg-slate-100 text-slate-700 border-slate-300",
      pending_settlement: "bg-amber-100 text-amber-700 border-amber-300",
    };
    return styles[status as keyof typeof styles] || styles.active;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">My Events</h1>
          <p className="text-slate-600 mt-1">Manage and join group expense events</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setShowCreateModal(true)} variant="primary">
            <span className="mr-2">➕</span>
            Create Event
          </Button>
        </div>
      </div>

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Create New Event</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-4">
              <Input
                label="Event Title"
                placeholder="e.g., Goa Trip, Movie Night"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                required
              />

              <Input
                label="Duration (Optional)"
                placeholder="e.g., 3 days, 1 week"
                value={eventDuration}
                onChange={(e) => setEventDuration(e.target.value)}
              />

              {error && <ErrorMessage message={error} />}

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" loading={loading} className="flex-1">
                  Create Event
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Events List */}
      {events.length === 0 ? (
        <Card className="text-center py-12">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">No Events Yet</h3>
          <p className="text-slate-600 mb-6">Create your first event or join an existing one</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => setShowCreateModal(true)}>Create Event</Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="cursor-pointer"
              onClick={() => router.push(`/dashboard/events/${event.id}`)}
            >
              <Card className="hover:shadow-xl transition-all h-full">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-slate-800">{event.title}</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(
                      event.status
                    )}`}
                  >
                    {event.status.replace("_", " ")}
                  </span>
                </div>

              <div className="space-y-3">
                <div className="flex items-center text-sm text-slate-600">
                  <span className="mr-2">👤</span>
                  <span>Organizer: {event.organizerName}</span>
                </div>

                <div className="flex items-center text-sm text-slate-600">
                  <span className="mr-2">👥</span>
                  <span>{event.participants.length} Participants</span>
                </div>

                <div className="flex items-center text-sm text-slate-600">
                  <span className="mr-2">💰</span>
                  <span className="font-semibold text-blue-700">
                    ${event.pooledAmount.toFixed(2)} Pooled
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-200">
                  <p className="text-xs text-slate-500">
                    Created {new Date(event.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Card>
            </div>
          ))}
        </div>
      )}

      {/* Join Event Section */}
      <Card className="bg-gradient-to-br from-white to-purple-50/30">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Join an Event</h2>
        <p className="text-slate-600 mb-4">
          Have an event code? Enter it below to join an existing event.
        </p>
        <div className="flex gap-3">
          <Input
            placeholder="Enter event code"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleJoinEvent} variant="secondary">
            Join Event
          </Button>
        </div>
      </Card>
    </div>
  );
}
