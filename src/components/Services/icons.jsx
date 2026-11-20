// Zal jihozlari uchun chiziqli piktogrammalar. Rangi atrofdagi matn rangidan (currentColor) olinadi.
const Svg = ({ children }) => (
     <svg
          viewBox="0 0 64 64"
          width="64"
          height="64"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
     >
          {children}
     </svg>
)

export const DumbbellIcon = () => (
     <Svg>
          <path d="M16 32h32" />
          <path d="M16 21v22M9 25v14M48 21v22M55 25v14" />
     </Svg>
)

// Stoyka: ikki tayanch, ustida shtanga
export const RackIcon = () => (
     <Svg>
          <path d="M18 8v48M46 8v48" />
          <path d="M10 56h16M38 56h16" />
          <path d="M5 22h54" />
          <path d="M8 15v14M56 15v14" />
          <path d="M18 26h-5M46 26h5" />
     </Svg>
)

// Skameyka: o'rindiq, oyoqlari va tepasida shtanga
export const BenchIcon = () => (
     <Svg>
          <path d="M10 40h44" />
          <path d="M16 40v14M48 40v14" />
          <path d="M12 54h8M44 54h8" />
          <path d="M14 18h36" />
          <path d="M11 12v12M53 12v12" />
          <path d="M26 18v10M38 18v10" />
     </Svg>
)
