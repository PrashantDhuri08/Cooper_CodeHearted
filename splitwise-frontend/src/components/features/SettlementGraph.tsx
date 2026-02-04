"use client";

import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

export function SettlementGraph() {
    return (
        <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-pink-400" />
                    Settlement Overview
                </h3>
                <p className="text-gray-400 text-sm">
                    View detailed settlement breakdown in the table below
                </p>
                <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20">
                    <p className="text-pink-300 text-xs">
                        💡 Scroll down to see who owes what
                    </p>
                </div>
            </motion.div>
        </Card>
    );
}
