import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner />
        <p className="mt-4 text-slate-600 font-medium">Loading...</p>
      </div>
    </div>
  );
}
