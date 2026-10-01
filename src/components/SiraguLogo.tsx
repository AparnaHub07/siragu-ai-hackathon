import React from 'react';

interface SiraguLogoProps {
  className?: string;
  size?: number | string;
  animate?: boolean;
}

export const SiraguLogo: React.FC<SiraguLogoProps> = ({
  className = '',
  size = 48,
  animate = false,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-transform duration-300 ${animate ? 'animate-pulse hover:scale-105' : 'hover:scale-105'} ${className}`}
      aria-label="Siragu AI Butterfly Logo"
    >
      <defs>
        {/* Smooth violet to purple to pink gradient matching the brand specification */}
        <linearGradient id="siraguGradient" x1="10%" y1="10%" x2="90%" y2="90%">
          <stop offset="0%" stopColor="#6D28D9" />
          <stop offset="52%" stopColor="#9333EA" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>

        {/* Soft subtle glow filter */}
        <filter id="siraguGlow" x="-10%" y="-10%" width="120%" height="120%" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#6D28D9" floodOpacity="0.25" />
        </filter>
      </defs>

      <g filter="url(#siraguGlow)">
        {/* Upper Left Wing - elegant, rounded abstract geometry */}
        <path
          d="M 47.5 45 C 44 38, 30 18, 20 18 C 12 18, 11 26, 17 38 C 23 50, 38 52, 45 47.5 Z"
          fill="url(#siraguGradient)"
        />

        {/* Upper Right Wing - symmetrical */}
        <path
          d="M 52.5 45 C 56 38, 70 18, 80 18 C 88 18, 89 26, 83 38 C 77 50, 62 52, 55 47.5 Z"
          fill="url(#siraguGradient)"
        />

        {/* Lower Left Wing - sleek teardrop lower wing */}
        <path
          d="M 46.5 53 C 41 57, 26 66, 23 76 C 20.5 83, 27 86, 35 81 C 44 75, 47 62, 48 54.5 Z"
          fill="url(#siraguGradient)"
        />

        {/* Lower Right Wing - symmetrical */}
        <path
          d="M 53.5 53 C 59 57, 74 66, 77 76 C 79.5 83, 73 86, 65 81 C 56 75, 53 62, 52 54.5 Z"
          fill="url(#siraguGradient)"
        />

        {/* Small subtle central diamond core giving exact butterfly geometry */}
        <path
          d="M 50 47.2 L 52.8 50 L 50 52.8 L 47.2 50 Z"
          fill="#FFFFFF"
          opacity="0.95"
        />
      </g>
    </svg>
  );
};
