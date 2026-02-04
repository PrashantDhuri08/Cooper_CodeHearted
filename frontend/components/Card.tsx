import { ReactNode } from "react";

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export function Card({ title, children, className = "" }: CardProps) {
  return (
    <div className={`bg-white rounded-xl shadow-lg border border-slate-200 p-6 md:p-8 ${className}`}>
      {title && <h2 className="text-2xl font-bold mb-5 text-slate-800 border-b border-slate-200 pb-3">{title}</h2>}
      {children}
    </div>
  );
}
