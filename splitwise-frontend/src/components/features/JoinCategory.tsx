"use client";

import { useState } from "react";
import { splitwiseApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { UserPlus, Loader2, CheckCircle, XCircle } from "lucide-react";

interface JoinCategoryProps {
    eventId: number;
    userId: number;
}

export function JoinCategory({ eventId, userId }: JoinCategoryProps) {
    const [categoryId, setCategoryId] = useState("");
    const [joining, setJoining] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleJoin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setJoining(true);

        try {
            const response = await splitwiseApi.joinCategory(
                parseInt(categoryId),
                userId,
                eventId
            );

            if ("error" in response) {
                setError(response.error);
            } else {
                setSuccess("Successfully joined category!");
                setCategoryId("");
            }
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to join category");
        } finally {
            setJoining(false);
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
                    <UserPlus className="w-5 h-5 mr-2 text-green-400" />
                    Join Category
                </h3>

                <form onSubmit={handleJoin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Category ID
                        </label>
                        <input
                            type="number"
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            placeholder="Enter category ID"
                            required
                            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-2"
                        >
                            <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-red-400 text-sm font-medium">{error}</p>
                                {error.includes("50%") && (
                                    <p className="text-red-300 text-xs mt-1">
                                        You need more votes from group members to join this category.
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {success && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center gap-2"
                        >
                            <CheckCircle className="w-5 h-5 text-green-400" />
                            <p className="text-green-400 text-sm font-medium">{success}</p>
                        </motion.div>
                    )}

                    <Button
                        type="submit"
                        disabled={joining}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    >
                        {joining ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <>
                                <UserPlus className="w-4 h-4 mr-2" />
                                Join Category
                            </>
                        )}
                    </Button>

                    <div className="mt-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                        <p className="text-yellow-300 text-xs">
                            ⚠️ <strong>50% Voting Rule:</strong>
                        </p>
                        <p className="text-yellow-300 text-xs mt-1">
                            You need approval from at least 50% of group members to join a category.
                            Ask members to vote for you first!
                        </p>
                    </div>
                </form>
            </motion.div>
        </Card>
    );
}
