import type { Handle } from "remix/component";

import type { Part } from "../../../data/public/catalog.ts";

export function PartImage(handle: Handle<{ part: Part }>) {
  return () => {
    let { part } = handle.props;
    let prefix = `part-${handle.id}`;
    return (
      <svg
        viewBox="0 0 160 112"
        role="img"
        aria-label={`${part.name} product view`}
      >
        <defs>
          <linearGradient id={`${prefix}-metal`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f5f7f8" />
            <stop offset="0.42" stopColor="#8c959a" />
            <stop offset="1" stopColor="#31373a" />
          </linearGradient>
          <linearGradient id={`${prefix}-dark`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#4a5053" />
            <stop offset="1" stopColor="#111416" />
          </linearGradient>
          <filter
            id={`${prefix}-shadow`}
            x="-20%"
            y="-20%"
            width="140%"
            height="160%"
          >
            <feDropShadow dx="0" dy="5" stdDeviation="4" floodOpacity="0.28" />
          </filter>
        </defs>
        <ellipse cx="80" cy="96" rx="55" ry="8" fill="#1c1e20" opacity="0.18" />
        <g filter={`url(#${prefix}-shadow)`}>{renderPart(part, prefix)}</g>
      </svg>
    );
  };
}

function renderPart(part: Part, prefix: string) {
  if (part.category === "chassis") return ChassisImage({ part, prefix });
  if (part.category === "engine") return EngineImage({ part, prefix });
  if (part.category === "paint") return PaintImage({ part });
  if (part.category === "tires") return TireImage({ part, prefix });
  if (part.category === "spoiler") return SpoilerImage({ part, prefix });
  return HoodImage({ part, prefix });
}

function ChassisImage({ part, prefix }: { part: Part; prefix: string }) {
  let sprint = part.id === "chassis-sprint";
  return (
    <g transform={sprint ? "translate(13 2) scale(.84 1)" : undefined}>
      <path
        d="M18 74h18l13-25 19-12h45l16 13 15 8v16h-18c-3-14-24-14-27 0H62c-3-14-24-14-27 0H18Z"
        fill={`url(#${prefix}-metal)`}
        stroke="#24282a"
        strokeWidth="3"
      />
      <path
        d="m56 47 17-8h31l13 12H52Z"
        fill="#60737b"
        stroke="#24282a"
        strokeWidth="2"
      />
      <path
        d="M19 70h125M80 51v22"
        fill="none"
        stroke="#202426"
        strokeWidth="2"
      />
      <circle cx="49" cy="76" r="14" fill="#17191b" />
      <circle
        cx="49"
        cy="76"
        r="7"
        fill="#aeb4b7"
        stroke="#53595c"
        strokeWidth="3"
      />
      <circle cx="113" cy="76" r="14" fill="#17191b" />
      <circle
        cx="113"
        cy="76"
        r="7"
        fill="#aeb4b7"
        stroke="#53595c"
        strokeWidth="3"
      />
      {sprint && <path d="M66 38h31" stroke="#d4362c" strokeWidth="4" />}
    </g>
  );
}

function EngineImage({ part, prefix }: { part: Part; prefix: string }) {
  let v8 = part.id === "engine-v8";
  let v12 = part.id === "engine-v12";
  if (!v8 && !v12) {
    return (
      <g>
        <path
          d="M42 39h67v48H42Z"
          fill={`url(#${prefix}-dark)`}
          stroke="#171a1c"
          strokeWidth="3"
        />
        <path
          d="M50 29h51v19H50Z"
          fill={`url(#${prefix}-metal)`}
          stroke="#33383a"
          strokeWidth="2"
        />
        <circle
          cx="116"
          cy="53"
          r="17"
          fill="#6f7b80"
          stroke="#25292b"
          strokeWidth="5"
        />
        <circle cx="116" cy="53" r="6" fill="#1d2123" />
        {[56, 70, 84, 98].map((x) => (
          <rect
            key={x}
            x={x}
            y="33"
            width="8"
            height="10"
            rx="2"
            fill="#d7dadd"
          />
        ))}
      </g>
    );
  }
  return (
    <g transform={v12 ? "translate(-5 0) scale(1.08 1)" : undefined}>
      <path
        d="m37 38 32 16v33H33l-8-14Z"
        fill={`url(#${prefix}-dark)`}
        stroke="#181b1d"
        strokeWidth="3"
      />
      <path
        d="m123 38-32 16v33h36l8-14Z"
        fill={`url(#${prefix}-dark)`}
        stroke="#181b1d"
        strokeWidth="3"
      />
      <path
        d="M59 38h42v48H59Z"
        fill="#b52f28"
        stroke="#262a2c"
        strokeWidth="3"
      />
      <path
        d="M65 31h30v45H65Z"
        fill={`url(#${prefix}-metal)`}
        stroke="#363b3e"
        strokeWidth="2"
      />
      {[43, 56, 104, 117].map((x) => (
        <circle
          key={x}
          cx={x}
          cy="59"
          r="7"
          fill="#cbd0d2"
          stroke="#474d50"
          strokeWidth="3"
        />
      ))}
      {v12 && (
        <path
          d="M47 28h66l7 9H40Z"
          fill="#d34234"
          stroke="#24282a"
          strokeWidth="2"
        />
      )}
    </g>
  );
}

function PaintImage({ part }: { part: Part }) {
  return (
    <g>
      <path
        d="M45 35h71l-7 57H52Z"
        fill="#d9dcdd"
        stroke="#353a3d"
        strokeWidth="3"
      />
      <path
        d="M39 28h83v13H39Z"
        fill="#565d61"
        stroke="#292d2f"
        strokeWidth="3"
      />
      <path
        d="M53 47h55v36H53Z"
        fill={part.color}
        stroke="#fff"
        strokeWidth="3"
      />
      <path
        d="M61 51c16-7 31-6 40 0"
        fill="none"
        stroke="#fff"
        strokeWidth="5"
        opacity="0.55"
      />
      <path d="M69 28v-8h36" fill="none" stroke="#353a3d" strokeWidth="4" />
    </g>
  );
}

function TireImage({ part, prefix }: { part: Part; prefix: string }) {
  let rally = part.id === "tires-rally";
  let track = part.id === "tires-track";
  let size = rally ? 44 : 38;
  let center = 78;
  return (
    <g>
      <circle
        cx={center}
        cy="57"
        r={size}
        fill={`url(#${prefix}-dark)`}
        stroke="#101214"
        strokeWidth={rally ? 8 : 4}
        strokeDasharray={rally ? "9 5" : undefined}
      />
      <circle
        cx={center}
        cy="57"
        r={track ? 25 : 20}
        fill={`url(#${prefix}-metal)`}
        stroke="#3f4548"
        strokeWidth="4"
      />
      <circle cx={center} cy="57" r="7" fill="#272b2d" />
      {[0, 45, 90, 135].map((angle) => (
        <path
          key={angle}
          d="M78 37v13"
          stroke="#3b4144"
          strokeWidth="5"
          transform={`rotate(${angle} 78 57)`}
        />
      ))}
      {track && (
        <path
          d="M45 31c7-12 16-18 29-20"
          fill="none"
          stroke="#d9c04a"
          strokeWidth="3"
        />
      )}
    </g>
  );
}

function SpoilerImage({ part, prefix }: { part: Part; prefix: string }) {
  let wing = part.id === "spoiler-wing";
  return wing ? (
    <g>
      <path
        d="m27 31 103 4-12 15-94-4Z"
        fill={`url(#${prefix}-dark)`}
        stroke="#171a1c"
        strokeWidth="3"
      />
      <path d="M45 47v37M108 49v35" stroke="#24282a" strokeWidth="8" />
      <path
        d="M34 83h86"
        stroke="#50575a"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path d="M21 28v21M134 32v21" stroke="#b82f27" strokeWidth="4" />
    </g>
  ) : (
    <g>
      <path
        d="M28 68c33-3 67-14 102-34l-5 21c-34 18-66 27-94 28Z"
        fill={`url(#${prefix}-dark)`}
        stroke="#171a1c"
        strokeWidth="3"
      />
      <path
        d="M36 82h85"
        stroke="#4d5356"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path d="m40 68 8-8M109 49l7-9" stroke="#d2d6d8" strokeWidth="3" />
    </g>
  );
}

function HoodImage({ part, prefix }: { part: Part; prefix: string }) {
  let vented = part.id === "hood-vented";
  return (
    <g>
      <path
        d="m36 28 88 8 15 48-118-5Z"
        fill={`url(#${prefix}-metal)`}
        stroke="#262a2c"
        strokeWidth="3"
      />
      <path
        d="M47 35 31 72M113 41l15 34"
        fill="none"
        stroke="#f1f3f3"
        strokeWidth="2"
        opacity="0.72"
      />
      {vented ? (
        <g fill="#202426" stroke="#777f83" strokeWidth="2">
          <path d="m49 49 27 2-8 15-25-2Z" />
          <path d="m88 53 27 2 5 15-25-2Z" />
        </g>
      ) : (
        <path d="m80 38 2 38" stroke="#5e666a" strokeWidth="3" />
      )}
    </g>
  );
}
