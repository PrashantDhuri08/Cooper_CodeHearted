"use client";

import { useState, useEffect } from "react";
import { splitwiseApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Wallet, Loader2, Plus, ExternalLink } from "lucide-react";

interface SharedPoolProps {
    eventId: number;
    userId: number;
}

export function SharedPool({ eventId, userId }: SharedPoolProps) {
    const [poolData, setPoolData] = useState<{
        total_pool: number;
        contributors: Array<{ user_id: number; amount: number }>;
    } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [depositAmount, setDepositAmount] = useState("");
    const [depositing, setDepositing] = useState(false);
    const [depositSuccess, setDepositSuccess] = useState("");
    const [paymentUrl, setPaymentUrl] = useState("");

    const fetchPool = async () => {
        try {
            const data = await splitwiseApi.getPool(eventId);
            setPoolData(data);
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to fetch pool data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPool();
    }, [eventId]);

    const handleDeposit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setDepositSuccess("");
        setPaymentUrl("");
        setDepositing(true);

        try {
            const response = await splitwiseApi.depositToPool(
                eventId,
                userId,
                parseFloat(depositAmount)
            );
            setDepositSuccess("Deposit initiated!");
            setPaymentUrl(response.payment_url);
            setDepositAmount("");
            // Refresh pool data
            fetchPool();
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to deposit");
        } finally {
            setDepositing(false);
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
                    <Wallet className="w-5 h-5 mr-2 text-yellow-400" />
                    Shared Pool
                </h3>

                {loading ? (
                    <div className="flex items-center justify-center py-4">
                        <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Pool Balance */}
                        <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                            <span className="text-gray-400 text-sm">Total Pool</span>
                            <span className="text-2xl font-bold text-yellow-400">
                                ₹{poolData?.total_pool.toLocaleString() || 0}
                            </span>
                        </div>

                        {/* Contributors */}
                        {poolData && poolData.contributors.length > 0 && (
                            <div className="space-y-1">
                                <p className="text-gray-500 text-xs">Contributors:</p>
                                {poolData.contributors.map((c) => (
                                    <div
                                        key={c.user_id}
                                        className="flex items-center justify-between text-xs text-gray-400 px-2"
                                    >
                                        <span>User #{c.user_id}</span>
                                        <span>₹{c.amount.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Deposit Form */}
                        <form onSubmit={handleDeposit} className="space-y-3 pt-2 border-t border-white/10">
                            <p className="text-gray-400 text-sm font-medium">Deposit Funds</p>
                            <Input
                                type="number"
                                step="0.01"
                                value={depositAmount}
                                onChange={(e) => setDepositAmount(e.target.value)}
                                placeholder="Amount"
                                required
                                className="bg-white/5 border-white/10 text-white"
                            />

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs"
                                >
                                    {error}
                                </motion.div>
                            )}

                            {depositSuccess && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 space-y-2"
                                >
                                    <p className="text-green-400 text-xs font-medium">{depositSuccess}</p>
                                    {paymentUrl && (
                                        <a
                                            href={paymentUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center text-indigo-400 hover:text-indigo-300 text-xs"
                                        >
                                            Open Payment Page
                                            <ExternalLink className="w-3 h-3 ml-1" />
                                        </a>
                                    )}
                                </motion.div>
                            )}

                            <Button
                                type="submit"
                                disabled={depositing}
                                className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
                            >
                                {depositing ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Deposit to Pool
                                    </>
                                )}
                            </Button>
                        </form>
                    </div>
                )}
            </motion.div>
        </Card>
    );
}
