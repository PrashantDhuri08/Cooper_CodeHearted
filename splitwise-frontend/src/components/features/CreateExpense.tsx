"use client";

import { useState } from "react";
import { splitwiseApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { DollarSign, Loader2, ExternalLink } from "lucide-react";

interface CreateExpenseProps {
    eventId: number;
}

export function CreateExpense({ eventId }: CreateExpenseProps) {
    const [categoryId, setCategoryId] = useState("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [paymentUrl, setPaymentUrl] = useState("");
    const [intentId, setIntentId] = useState("");

    const handleCreateExpense = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setPaymentUrl("");
        setIntentId("");
        setLoading(true);

        try {
            const response = await splitwiseApi.createExpense(
                eventId,
                parseInt(categoryId),
                parseFloat(amount)
            );
            setPaymentUrl(response.payment_url);
            setIntentId(response.intent_id);
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to create expense");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="p-8 bg-white/5 backdrop-blur-xl border-white/10">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <DollarSign className="w-6 h-6 mr-2 text-green-400" />
                    Create Expense
                </h3>

                <form onSubmit={handleCreateExpense} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Category ID
                            </label>
                            <Input
                                type="number"
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                placeholder="1"
                                required
                                className="bg-white/5 border-white/10 text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Amount
                            </label>
                            <Input
                                type="number"
                                step="0.01"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="100.00"
                                required
                                className="bg-white/5 border-white/10 text-white"
                            />
                        </div>
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

                    {paymentUrl && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 space-y-2"
                        >
                            <p className="text-green-400 text-sm font-medium">
                                Payment Intent Created!
                            </p>
                            <p className="text-gray-300 text-xs">Intent ID: {intentId}</p>
                            <a
                                href={paymentUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-indigo-400 hover:text-indigo-300 text-sm"
                            >
                                Open Payment Page
                                <ExternalLink className="w-4 h-4 ml-1" />
                            </a>
                        </motion.div>
                    )}

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <>
                                <DollarSign className="w-4 h-4 mr-2" />
                                Create Expense
                            </>
                        )}
                    </Button>
                </form>
            </motion.div>
        </Card>
    );
}
