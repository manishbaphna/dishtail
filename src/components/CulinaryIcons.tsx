// Kitchen-themed custom icons for Culinary theme

export const ClockWithPlateIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 48 48" 
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Plate base */}
    <ellipse cx="24" cy="42" rx="20" ry="4" fill="hsl(40, 30%, 90%)" stroke="hsl(25, 40%, 50%)" />
    {/* Clock face */}
    <circle cx="24" cy="22" r="16" fill="hsl(45, 60%, 95%)" stroke="hsl(28, 95%, 55%)" strokeWidth="2.5"/>
    <circle cx="24" cy="22" r="2" fill="hsl(28, 95%, 55%)"/>
    {/* Clock hands */}
    <line x1="24" y1="22" x2="24" y2="12" stroke="hsl(0, 75%, 55%)" strokeWidth="2.5"/>
    <line x1="24" y1="22" x2="32" y2="22" stroke="hsl(142, 65%, 42%)" strokeWidth="2"/>
    {/* Hour markers */}
    <line x1="24" y1="8" x2="24" y2="10" stroke="hsl(28, 95%, 55%)" strokeWidth="2"/>
    <line x1="24" y1="34" x2="24" y2="36" stroke="hsl(28, 95%, 55%)" strokeWidth="2"/>
    <line x1="10" y1="22" x2="12" y2="22" stroke="hsl(28, 95%, 55%)" strokeWidth="2"/>
    <line x1="36" y1="22" x2="38" y2="22" stroke="hsl(28, 95%, 55%)" strokeWidth="2"/>
    {/* Fork left */}
    <g transform="translate(-8, 10) rotate(-15, 12, 30)">
      <line x1="8" y1="16" x2="8" y2="40" stroke="hsl(142, 65%, 42%)" strokeWidth="2"/>
      <line x1="8" y1="16" x2="4" y2="10" stroke="hsl(142, 65%, 42%)" strokeWidth="1.5"/>
      <line x1="8" y1="16" x2="8" y2="10" stroke="hsl(142, 65%, 42%)" strokeWidth="1.5"/>
      <line x1="8" y1="16" x2="12" y2="10" stroke="hsl(142, 65%, 42%)" strokeWidth="1.5"/>
    </g>
    {/* Knife right */}
    <g transform="translate(28, 10) rotate(15, 12, 30)">
      <path d="M16 16 L16 40" stroke="hsl(0, 75%, 55%)" strokeWidth="2"/>
      <path d="M16 10 L16 16 L20 16 L16 10" fill="hsl(0, 75%, 55%)" stroke="hsl(0, 75%, 55%)" strokeWidth="1"/>
    </g>
  </svg>
);

export const WeighScaleIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 48 48" 
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Scale base */}
    <path d="M8 40 L40 40 L36 36 L12 36 Z" fill="hsl(142, 65%, 42%)" stroke="hsl(142, 65%, 32%)"/>
    {/* Scale pillar */}
    <rect x="22" y="20" width="4" height="16" fill="hsl(40, 30%, 85%)" stroke="hsl(25, 40%, 50%)"/>
    {/* Scale top bar */}
    <rect x="6" y="16" width="36" height="4" rx="2" fill="hsl(28, 95%, 55%)" stroke="hsl(28, 95%, 45%)"/>
    {/* Left bowl */}
    <path d="M6 16 L6 10 Q14 6 22 10 L22 16" fill="hsl(45, 60%, 92%)" stroke="hsl(28, 95%, 55%)" strokeWidth="1.5"/>
    {/* Right bowl */}
    <path d="M26 16 L26 10 Q34 6 42 10 L42 16" fill="hsl(45, 60%, 92%)" stroke="hsl(28, 95%, 55%)" strokeWidth="1.5"/>
    {/* Veggies in left bowl */}
    <circle cx="10" cy="10" r="2" fill="hsl(0, 75%, 55%)"/>
    <circle cx="14" cy="9" r="2.5" fill="hsl(142, 65%, 42%)"/>
    <circle cx="18" cy="10" r="2" fill="hsl(28, 95%, 55%)"/>
    {/* Weight indicator */}
    <circle cx="24" cy="28" r="3" fill="hsl(0, 75%, 55%)" stroke="none"/>
  </svg>
);

export const MagicJarIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 48 48" 
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Magic dust sparkles */}
    <g className="animate-pulse">
      <circle cx="8" cy="8" r="1.5" fill="hsl(45, 90%, 55%)"/>
      <circle cx="40" cy="12" r="2" fill="hsl(28, 95%, 55%)"/>
      <circle cx="12" cy="16" r="1" fill="hsl(0, 75%, 55%)"/>
      <circle cx="36" cy="6" r="1.5" fill="hsl(142, 65%, 42%)"/>
      <circle cx="6" cy="24" r="1" fill="hsl(45, 90%, 55%)"/>
      <circle cx="42" cy="28" r="1.5" fill="hsl(28, 95%, 55%)"/>
    </g>
    {/* Jar lid */}
    <rect x="14" y="8" width="20" height="6" rx="1" fill="hsl(28, 95%, 55%)" stroke="hsl(28, 95%, 45%)"/>
    {/* Jar body */}
    <path d="M12 14 L12 38 Q12 42 18 42 L30 42 Q36 42 36 38 L36 14 Z" fill="hsl(45, 60%, 95%)" stroke="hsl(142, 65%, 42%)" strokeWidth="2"/>
    {/* Jar contents - colorful layers */}
    <path d="M14 38 Q14 40 18 40 L30 40 Q34 40 34 38 L34 36 L14 36 Z" fill="hsl(142, 65%, 42%)"/>
    <rect x="14" y="30" width="20" height="6" fill="hsl(28, 95%, 55%)"/>
    <rect x="14" y="24" width="20" height="6" fill="hsl(0, 75%, 55%)"/>
    {/* Decorative stars */}
    <path d="M18 20 L19 22 L21 22 L19.5 23.5 L20 26 L18 24.5 L16 26 L16.5 23.5 L15 22 L17 22 Z" fill="hsl(45, 90%, 55%)"/>
    <path d="M28 18 L29 20 L31 20 L29.5 21.5 L30 24 L28 22.5 L26 24 L26.5 21.5 L25 20 L27 20 Z" fill="hsl(45, 90%, 55%)"/>
  </svg>
);

// Spark effect component for click interactions
export const SparkEffect = ({ x, y }: { x: number; y: number }) => (
  <div
    className="spark-effect"
    style={{ left: x - 10, top: y - 10 }}
  >
    <svg width="20" height="20" viewBox="0 0 20 20">
      <circle cx="10" cy="10" r="2" fill="hsl(45, 90%, 55%)"/>
      <circle cx="5" cy="5" r="1.5" fill="hsl(28, 95%, 55%)"/>
      <circle cx="15" cy="5" r="1.5" fill="hsl(0, 75%, 55%)"/>
      <circle cx="5" cy="15" r="1.5" fill="hsl(142, 65%, 42%)"/>
      <circle cx="15" cy="15" r="1.5" fill="hsl(28, 95%, 55%)"/>
    </svg>
  </div>
);
