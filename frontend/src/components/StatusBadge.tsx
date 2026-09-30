import React from "react";

interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md" | "lg";
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = "md" }) => {
  const normalized = (status || "").toLowerCase();

  let styles = "bg-slate-100 text-slate-700 border-slate-200";
  let dotColor = "bg-slate-400";
  let label = status;

  switch (normalized) {
    case "confirmed":
      styles = "bg-emerald-50 text-emerald-800 border-emerald-300";
      dotColor = "bg-emerald-500";
      label = "Confirmed";
      break;
    case "pending":
      styles = "bg-amber-50 text-amber-800 border-amber-300";
      dotColor = "bg-amber-500 animate-pulse";
      label = "Pending Approval";
      break;
    case "in_progress":
      styles = "bg-blue-50 text-blue-800 border-blue-300";
      dotColor = "bg-blue-600 animate-pulse";
      label = "In Progress";
      break;
    case "rescheduled":
      styles = "bg-purple-50 text-purple-800 border-purple-300";
      dotColor = "bg-purple-500";
      label = "Rescheduled";
      break;
    case "completed":
      styles = "bg-teal-50 text-teal-800 border-teal-300";
      dotColor = "bg-teal-600";
      label = "Completed";
      break;
    case "cancelled":
      styles = "bg-rose-50 text-rose-800 border-rose-300";
      dotColor = "bg-rose-500";
      label = "Cancelled";
      break;
  }

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3.5 py-1.5 text-sm",
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${sizeClasses} ${styles} tracking-wide`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      <span>{label}</span>
    </span>
  );
};
