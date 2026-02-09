
import React from 'react';

export const CatIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18.8 20.8C17.2 22 14.8 22.5 12 22.5s-5.2-.5-6.8-1.7c-1.3-1-2.2-2.5-2.2-4.3C3 13.9 4.9 12 7.5 12h9c2.6 0 4.5 1.9 4.5 4.5 0 1.8-.9 3.3-2.2 4.3z" />
    <path d="M11.5 6.5c0-2.5-1.4-4.5-3-4.5-1.7 0-3 2-3 4.5" />
    <path d="M15.5 6.5c0-2.5 1.4-4.5 3-4.5 1.7 0 3 2 3 4.5" />
    <path d="M9.5 16.5c0-1.1.9-2 2-2h1c1.1 0 2 .9 2 2" />
  </svg>
);