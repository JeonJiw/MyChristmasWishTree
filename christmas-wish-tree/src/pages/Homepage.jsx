// src/pages/HomePage.jsx
// Landing hero layout for the Christmas Wish Tree app.

import React from "react";
import TreeCanvas from "../components/TreeCanvas";

export default function HomePage({ onCreateTree }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-emerald-50 to-green-100 flex items-center">
      <div className="max-w-6xl mx-auto w-full px-6 lg:px-10 py-16 lg:py-24">
        <div className="flex flex-col-reverse md:flex-row items-center md:items-center gap-10 lg:gap-16">
          {/* Left: text and call-to-action */}
          <div className="w-full md:w-3/5 lg:w-7/12 text-center md:text-left">
            <div className="inline-flex items-center gap-2 mb-4 md:mb-5">
              <span className="text-2xl">🎄</span>
              <span className="uppercase tracking-[0.2em] text-green-700">
                My Christmas Wish Tree
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-green-800 leading-tight mb-10 lg:whitespace-nowrap">
              My Christmas Wish Tree
            </h1>

            <p className="text-gray-700 text-sm sm:text-base max-w-xl mx-auto md:mx-0 mb-8">
              Turn your wish list into a cozy Christmas tree and share it with
              family and friends. Add gifts, set priorities, and send a magic
              link.
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <button
                onClick={onCreateTree}
                className="inline-flex justify-center items-center bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-full shadow-xl transform transition hover:scale-105 hover:shadow-2xl"
              >
                Create Your Wish Tree
              </button>

              <div className="text-xs sm:text-sm text-gray-600 space-y-1 sm:space-y-0 sm:flex sm:flex-col">
                <span>✨ Simple • Visual • Shareable</span>
                <span>🎁 Add gifts and share your wishes easily.</span>
              </div>
            </div>
          </div>

          {/* Right: phone mock preview */}
          <div className="w-full md:w-2/5 lg:w-5/12 flex justify-center md:justify-end">
            <TreeCanvas ornaments={[]} isPreview={true} variant="home" />
          </div>
        </div>
      </div>
    </div>
  );
}
