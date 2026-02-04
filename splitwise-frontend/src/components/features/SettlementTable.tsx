"use client";

import { useState, useEffect } from "react";
import { splitwiseApi } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Table, Loader2 } from "lucide-react";

interface SettlementTableProps {
    eventId: number;
}

export function SettlementTable({ eventId }: SettlementTableProps) {
    const [settlement, setSettlement] = useState<Array<{ user_id: number; net_balance: number }>>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchSettlement = async () => {
            try {
                const data = await splitwiseApi.getSettlement(eventId);
                setSettlement(data.settlement);
            } catch (err: any) {
                setError(err.response?.data?.error || "Failed to fetch settlement");
            } finally {
                setLoading(false);
            }
        };
        fetchSettlement();
    }, [eventId]);

    return (
        <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <Table className="w-5 h-5 mr-2 text-orange-400" />
                    Settlement Table
                </h3>

                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
                    </div>
                ) : error ? (
                    <p className="text-red-400 text-sm">{error}</p>
                ) : settlement.length === 0 ? (
                    <p className="text-gray-500 text-sm">No participants yet</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left py-3 px-4 text-gray-400 text-sm font-medium">User ID</th>
                                    <th className="text-right py-3 px-4 text-gray-400 text-sm font-medium">Net Balance</th>
                                    <th className="text-right py-3 px-4 text-gray-400 text-sm font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {settlement.map((item) => (
                                    <tr key={item.user_id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="py-3 px-4 text-white">User #{item.user_id}</td>
                                        <td className={`py-3 px-4 text-right font-medium ${item.net_balance < 0 ? 'text-red-400' :
                                                item.net_balance > 0 ? 'text-green-400' :
                                                    'text-gray-400'
                                            }`}>
                                            ₹{Math.abs(item.net_balance).toLocaleString()}
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <span className={`px-2 py-1 rounded-full text-xs ${item.net_balance < 0 ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                                    item.net_balance > 0 ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                                        'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                                                }`}>
                                                {item.net_balance < 0 ? 'Owes' : item.net_balance > 0 ? 'Owed' : 'Settled'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <p className="text-gray-500 text-xs mt-4">
                            Equal split: Each participant owes their share of total expenses
                        </p>
                    </div>
                )}
            </motion.div>
        </Card>
    );
}
