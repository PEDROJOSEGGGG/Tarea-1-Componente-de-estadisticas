import React from "react";

interface StatsBadgeProps {
  label: string;
  value: number;
  color?: string;
}

const StatsBadge: React.FC<StatsBadgeProps> = ({ label, value, color }) => {
  return (
    <div
<<<<<<< Updated upstream
      style={{
        flex: 1,
        padding: "12px",
        border: `2px solid ${color || "#1e293b"}`,
        color: color || "#1e293b",
        borderRadius: "8px",
      }}
    >
      <strong>{value}</strong>
      <div>{label}</div>
=======
      className={`flex flex-col items-center px-5 py-4 rounded-lg
                 bg-white border min-w-[120px] w-full sm:w-auto
                 shadow-sm transition-all duration-300 ease-in-out
                 hover:-translate-y-1 hover:shadow-lg hover:border-slate-300 ${style.border}`}
    >
      <span className={`text-2xl font-bold ${style.text}`}>{value}</span>
      <span className="text-sm text-slate-500 text-center">{label}</span>
>>>>>>> Stashed changes
    </div>
  );
};

export default StatsBadge;
