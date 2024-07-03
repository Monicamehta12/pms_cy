// src/app/components/cards.tsx
import React from 'react';

interface DashboardCardsProps {
    title: string;
    count: number;
}

const getCardBgColor = (title: string): string => {
    switch (title.toLowerCase()) {
      case 'complete projects':
        return 'bg-green-400';
      case 'not complete projects':
        return 'bg-red-400';
      case 'ongoing projects':
        return 'bg-sky-400';
      case 'on hold projects':
        return 'bg-yellow-400';
      default:
        return 'bg-gray-300'; // default color if status is unknown
    }
  };

export default function DashboardCards({ 
    title, 
    count 
}: DashboardCardsProps){
    return (
        <div className={`px-4 py-5 rounded shadow-lg ${getCardBgColor(title)}`}>
            <h3 className="text-xl font-bold mb-3">{title}</h3>
            <p className="text-3xl">{count}</p>
        </div>
    );
};


