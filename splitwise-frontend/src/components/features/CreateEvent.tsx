"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { splitwiseApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Calendar, Loader2 } from "lucide-react";

interface CreateEventProps {
    adminEmail: string;
    userId: number;
}

export function CreateEvent({ adminEmail, userId }: CreateEventProps) {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await splitwiseApi.createEvent(title, adminEmail);
            // Navigate to event dashboard with userId and adminId (creator is admin)
            router.push(`/events/${response.event_id}?userId=${userId}&adminId=${userId}`);
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to create event");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-md p-8 bg-white/5 backdrop-blur-xl border-white/10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex items-center justify-center mb-6">
                    <Calendar className="w-8 h-8 text-indigo-400 mr-3" />
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                        Create Event
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Event Title
                        </label>
                        <Input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Weekend Trip, Dinner Party, etc."
                            required
                            className="bg-white/5 border-white/10 text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Admin Email
                        </label>
                        <Input
                            type="email"
                            value={adminEmail}
                            disabled
                            className="bg-white/5 border-white/10 text-gray-400"
                        />
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
                        >
                            {error}
                        </motion.div>
                    )}

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <>
                                <Calendar className="w-4 h-4 mr-2" />
                                Create Event
                            </>
                        )}
                    </Button>
                </form>
            </motion.div>
        </Card>
    );
}
