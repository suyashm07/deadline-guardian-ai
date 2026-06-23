"use client";

/**
 * Ambient command-center background — decorative layers only.
 * Sits behind the dashboard; does not affect layout or readability.
 */
export function CommandBackground() {
  return (
    <div
      className="command-bg pointer-events-none fixed inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Base depth gradient */}
      <div className="command-bg-base absolute inset-0" />

      {/* Horizon celestial glow */}
      <div className="command-bg-horizon absolute inset-x-0 bottom-0 h-[55%]" />

      {/* Teal / gold ambient pools */}
      <div className="command-bg-pool-teal absolute -left-[10%] top-[8%] h-[45%] w-[50%] rounded-full" />
      <div className="command-bg-pool-gold absolute -right-[5%] top-[15%] h-[35%] w-[40%] rounded-full" />

      {/* Orbital rings + timeline curves */}
      <svg
        className="command-bg-rings absolute inset-0 h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <defs>
          <linearGradient id="ring-teal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(94,234,212,0)" />
            <stop offset="40%" stopColor="rgba(94,234,212,0.12)" />
            <stop offset="100%" stopColor="rgba(94,234,212,0)" />
          </linearGradient>
          <linearGradient id="ring-gold" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(212,175,55,0)" />
            <stop offset="50%" stopColor="rgba(212,175,55,0.1)" />
            <stop offset="100%" stopColor="rgba(212,175,55,0)" />
          </linearGradient>
          <linearGradient id="curve-flow" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="rgba(94,234,212,0)" />
            <stop offset="30%" stopColor="rgba(94,234,212,0.08)" />
            <stop offset="70%" stopColor="rgba(212,175,55,0.06)" />
            <stop offset="100%" stopColor="rgba(94,234,212,0)" />
          </linearGradient>
        </defs>

        {/* Orbital arcs — centered upper-right */}
        <g className="command-bg-orbit-group" style={{ transformOrigin: "78% 42%" }}>
          <ellipse cx="1120" cy="380" rx="420" ry="420" stroke="url(#ring-teal)" strokeWidth="0.75" opacity="0.5" />
          <ellipse cx="1120" cy="380" rx="340" ry="340" stroke="rgba(94,234,212,0.06)" strokeWidth="0.5" />
          <ellipse cx="1120" cy="380" rx="260" ry="260" stroke="url(#ring-gold)" strokeWidth="0.6" opacity="0.4" />
          <ellipse cx="1120" cy="380" rx="180" ry="180" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" strokeDasharray="4 8" />
        </g>

        {/* Secondary orbit — lower left */}
        <g className="command-bg-orbit-group-reverse" style={{ transformOrigin: "18% 72%" }}>
          <ellipse cx="260" cy="650" rx="300" ry="300" stroke="rgba(94,234,212,0.05)" strokeWidth="0.5" />
          <ellipse cx="260" cy="650" rx="220" ry="220" stroke="rgba(212,175,55,0.05)" strokeWidth="0.5" />
        </g>

        {/* Timeline flow curves */}
        <path
          d="M -40 520 Q 360 480, 720 500 T 1480 470"
          stroke="url(#curve-flow)"
          strokeWidth="1"
          className="command-bg-curve"
        />
        <path
          d="M -40 600 Q 400 560, 800 590 T 1480 555"
          stroke="rgba(94,234,212,0.04)"
          strokeWidth="0.75"
          className="command-bg-curve-slow"
        />
        <path
          d="M -40 680 Q 320 640, 680 670 T 1480 640"
          stroke="rgba(212,175,55,0.035)"
          strokeWidth="0.75"
          className="command-bg-curve"
        />

        {/* Precision grid ticks along curves */}
        {[200, 400, 600, 800, 1000, 1200].map((x) => (
          <line
            key={x}
            x1={x}
            y1={505}
            x2={x}
            y2={515}
            stroke="rgba(255,255,255,0.03)"
            strokeWidth="0.5"
          />
        ))}
      </svg>

      {/* Ambient particle field */}
      <div className="command-bg-particles absolute inset-0" />

      {/* Depth vignette — keeps dashboard readable */}
      <div className="command-bg-vignette absolute inset-0" />

      {/* Top fade for command bar clarity */}
      <div className="command-bg-top-fade absolute inset-x-0 top-0 h-32" />
    </div>
  );
}
