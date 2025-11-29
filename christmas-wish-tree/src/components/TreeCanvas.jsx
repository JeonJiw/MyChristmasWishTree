import React from "react";
import treeImage from "../assets/christmas-tree.jpg";

const TreeCanvas = React.forwardRef(function TreeCanvas(
  { ornaments, isPreview = false, variant = "home" },
  ref
) {
  const displayOrnaments = isPreview
    ? [
        { id: "preview-1", giftName: "Bag" },
        { id: "preview-2", giftName: "Perfume" },
        { id: "preview-3", giftName: "Book" },
        { id: "preview-4", giftName: "Shoes" },
      ]
    : ornaments || [];

  const widthClass =
    variant === "editor"
      ? "w-[360px] md:w-[420px] lg:w-[460px]"
      : "w-[260px] md:w-[280px]";

  return (
    <div className="flex justify-center">
      {/* iPhone frame */}
      <div
        className={`relative bg-black rounded-[2.5rem] p-3 shadow-2xl ${widthClass}`}
      >
        {/* side button hints */}
        <div className="hidden md:block absolute -left-1 top-16 h-10 w-0.5 bg-neutral-700 rounded-full" />
        <div className="hidden md:block absolute -left-1 top-28 h-20 w-0.5 bg-neutral-700 rounded-full" />
        <div className="hidden md:block absolute -right-1 top-20 h-16 w-0.5 bg-neutral-700 rounded-full" />

        {/* inner screen */}
        <div className="relative rounded-[2rem] overflow-hidden bg-black">
          {/* top notch */}
          <div className="absolute top-0 inset-x-0 flex justify-center pt-1 z-20">
            <div className="h-5 w-28 bg-black rounded-b-3xl" />
          </div>

          {/* fake Instagram top bar */}
          <div className="absolute top-0 inset-x-0 z-10 flex items-center justify-between px-4 pt-3 pb-1 text-[10px] text-white/90">
            <button className="opacity-80">✕</button>
            <span className="font-medium">Your story</span>
            <div className="flex items-center gap-2">
              <span className="text-xs">Aa</span>
              <span>😊</span>
              <span>✨</span>
            </div>
          </div>

          {/* main story content */}
          <div className="relative mt-5 px-2 pb-3">
            <div
              ref={ref}
              className="relative w-full mx-auto rounded-xl overflow-hidden border border-white/10"
              style={{ aspectRatio: "9 / 16" }} // Instagram Story ratio
            >
              {/* Tree photo */}
              <img
                src={treeImage}
                alt="Christmas tree"
                className="w-full h-full object-cover"
              />

              {/* right-side editor icons (mock) */}
              <div className="absolute inset-y-0 right-1 flex flex-col items-center justify-center gap-3 text-xs text-white drop-shadow">
                <button className="bg-black/40 rounded-full w-7 h-7 flex items-center justify-center">
                  😊
                </button>
                <button className="bg-black/40 rounded-full w-7 h-7 flex items-center justify-center">
                  🔖
                </button>
                <button className="bg-black/40 rounded-full w-7 h-7 flex items-center justify-center">
                  ✏️
                </button>
              </div>

              {/* Gift markers over the tree */}
              {displayOrnaments.map((gift, index) => {
                const count = displayOrnaments.length || 1;
                const top = 22 + (50 / count) * index; // distribute from ~22% to ~72%
                const left = index % 2 === 0 ? "32%" : "68%"; // alternate left/right
                const formattedPrice =
                  typeof gift.price === "number"
                    ? gift.price.toFixed(2)
                    : gift.price;
                const isClickable = !isPreview && !!gift.link;

                const handleClick = () => {
                  if (isClickable) {
                    window.open(gift.link, "_blank", "noopener,noreferrer");
                  }
                };

                return (
                  <div
                    key={gift.id || index}
                    className={`group absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1${
                      isClickable ? " cursor-pointer" : ""
                    }`}
                    style={{ top: `${top}%`, left }}
                    onClick={handleClick}
                  >
                    <div className="w-7 h-7 rounded-full bg-red-600/90 border border-white/80 flex items-center justify-center text-[10px] text-white shadow-lg">
                      🎁
                    </div>
                    {!isPreview && gift.giftName && (
                      <div className="px-2 py-0.5 rounded-full bg-black/70 text-[9px] text-white whitespace-nowrap">
                        {gift.giftName}
                      </div>
                    )}
                    {!isPreview && formattedPrice && (
                      <div className="px-2 py-0.5 rounded-full bg-emerald-600/80 text-[9px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                        ${formattedPrice}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* bottom editing bar (mock) */}
              <div className="absolute inset-x-0 bottom-0 pb-1 px-2">
                <div className="flex items-center justify-between text-[9px] text-white/90">
                  <div className="flex items-center gap-1">
                    <div className="h-0.5 w-10 bg-white/60 rounded-full" />
                    <div className="h-0.5 w-6 bg-white/30 rounded-full" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🎵</span>
                    <span>✨</span>
                    <span>⋯</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* bottom story action bar */}
          <div className="absolute bottom-0 inset-x-0 px-4 pb-3 pt-1 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex items-center justify-between text-[10px] text-white/90">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-white/80" />
              <span className="font-medium">Your story</span>
            </div>
            <button className="bg-blue-500 px-3 py-1 rounded-full text-[10px] font-semibold">
              Share
            </button>
          </div>
        </div>

        {/* home indicator */}
        <div className="mt-2 flex justify-center">
          <div className="h-1 w-16 rounded-full bg-white/40" />
        </div>
      </div>
    </div>
  );
});

export default TreeCanvas;
