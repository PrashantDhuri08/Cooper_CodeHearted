"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Auth } from "@/components/features/Auth";
import { CreateEvent } from "@/components/features/CreateEvent";
import { splitwiseApi } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Calendar, Plus, Loader2, ArrowRight } from "lucide-react";

export default function Home() {
    const router = useRouter();
    const [userId, setUserId] = useState<number | null>(null);
    const [userEmail, setUserEmail] = useState<string>("");
    const [showCreateEvent, setShowCreateEvent] = useState(false);
    const [events, setEvents] = useState<Array<{ event_id: number; title: string }>>([]);
    const [loadingEvents, setLoadingEvents] = useState(false);

    const handleAuthSuccess = async (id: number, email: string) => {
        setUserId(id);
        setUserEmail(email);

        // Fetch user's events
        setLoadingEvents(true);
        try {
            const data = await splitwiseApi.getUserEvents(id);
            setEvents(data.events);
        } catch (err) {
            console.error("Failed to fetch events", err);
        } finally {
            setLoadingEvents(false);
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-24 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/30 rounded-full blur-[100px] animate-pulse-slow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-900/30 rounded-full blur-[100px] animate-pulse-slow" />
            </div>

            {/* Logo/Title */}
            <div className="mb-8 text-center">
                <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-2">
                    Cooper
                </h1>
                <p className="text-gray-400 text-lg">Group Expense Management</p>
            </div>

            {!userId ? (
                <Auth onAuthSuccess={handleAuthSuccess} />
            ) : showCreateEvent ? (
                <div className="w-full max-w-md space-y-4">
                    <Button
                        onClick={() => setShowCreateEvent(false)}
                        variant="ghost"
                        className="text-indigo-400 hover:text-indigo-300"
                    >
                        ← Back to Events
                    </Button>
                    <CreateEvent adminEmail={userEmail} userId={userId} />
                </div>
            ) : (
                <Card className="w-full max-w-2xl p-8 bg-white/5 backdrop-blur-xl border-white/10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-white">Your Events</h2>
                            <Button
                                onClick={() => setShowCreateEvent(true)}
                                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                New Event
                            </Button>
                        </div>

                        {loadingEvents ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
                            </div>
                        ) : events.length === 0 ? (
                            <div className="text-center py-12">
                                <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                                <p className="text-gray-400 mb-4">No events yet</p>
                                <Button
                                    onClick={() => setShowCreateEvent(true)}
                                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create Your First Event
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {events.map((event) => (
                                    <motion.div
                                        key={event.event_id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        whileHover={{ scale: 1.02 }}
                                        className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-indigo-500/50 transition-all cursor-pointer group"
                                        onClick={() => router.push(`/events/${event.event_id}?userId=${userId}&adminId=${userId}`)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                                                    <Calendar className="w-5 h-5 text-indigo-400" />
                                                </div>
                                                <div>
                                                    <h3 className="text-white font-medium group-hover:text-indigo-300 transition-colors">
                                                        {event.title}
                                                    </h3>
                                                    <p className="text-gray-500 text-sm">Event ID: {event.event_id}</p>
                                                </div>
                                            </div>
                                            <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-indigo-400 transition-colors" />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </Card>
            )}
        </main>
    );
}
