"use client";

import { cn } from "@/lib/utils";

interface LikertScaleProps {
  value: number | null;
  onChange: (value: number) => void;
  labels?: [string, string, string, string, string];
  disabled?: boolean;
}

const DEFAULT_LABELS: [string, string, string, string, string] = [
  "1",
  "2",
  "3",
  "4",
  "5",
];

const OPTION_COLORS = [
  "border-red-300 bg-red-50 hover:bg-red-100 data-[selected=true]:bg-red-500 data-[selected=true]:border-red-600 data-[selected=true]:text-white dark:border-red-700 dark:bg-red-900/20 dark:hover:bg-red-900/40 dark:data-[selected=true]:bg-red-600",
  "border-orange-300 bg-orange-50 hover:bg-orange-100 data-[selected=true]:bg-orange-500 data-[selected=true]:border-orange-600 data-[selected=true]:text-white dark:border-orange-700 dark:bg-orange-900/20 dark:hover:bg-orange-900/40 dark:data-[selected=true]:bg-orange-600",
  "border-yellow-300 bg-yellow-50 hover:bg-yellow-100 data-[selected=true]:bg-yellow-500 data-[selected=true]:border-yellow-600 data-[selected=true]:text-white dark:border-yellow-700 dark:bg-yellow-900/20 dark:hover:bg-yellow-900/40 dark:data-[selected=true]:bg-yellow-600",
  "border-lime-300 bg-lime-50 hover:bg-lime-100 data-[selected=true]:bg-lime-500 data-[selected=true]:border-lime-600 data-[selected=true]:text-white dark:border-lime-700 dark:bg-lime-900/20 dark:hover:bg-lime-900/40 dark:data-[selected=true]:bg-lime-600",
  "border-green-300 bg-green-50 hover:bg-green-100 data-[selected=true]:bg-green-500 data-[selected=true]:border-green-600 data-[selected=true]:text-white dark:border-green-700 dark:bg-green-900/20 dark:hover:bg-green-900/40 dark:data-[selected=true]:bg-green-600",
] as const;

export function LikertScale({
  value,
  onChange,
  labels = DEFAULT_LABELS,
  disabled = false,
}: LikertScaleProps) {
  return (
    <div className="flex items-center justify-center gap-3">
      {[1, 2, 3, 4, 5].map((option, i) => {
        const isSelected = value === option;

        return (
          <button
            key={option}
            type="button"
            disabled={disabled}
            data-selected={isSelected}
            onClick={() => onChange(option)}
            className={cn(
              "flex h-14 w-14 flex-col items-center justify-center rounded-xl border-2 text-sm font-semibold transition-all duration-200 sm:h-16 sm:w-16",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              isSelected && "scale-110 shadow-lg",
              OPTION_COLORS[i],
            )}
          >
            <span className="text-lg font-bold">{option}</span>
            {labels[i] !== String(option) && (
              <span className="mt-0.5 text-[10px] leading-tight opacity-80 sm:text-xs">
                {labels[i]}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
