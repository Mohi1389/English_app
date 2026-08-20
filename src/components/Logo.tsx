import React from 'react';

/**
 * Learn with Mohanna — Logo
 *
 * Concept: three ideas combined
 *  1. Learning  → an open book
 *  2. AI        → a glowing coral node (smart assistant)
 *  3. Growth    → a rising path/arrow across the pages
 */
export default function Logo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-label="Learn with Mohanna">
      <rect width="48" height="48" rx="14" fill="#0C8EE6" />
      {/* Book — left page */}
      <path
        d="M11 15.5c0-1.1.9-2 2-2h8c1.7 0 3 1.3 3 3v18c0-1.7-1.3-3-3-3h-8c-1.1 0-2-.9-2-2v-14z"
        fill="#fff"
        fillOpacity="0.95"
      />
      {/* Book — right page */}
      <path
        d="M37 15.5c0-1.1-.9-2-2-2h-8c-1.7 0-3 1.3-3 3v18c0-1.7 1.3-3 3-3h8c1.1 0 2-.9 2-2v-14z"
        fill="#fff"
        fillOpacity="0.72"
      />
      {/* Growth path */}
      <path
        d="M15 27l5-5 4 3.5 6-7"
        stroke="#FF6B52"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* AI node */}
      <circle cx="33.5" cy="16.5" r="4.6" fill="#FF6B52" />
      <circle cx="33.5" cy="16.5" r="1.7" fill="#fff" />
    </svg>
  );
}
