"use client";

interface DashboardCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  buttonLabel?: string;
  onClick?: () => void;
}

export default function DashboardCard({
  title,
  value,
  icon,
  buttonLabel,
  onClick,
}: DashboardCardProps) {
  return (
    <div
      className="
        bg-white shadow-lg p-6 rounded-xl border border-gray-200
        hover:shadow-xl transition-all cursor-pointer
      "
      onClick={onClick}
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-gray-700 text-md font-semibold">{title}</h3>
        {icon && <span className="text-indigo-500 text-2xl">{icon}</span>}
      </div>

      <p className="text-4xl font-extrabold text-indigo-600">{value}</p>

      {buttonLabel && (
        <button
          className="
            mt-4 text-indigo-600 font-semibold text-sm
            hover:underline cursor-pointer
          "
          onClick={(e) => {
            e.stopPropagation();
            onClick && onClick();
          }}
        >
          {buttonLabel}
        </button>
      )}
    </div>
  );
}
