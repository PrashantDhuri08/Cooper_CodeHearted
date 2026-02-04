"use client";

import { useState } from "react";
import { splitwiseApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Search, Loader2, CheckCircle, Clock, XCircle } from "lucide-react";

export function PaymentManager() {
    const [intentId, setIntentId] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [status, setStatus] = useState<{
        intent_id: string;
        status: string;
        settlement_status: string;
    } | null>(null);

    const handleCheckStatus = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setStatus(null);
        setLoading(true);

        try {
            const response = await splitwiseApi.getPaymentStatus(intentId);
            setStatus(response);
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to fetch payment status");
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (statusStr: string) => {
        if (statusStr === "COMPLETED") return <CheckCircle className="w-5 h-5 text-green-400" />;
        if (statusStr === "PROCESSING" || statusStr === "INITIATED") return <Clock className="w-5 h-5 text-yellow-400" />;
        return <XCircle className="w-5 h-5 text-red-400" />;
    };

    return (
        <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <Search className="w-5 h-5 mr-2 text-blue-400" />
                    Check Payment Status
                </h3>

                <form onSubmit={handleCheckStatus} className="space-y-4">
                    <div>
                        <Input
                            type="text"
                            value={intentId}
                            onChange={(e) => setIntentId(e.target.value)}
                            placeholder="intent_xxx"
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

                    {status && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-2"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-gray-400 text-sm">Status:</span>
                                <div className="flex items-center gap-2">
                                    {getStatusIcon(status.status)}
                                    <span className="text-white font-medium">{status.status}</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-400 text-sm">Settlement:</span>
                                <div className="flex items-center gap-2">
                                    {getStatusIcon(status.settlement_status)}
                                    <span className="text-white font-medium">{status.settlement_status}</span>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <>
                                <Search className="w-4 h-4 mr-2" />
                                Check Status
                            </>
                        )}
                    </Button>
                </form>
            </motion.div>
        </Card>
    );
}
