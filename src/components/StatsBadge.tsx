// src/components/StatsBadge.tsx
import React from 'react';

interface StatsBadgeProps {
  label: string;
  value: number;
  color?: string;
}

const StatsBadge: React.FC<StatsBadgeProps> = ({ label, value, color }) => {
  return (
    <div
      style={{
        border: `2px solid ${color ?? '#e2e8f0'}`,
        borderRadius: '8px',
        padding: '16px',
        minWidth: '180px',
        textAlign: 'center',
        backgroundColor: '#fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      }}
    >
      <div style={{ fontSize: '24px', fontWeight: 'bold', color: color ?? '#1e293b' }}>
        {value}
      </div>
      <div style={{ fontSize: '16px', color: '#64748b', marginTop: '4px' }}>
        {label}
      </div>
    </div>
  );
};

export default StatsBadge;
