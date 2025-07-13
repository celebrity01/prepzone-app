import React from "react";

export const LoadingSpinner: React.FC = () => (
  <div className="relative inline-flex items-center justify-center">
    <div className="spinner"></div>
    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-green-500 opacity-20 animate-pulse"></div>
    <span className="sr-only">Loading...</span>
  </div>
);
