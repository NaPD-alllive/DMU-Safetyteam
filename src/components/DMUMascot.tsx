import React from 'react';

interface DMUMascotProps {
  className?: string;
}

export default function DMUMascot({ className = "w-10 h-10 animate-[bounce_3s_ease-in-out_infinite]" }: DMUMascotProps) {
  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`} id="dmu-mascot-logo">
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        {/* Background Subtle Ambient Glow */}
        <circle cx="50" cy="55" r="38" fill="url(#blue-glow)" opacity="0.15" />

        {/* Mascot Body Group */}
        <g id="mascot-full-body">
          {/* Outstretched Arms */}
          <path
            d="M 18 63 C 12 60 11 67 17 68 C 22 69 28 66 31 63"
            fill="#5ECAFF"
            stroke="#4CA8D1"
            strokeWidth="0.8"
          />
          <path
            d="M 82 63 C 88 60 89 67 83 68 C 78 69 72 66 69 63"
            fill="#5ECAFF"
            stroke="#4CA8D1"
            strokeWidth="0.8"
          />

          {/* Pants/Legs */}
          <path
            d="M 33 76 L 35 90 C 35 92 48 92 48 88 L 48 76 Z"
            fill="#233D62"
          />
          <path
            d="M 67 76 L 65 90 C 65 92 52 92 52 88 L 52 76 Z"
            fill="#233D62"
          />

          {/* White T-Shirt */}
          <path
            d="M 32 60 L 68 60 L 67 77 C 67 81 33 81 33 77 Z"
            fill="#FFFFFF"
            stroke="#CDD6E2"
            strokeWidth="0.6"
          />
          {/* T-Shirt Sleeve Left */}
          <path
            d="M 32 60 L 26 67 C 25 68 29 70 31 68 L 34 65 Z"
            fill="#FFFFFF"
            stroke="#CDD6E2"
            strokeWidth="0.5"
          />
          {/* T-Shirt Sleeve Right */}
          <path
            d="M 68 60 L 74 67 C 75 68 71 70 69 68 L 66 65 Z"
            fill="#FFFFFF"
            stroke="#CDD6E2"
            strokeWidth="0.5"
          />

          {/* T-Shirt Mascot dmu logo */}
          <text
            x="50"
            y="73"
            fill="#0094FF"
            fontSize="7"
            fontWeight="900"
            fontFamily="'Inter', 'Space Grotesk', sans-serif"
            textAnchor="middle"
            letterSpacing="-0.2"
          >
            dmu
          </text>

          {/* Main Blue Blob Face (Head) */}
          <ellipse cx="50" cy="46" rx="35" ry="29" fill="#5ECAFF" stroke="#48BFF9" strokeWidth="0.5" />

          {/* Big Big Round Eyes */}
          {/* Left Eye */}
          <circle cx="34" cy="42" r="14" fill="#FFFFFF" />
          <circle cx="35" cy="42" r="5.5" fill="#111827" />
          <circle cx="33.5" cy="40.5" r="1.8" fill="#FFFFFF" /> {/* Eye Highlight */}

          {/* Right Eye */}
          <circle cx="66" cy="42" r="14" fill="#FFFFFF" />
          <circle cx="65" cy="42" r="5.5" fill="#111827" />
          <circle cx="63.5" cy="40.5" r="1.8" fill="#FFFFFF" /> {/* Eye Highlight */}

          {/* Pink Tongue Smiley Mouth */}
          <path
            d="M 38 52 Q 50 63 62 52 C 58 59 42 59 38 52 Z"
            fill="#FFA4B5"
            stroke="#E05B73"
            strokeWidth="0.8"
          />
          {/* Smile Corner rosy cheeks cheek */}
          <circle cx="21" cy="49" r="2.5" fill="#FF8BA4" opacity="0.4" />
          <circle cx="79" cy="49" r="2.5" fill="#FF8BA4" opacity="0.4" />

          {/* High-Fidelity Construction Safety White Helmet */}
          {/* Helmet Dome */}
          <path
            d="M 18 39 C 20 18 80 18 82 39 Z"
            fill="#FFFFFF"
            stroke="#CDD6E2"
            strokeWidth="0.8"
          />

          {/* Helmet Top Center Crest/Ridge */}
          <path
            d="M 46 22 C 48 10 52 10 54 22 Z"
            fill="#FFFFFF"
            stroke="#CDD6E2"
            strokeWidth="0.5"
          />
          {/* Dome shine/hilite */}
          <path
            d="M 24 35 C 28 24 45 22 46 22"
            stroke="#F1F5F9"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Helmet Brim */}
          <path
            d="M 14 39 C 14 36 86 36 86 39 C 86 42 14 42 14 39 Z"
            fill="#FFFFFF"
            stroke="#CBD5E1"
            strokeWidth="0.6"
          />

          {/* Dongyang Mirae University text branding curved on helmet front */}
          <text
            x="50"
            y="31"
            fill="#0582CA"
            fontSize="4.5"
            fontWeight="900"
            fontFamily="'Inter', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif"
            textAnchor="middle"
            letterSpacing="-0.2"
          >
            동양미래대학교
          </text>
        </g>

        {/* Glow Definition */}
        <defs>
          <radialGradient id="blue-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#5ECAFF" />
            <stop offset="100%" stopColor="#5ECAFF" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}
