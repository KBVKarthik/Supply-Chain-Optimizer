import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  color?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  icon,
  color = 'blue',
}) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    red: 'from-red-500 to-red-600',
    yellow: 'from-yellow-500 to-yellow-600',
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} rounded-lg shadow-lg p-6 text-white metric-card`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-100 text-sm font-medium">{title}</p>
          <h3 className="text-3xl font-bold mt-2">{value}</h3>
          {change !== undefined && (
            <p className={`text-sm mt-2 ${change >= 0 ? 'text-green-200' : 'text-red-200'}`}>
              {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
            </p>
          )}
        </div>
        {icon && <div className="text-4xl opacity-20">{icon}</div>}
      </div>
    </div>
  );
};

interface ChartContainerProps {
  title: string;
  children: React.ReactNode;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({ title, children }) => (
  <div className="bg-white rounded-lg shadow-lg p-6 metric-card">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
    <div className="chart-container">{children}</div>
  </div>
);

interface TableProps {
  headers: string[];
  rows: (string | number)[][];
  striped?: boolean;
}

export const Table: React.FC<TableProps> = ({ headers, rows, striped = true }) => (
  <div className="overflow-x-auto rounded-lg shadow-md">
    <table className="min-w-full bg-white">
      <thead className="bg-gray-100 border-b-2 border-gray-200">
        <tr>
          {headers.map((header, index) => (
            <th
              key={index}
              className="px-6 py-3 text-left text-sm font-semibold text-gray-700"
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr
            key={rowIndex}
            className={`border-b border-gray-200 ${
              striped && rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'
            } hover:bg-gray-100 transition-colors`}
          >
            {row.map((cell, cellIndex) => (
              <td key={cellIndex} className="px-6 py-3 text-sm text-gray-700">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

interface BadgeProps {
  label: string;
  color?: 'green' | 'red' | 'yellow' | 'blue';
  size?: 'sm' | 'md' | 'lg';
}

export const Badge: React.FC<BadgeProps> = ({ label, color = 'blue', size = 'md' }) => {
  const colorClasses = {
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    blue: 'bg-blue-100 text-blue-800',
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <span
      className={`inline-block rounded-full font-semibold ${colorClasses[color]} ${sizeClasses[size]}`}
    >
      {label}
    </span>
  );
};

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  ...props
}) => {
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white',
  };

  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`rounded-lg font-semibold transition-colors ${variantClasses[variant]} ${sizeClasses[size]} ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  );
};

interface ProgressBarProps {
  percentage: number;
  color?: 'blue' | 'green' | 'red' | 'yellow';
  label?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  color = 'blue',
  label,
}) => {
  const colorClasses = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    red: 'bg-red-600',
    yellow: 'bg-yellow-600',
  };

  return (
    <div className="mb-4">
      {label && <p className="text-sm font-medium text-gray-700 mb-2">{label}</p>}
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className={`h-3 rounded-full transition-all duration-300 ${
            colorClasses[color]
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>
      <p className="text-xs text-gray-600 mt-1">{percentage.toFixed(1)}%</p>
    </div>
  );
};
