"use client";

import { useState } from "react";
import { splitwiseApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ThumbsUp, ThumbsDown, Loader2, Vote } from "lucide-react";

interface VotingManagerProps {
    eventId: number;
    voterId: number;
}

export function VotingManager({ eventId, voterId }: VotingManagerProps) {
    const [targetUserId, setTargetUserId] = useState("");
    const [voting, setVoting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleVote = async (approve: boolean) => {
        if (!targetUserId) {
            setError("Please enter a user ID");
            return;
        }

        setError("");
        setSuccess("");
        setVoting(true);

        try {
            await splitwiseApi.vote(
                eventId,
                parseInt(targetUserId),
                voterId,
                approve
            );
            setSuccess(`Vote recorded: ${approve ? "Approved ✓" : "Rejected ✗"}`);
            setTargetUserId("");
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to record vote");
        } finally {
            setVoting(false);
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
                    <Vote className="w-5 h-5 mr-2 text-blue-400" />
                    Vote for User
                </h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Target User ID
                        </label>
                        <input
                            type="number"
                            value={targetUserId}
                            onChange={(e) => setTargetUserId(e.target.value)}
                            placeholder="Enter user ID to vote on"
                            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="flex gap-3">
                        <Button
                            onClick={() => handleVote(true)}
                            disabled={voting || !targetUserId}
                            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                        >
                            {voting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    <ThumbsUp className="w-4 h-4 mr-2" />
                                    Approve
                                </>
                            )}
                        </Button>

                        <Button
                            onClick={() => handleVote(false)}
                            disabled={voting || !targetUserId}
                            className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700"
                        >
                            {voting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    <ThumbsDown className="w-4 h-4 mr-2" />
                                    Reject
                                </>
                            )}
                        </Button>
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

                    {success && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm"
                        >
                            {success}
                        </motion.div>
                    )}

                    <div className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                        <p className="text-blue-300 text-xs">
                            💡 <strong>How voting works:</strong>
                        </p>
                        <ul className="text-blue-300 text-xs mt-2 space-y-1 ml-4">
                            <li>• Vote to approve/reject users</li>
                            <li>• 50% approval needed to join categories</li>
                            <li>• Votes are checked when user tries to join</li>
                        </ul>
                    </div>
                </div>
            </motion.div>
        </Card>
    );
}
