"use client";

import { useState } from "react";
import { splitwiseApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Shield, Loader2, Check } from "lucide-react";

interface SpendingRulesProps {
    eventId: number;
}

export function SpendingRules({ eventId }: SpendingRulesProps) {
    const [maxAmount, setMaxAmount] = useState("");
    const [adminOnly, setAdminOnly] = useState(false);
    const [approvalRequired, setApprovalRequired] = useState(false);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleCreateRule = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setCreating(true);

        try {
            await splitwiseApi.createSpendingRule(
                eventId,
                parseFloat(maxAmount),
                adminOnly,
                approvalRequired
            );
            setSuccess("Spending rule created successfully!");
            setMaxAmount("");
            setAdminOnly(false);
            setApprovalRequired(false);
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to create rule");
        } finally {
            setCreating(false);
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
                    <Shield className="w-5 h-5 mr-2 text-amber-400" />
                    Spending Rules
                </h3>

                <form onSubmit={handleCreateRule} className="space-y-4">
                    {/* Max Amount */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Maximum Amount (₹)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            value={maxAmount}
                            onChange={(e) => setMaxAmount(e.target.value)}
                            placeholder="e.g., 500"
                            required
                            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                        <p className="text-gray-500 text-xs mt-1">
                            Expenses above this amount will be restricted
                        </p>
                    </div>

                    {/* Admin Only Checkbox */}
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                        <input
                            type="checkbox"
                            id="adminOnly"
                            checked={adminOnly}
                            onChange={(e) => setAdminOnly(e.target.checked)}
                            className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 text-amber-500 focus:ring-amber-500"
                        />
                        <div className="flex-1">
                            <label htmlFor="adminOnly" className="text-sm font-medium text-white cursor-pointer">
                                Admin-Only Spending
                            </label>
                            <p className="text-gray-400 text-xs mt-1">
                                Only admin can create expenses
                            </p>
                        </div>
                    </div>

                    {/* Approval Required Checkbox */}
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                        <input
                            type="checkbox"
                            id="approvalRequired"
                            checked={approvalRequired}
                            onChange={(e) => setApprovalRequired(e.target.checked)}
                            className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 text-amber-500 focus:ring-amber-500"
                        />
                        <div className="flex-1">
                            <label htmlFor="approvalRequired" className="text-sm font-medium text-white cursor-pointer">
                                Require Group Approval
                            </label>
                            <p className="text-gray-400 text-xs mt-1">
                                Expenses above max amount need 50% votes
                            </p>
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

                    {success && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center gap-2"
                        >
                            <Check className="w-4 h-4 text-green-400" />
                            <p className="text-green-400 text-sm">{success}</p>
                        </motion.div>
                    )}

                    <Button
                        type="submit"
                        disabled={creating}
                        className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                    >
                        {creating ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <>
                                <Shield className="w-4 h-4 mr-2" />
                                Create Rule
                            </>
                        )}
                    </Button>

                    {/* Info Box */}
                    <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                        <p className="text-amber-300 text-xs font-medium mb-2">
                            📋 Rule Examples:
                        </p>
                        <ul className="text-amber-300 text-xs space-y-1 ml-4">
                            <li>• <strong>Admin-only</strong>: Only admin can spend</li>
                            <li>• <strong>Max ₹500</strong>: Block expenses above ₹500</li>
                            <li>• <strong>Max ₹500 + Approval</strong>: Expenses &gt; ₹500 need 50% votes</li>
                        </ul>
                    </div>
                </form>
            </motion.div>
        </Card>
    );
}
