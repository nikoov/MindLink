// Simple bar-chart stub showing sentiment trend
import { TrendingUp } from "lucide-react";
import { useMemo } from "react";

interface EmotionalProgressProps {
  emotionalProgress: number[];
}

const EmotionalProgress: React.FC<EmotionalProgressProps> = ({ emotionalProgress }) => {
  const latest = useMemo(() => 
    emotionalProgress.length > 0 ? emotionalProgress[emotionalProgress.length - 1] : 0, 
    [emotionalProgress]
  );
  
  const getBarColor = (value: number): string => {
    if (value > 0.2) return "#10B981"; // Positive - green
    if (value < -0.2) return "#EF4444"; // Negative - red
    return "#F59E0B"; // Neutral - yellow
  };

  const getBarHeight = (value: number): string => {
    // Normalize height between 10% and 90%
    const normalizedHeight = 50 + (value * 30);
    return `${Math.max(10, Math.min(90, normalizedHeight))}%`;
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-slate-800 flex items-center">
        <TrendingUp className="w-5 h-5 mr-2" /> Emotional Progress
      </h3>

      <div className="h-24 bg-slate-100 rounded-lg p-2 flex items-end gap-0.5">
        {emotionalProgress.map((val, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm transition-all duration-300"
            style={{
              height: getBarHeight(val),
              backgroundColor: getBarColor(val),
            }}
            title={`Sentiment: ${(val * 100).toFixed(0)}%`}
          />
        ))}
      </div>

      <p className="text-xs text-center text-slate-500">
        Current sentiment: {(latest * 100).toFixed(0)}%
      </p>
    </div>
  );
};

export default EmotionalProgress;
