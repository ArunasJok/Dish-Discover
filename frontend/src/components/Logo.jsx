// Logo.jsx
import React from 'react';

const Logo = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <radialGradient id="logoGradient" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FF8A65" />
        <stop offset="100%" stopColor="#FF7043" />
      </radialGradient>
    </defs>
    {/* Background circle with gradient */}
    <circle cx="24" cy="24" r="24" fill="url(#logoGradient)" />
    {/* Abstract fork design on the left */}
    <path
      d="M18 14 v10"
      stroke="#fff"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M16 14 h4"
      stroke="#fff"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M16 18 h4"
      stroke="#fff"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M16 22 h4"
      stroke="#fff"
      strokeWidth="2"
      strokeLinecap="round"
    />
    {/* Abstract spoon design on the right */}
    <circle cx="30" cy="26" r="3" fill="#fff" />
    <path
      d="M30 29 v5"
      stroke="#fff"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export default Logo;
