import { useState, useEffect } from "react";
import { splitwiseApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Users } from "lucide-react";

interface ParticipantManagerProps {
    eventId: string;
}

export function ParticipantManager({ eventId }: ParticipantManagerProps) {
    const [userId, setUserId] = useState("");
    const [participants, setParticipants] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchParticipants = async () => {
            try {
                const data = await splitwiseApi.getParticipants(eventId);
                setParticipants(data);
            } catch (error) {
                console.error("Failed to fetch participants", error);
            }
        };
        fetchParticipants();
    }, [eventId]);

    const handleAdd = async () => {
        if (!userId) return;
        setLoading(true);
        try {
            await splitwiseApi.addParticipant(eventId, Number(userId));
            setParticipants((prev) => [...prev, Number(userId)]);
            setUserId("");
        } catch (error) {
            console.error("Failed to add participant", error);
            alert("Failed to add participant.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="glass-panel h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-indigo-400" />
                    Participants
                </CardTitle>
                <CardDescription>Add friends to the group.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex gap-2">
                    <Input
                        type="number"
                        placeholder="User ID"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                    />
                    <Button onClick={handleAdd} isLoading={loading} variant="secondary" className="px-6 flex shrink-0">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Add
                    </Button>
                </div>

                <div className="mt-4">
                    <p className="text-sm font-medium text-gray-400 mb-2">Current Members</p>
                    <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto">
                        <AnimatePresence>
                            {participants.map((p, i) => (
                                <motion.div
                                    key={`${p}-${i}`}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="bg-white/10 rounded-md p-2 text-center text-sm font-medium border border-white/5"
                                >
                                    User #{p}
                                </motion.div>
                            ))}
                            {participants.length === 0 && (
                                <p className="col-span-2 text-center text-xs text-gray-500 py-4">No participants added yet.</p>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
