import React from "react";

// components/ui/Logo.jsx
function Logo({ className = "h-8 w-8" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <rect x="2" y="2" width="8" height="8" rx="2" />
      <rect x="14" y="2" width="8" height="8" rx="2" />
      <rect x="2" y="14" width="8" height="8" rx="2" />
      <rect x="14" y="14" width="3" height="3" />
      <rect x="19" y="14" width="3" height="3" />
      <rect x="14" y="19" width="3" height="3" />
      <rect x="19" y="19" width="3" height="3" />
    </svg>
  );
}

export default Logo;
