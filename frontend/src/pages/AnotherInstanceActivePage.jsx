import React from "react";

function AnotherInstanceActivePage() {
  return (
    <div className="w-screen h-screen bg-gradient-to-br from-green-100 to-white flex items-center justify-center">
      <div className="bg-white/90 rounded-xl shadow-lg p-10 flex flex-col items-center">
        <svg
          className="w-16 h-16 text-green-400 mb-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 16h-1v-4h-1m1-4h.01M12 20c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z"
          />
        </svg>
        <span className="text-green-500 font-extrabold text-3xl mb-2 text-center">
          Another Instance Active
        </span>
        <p className="text-gray-600 text-lg text-center max-w-xs">
          It looks like you already have this chat open in another window or
          device. Please close the other instance to continue here.
        </p>
      </div>
    </div>
  );
}

export default AnotherInstanceActivePage;
