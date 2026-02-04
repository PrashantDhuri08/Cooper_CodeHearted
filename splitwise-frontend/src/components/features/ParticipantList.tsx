"use client";

import { useState, useEffect } from "react";
import { splitwiseApi } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Users, Loader2, Mail, User } from "lucide-react";

interface ParticipantListProps {
    eventId: number;
}

export function ParticipantList({ eventId }: ParticipantListProps) {
    const [participants, setParticipants] = useState<Array<{ user_id: number; email: string }>>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchParticipants = async () => {
            try {
                const data = await splitwiseApi.getEventParticipants(eventId);
                setParticipants(data.participants);
            } catch (err: any) {
                setError(err.response?.data?.error || "Failed to fetch participants");
            } finally {
                setLoading(false);
            }
        };
        fetchParticipants();
    }, [eventId]);

    return (
        <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <Users className="w-5 h-5 mr-2 text-purple-400" />
                    Participants ({participants.length})
                </h3>

                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
                    </div>
                ) : error ? (
                    <p className="text-red-400 text-sm">{error}</p>
                ) : participants.length === 0 ? (
                    <p className="text-gray-500 text-sm">No participants yet</p>
                ) : (
                    <div className="space-y-2">
                        {participants.map((participant) => (
                            <motion.div
                                key={participant.user_id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="p-3 rounded-lg bg-white/5 border border-white/10 hover:border-purple-500/50 transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                                        <User className="w-4 h-4 text-purple-400" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-white font-medium">
                                                User #{participant.user_id}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1 text-gray-400 text-xs mt-1">
                                            <Mail className="w-3 h-3" />
                                            <span>{participant.email}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>
        </Card>
    );
}
