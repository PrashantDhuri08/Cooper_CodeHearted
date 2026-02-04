"use client";

import { useState } from "react";
import { splitwiseApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { FolderPlus, Loader2 } from "lucide-react";

interface ExpenseCategoriesProps {
    eventId: number;
    userId: number;
}

export function ExpenseCategories({ eventId, userId }: ExpenseCategoriesProps) {
    const [categoryName, setCategoryName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleCreateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const response = await splitwiseApi.createCategory(eventId, categoryName);
            setSuccess(`Category created with ID: ${response.category_id}`);
            setCategoryName("");
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to create category");
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
                    <FolderPlus className="w-5 h-5 mr-2 text-purple-400" />
                    Create Category
                </h3>

                <form onSubmit={handleCreateCategory} className="space-y-4">
                    <div>
                        <Input
                            type="text"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            placeholder="Food, Transport, Accommodation..."
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
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <>
                                <FolderPlus className="w-4 h-4 mr-2" />
                                Create Category
                            </>
                        )}
                    </Button>
                </form>
            </motion.div>
        </Card>
    );
}
