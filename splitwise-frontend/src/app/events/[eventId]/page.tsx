"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ParticipantManager } from "@/components/features/ParticipantManager";
import { ParticipantList } from "@/components/features/ParticipantList";
import { SharedPool } from "@/components/features/SharedPool";
import { ExpenseCategories } from "@/components/features/ExpenseCategories";
import { CreateExpense } from "@/components/features/CreateExpense";
import { SettlementTable } from "@/components/features/SettlementTable";
import { ExpenseChart } from "@/components/features/ExpenseChart";
import { SettlementGraph } from "@/components/features/SettlementGraph";
import { PaymentManager } from "@/components/features/PaymentManager";
import { VotingManager } from "@/components/features/VotingManager";
import { JoinCategory } from "@/components/features/JoinCategory";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function EventDashboard() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();

    const eventId = parseInt(params.eventId as string);
    const userId = parseInt(searchParams.get("userId") || "0");
    const adminId = parseInt(searchParams.get("adminId") || "0");

    // Redirect if missing required params
    useEffect(() => {
        if (!userId || !adminId) {
            router.push("/");
        }
    }, [userId, adminId, router]);

    if (!userId || !adminId) {
        return null;
    }

    return (
        <main className="min-h-screen p-4 sm:p-8 space-y-8 relative overflow-hidden bg-background selection:bg-indigo-500/30">
            {/* Background Ambience - Enhanced */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-20%] left-[20%] w-[60%] h-[60%] bg-purple-900/20 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-900/20 rounded-full blur-[100px] animate-pulse-slow delay-1000" />
                <div className="absolute top-[40%] left-[-10%] w-[30%] h-[30%] bg-pink-900/10 rounded-full blur-[80px] animate-pulse-slow delay-2000" />
            </div>

            <header className="max-w-7xl mx-auto mb-12 pt-8 relative z-10 flex flex-col md:flex-row justify-between items-center gap-4">
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center md:text-left"
                >
                    <Link href="/" className="inline-flex items-center text-indigo-400 hover:text-indigo-300 transition-colors mb-2 text-sm font-medium">
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
                    </Link>
                    <h1 className="text-5xl md:text-6xl font-bold font-heading tracking-tight mb-2">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-purple-200 animate-shimmer bg-[length:200%_100%]">
                            Event Dashboard
                        </span>
                    </h1>
                    <div className="flex items-center gap-2 justify-center md:justify-start text-gray-400 mt-2">
                        <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-mono text-indigo-300">
                            Event ID: {eventId}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-mono text-purple-300">
                            User ID: {userId}
                        </span>
                    </div>
                </motion.div>
            </header>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
                {/* Row 1: Participants & Payment Manager */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="col-span-1 md:col-span-1 lg:col-span-1 space-y-6"
                >
                    <ParticipantManager eventId={eventId} adminId={adminId} />
                    <ParticipantList eventId={eventId} />
                    <PaymentManager />
                </motion.div>

                {/* Row 1 Middle: Main Actions (Pool & Categories) */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="col-span-1 md:col-span-1 lg:col-span-1 space-y-6"
                >
                    <SharedPool eventId={eventId} userId={userId} />
                    <ExpenseCategories eventId={eventId} userId={userId} />
                </motion.div>

                {/* Row 1 Right: Visuals (Chart & Graph) */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="col-span-1 md:col-span-2 lg:col-span-1 space-y-6"
                >
                    <ExpenseChart eventId={eventId} />
                    <SettlementGraph />
                </motion.div>

                {/* Row 2: Voting & Join Category */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="col-span-1 md:col-span-1 lg:col-span-1 space-y-6"
                >
                    <VotingManager eventId={eventId} voterId={userId} />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="col-span-1 md:col-span-1 lg:col-span-1 space-y-6"
                >
                    <JoinCategory eventId={eventId} userId={userId} />
                </motion.div>

                {/* Row 2: Create Expense (Full Width Hero) */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="col-span-1 md:col-span-2 lg:col-span-3"
                >
                    <CreateExpense eventId={eventId} />
                </motion.div>

                {/* Row 3: Settlement Table */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="col-span-1 md:col-span-2 lg:col-span-3 pb-20"
                >
                    <SettlementTable eventId={eventId} />
                </motion.div>
            </div>
        </main>
    );
}
