"use client";

import { useState } from "react";
import { splitwiseApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { UserPlus, Loader2 } from "lucide-react";

interface ParticipantManagerProps {
    eventId: number;
    adminId: number;
}

export function ParticipantManager({ eventId, adminId }: ParticipantManagerProps) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleAddParticipant = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const response = await splitwiseApi.addParticipant(eventId, email, adminId);
            if ("error" in response) {
                setError(response.error);
            } else {
                setSuccess("Participant added successfully!");
                setEmail("");
            }
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to add participant");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <UserPlus className="w-5 h-5 mr-2 text-indigo-400" />
                    Add Participant
                </h3>

                <form onSubmit={handleAddParticipant} className="space-y-4">
                    <div>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="participant@email.com"
                            required
                            className="bg-white/5 border-white/10 text-white"
                        />
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs"
                        >
                            {error}
                        </motion.div>
                    )}

                    {success && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-2 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-xs"
                        >
                            {success}
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
                                <UserPlus className="w-4 h-4 mr-2" />
                                Add Participant
                            </>
                        )}
                    </Button>
                </form>
            </motion.div>
        </Card>
    );
}
