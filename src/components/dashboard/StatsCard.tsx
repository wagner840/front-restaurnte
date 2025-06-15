import React from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1 truncate">
            {title}
          </p>
          <p className="text-xl md:text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color} ml-4 flex-shrink-0`}>
          <Icon size={22} className="text-white" />
        </div>
      </div>
    </div>
  );
};
