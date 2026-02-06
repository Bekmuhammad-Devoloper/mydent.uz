import { ReactNode } from 'react';

interface PanelCardProps {
  title: string;
  icon: ReactNode;
  description: string;
  onClick?: () => void;
  className?: string;
}

export default function PanelCard({ title, icon, description, onClick, className = '' }: PanelCardProps) {
  return (
    <div
      onClick={onClick}
      className={`card hover:shadow-lg transition-all duration-200 cursor-pointer ${className}`}
    >
      <div className="text-center">
        <div className="flex justify-center mb-3">{icon}</div>
        <h3 className="text-lg font-bold text-gray-800 mb-1">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
}
