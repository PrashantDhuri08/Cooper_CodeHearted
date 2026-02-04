"use client";

import { useState, useEffect } from "react";
import { splitwiseApi } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { PieChart as PieChartIcon, Loader2 } from "lucide-react";

interface ExpenseChartProps {
    eventId: number;
}

export function ExpenseChart({ eventId }: ExpenseChartProps) {
    const [chartData, setChartData] = useState<Array<{ category: string; amount: number }>>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchChart = async () => {
            try {
                const data = await splitwiseApi.getExpenseChart(eventId);
                setChartData(data.by_category);
            } catch (err: any) {
                setError(err.response?.data?.error || "Failed to fetch expense chart");
            } finally {
                setLoading(false);
            }
        };
        fetchChart();
    }, [eventId]);

    const total = chartData.reduce((sum, item) => sum + item.amount, 0);
    const colors = [
        "bg-indigo-500",
        "bg-purple-500",
        "bg-pink-500",
        "bg-blue-500",
        "bg-cyan-500",
        "bg-green-500",
    ];

    return (
        <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <PieChartIcon className="w-5 h-5 mr-2 text-cyan-400" />
                    Expense Chart
                </h3>

                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
                    </div>
                ) : error ? (
                    <p className="text-red-400 text-sm">{error}</p>
                ) : chartData.length === 0 ? (
                    <p className="text-gray-500 text-sm">No expenses yet</p>
                ) : (
                    <div className="space-y-4">
                        {/* Total */}
                        <div className="text-center p-4 rounded-lg bg-white/5 border border-white/10">
                            <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Total</p>
                            <p className="text-3xl font-bold text-white">₹{total.toLocaleString()}</p>
                        </div>

                        {/* Category Breakdown */}
                        <div className="space-y-2">
                            {chartData.map((item, index) => {
                                const percentage = ((item.amount / total) * 100).toFixed(1);
                                return (
                                    <div key={item.category} className="space-y-1">
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`} />
                                                <span className="text-gray-300">{item.category}</span>
                                            </div>
                                            <span className="text-white font-medium">₹{item.amount.toLocaleString()}</span>
                                        </div>
                                        <div className="w-full bg-white/5 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full ${colors[index % colors.length]}`}
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 text-right">{percentage}%</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </motion.div>
        </Card>
    );
}
