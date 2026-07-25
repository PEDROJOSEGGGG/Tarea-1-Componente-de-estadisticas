import React from "react";

interface StatsBadgeProps {
  label: string;
  value: number;
  color?: string;
}

const StatsBadge: React.FC<StatsBadgeProps> = ({ label, value, color }) => {
  return (
    <div
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
    </div>
  );
};

export default StatsBadge;
