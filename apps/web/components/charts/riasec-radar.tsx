"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { RIASEC_META } from "@efektif/shared/psychometric";
import type { Locale } from "@efektif/shared/constants";

interface RiasecRadarProps {
  scores: Record<string, number>;
  locale?: Locale;
  size?: number;
  showTooltip?: boolean;
  fillOpacity?: number;
}

const DIMENSIONS = ["R", "I", "A", "S", "E", "C"] as const;

export function RiasecRadar({
  scores,
  locale = "fr",
  size = 320,
  showTooltip = true,
  fillOpacity = 0.35,
}: RiasecRadarProps) {
  const data = DIMENSIONS.map((dim) => ({
    dimension: dim,
    label: RIASEC_META[dim].labels[locale],
    score: scores[dim] ?? 0,
    fullMark: 100,
  }));

  return (
    <ResponsiveContainer width="100%" height={size}>
      <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
        <PolarGrid
          gridType="polygon"
          stroke="#e5e7eb"
          strokeDasharray="3 3"
        />
        <PolarAngleAxis
          dataKey="label"
          tick={{
            fill: "#6b7280",
            fontSize: 13,
            fontWeight: 600,
          }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 100]}
          tick={{ fontSize: 10, fill: "#9ca3af" }}
          tickCount={5}
          axisLine={false}
        />
        <Radar
          name="RIASEC"
          dataKey="score"
          stroke="#3b82f6"
          fill="#3b82f6"
          fillOpacity={fillOpacity}
          strokeWidth={2}
          dot={{
            r: 5,
            fill: "#3b82f6",
            stroke: "#fff",
            strokeWidth: 2,
          }}
          activeDot={{
            r: 7,
            fill: "#2563eb",
            stroke: "#fff",
            strokeWidth: 2,
          }}
        />
        {showTooltip && (
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const item = payload[0]?.payload as {
                dimension: string;
                label: string;
                score: number;
              };
              if (!item) return null;

              const dim = item.dimension as keyof typeof RIASEC_META;
              const color = RIASEC_META[dim]?.color ?? "#3b82f6";

              return (
                <div className="rounded-lg border bg-white px-3 py-2 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                  <p className="text-sm font-semibold" style={{ color }}>
                    {item.label}
                  </p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {item.score}
                    <span className="text-sm font-normal text-gray-400">/100</span>
                  </p>
                </div>
              );
            }}
          />
        )}
      </RadarChart>
    </ResponsiveContainer>
  );
}
