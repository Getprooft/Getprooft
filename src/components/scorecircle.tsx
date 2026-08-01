import { useEffect, useState } from "react";

export default function ScoreCircle({ score = 82 }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let start = 0;
    const interval = setInterval(() => {
      start += 1;
      if (start >= score) {
        start = score;
        clearInterval(interval);
      }
      setProgress(start);
    }, 15);
  }, [score]);

  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex items-center gap-6">

      <svg width="120" height="120">
        <circle cx="60" cy="60" r={radius} stroke="#e5e7eb" strokeWidth="10" fill="none" />

        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke="url(#grad)"
          strokeWidth="10"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
        />

        <defs>
          <linearGradient id="grad">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
      </svg>

      <div>
        <p className="text-4xl font-bold text-gray-800">{progress}</p>
        <p className="text-green-500 text-sm">Excellent</p>
      </div>

    </div>
  );
}
