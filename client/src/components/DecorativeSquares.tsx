// DecorativeSquares.tsx
import React from "react";

export default function DecorativeSquares() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
      {/* faint squares */}
      <div className="absolute top-[14%] left-[15%] w-10 h-10 border border-dashed border-[#c1c8d6] rounded-md animate-pulse " />
      <div className="absolute top-[25%] left-[10%] w-12 h-12 border border-dashed border-[#c1c8d6] rounded-md animate-pulse" />
      <div className="absolute top-[40%] left-[20%] w-10 h-10 border border-dashed border-[#c1c8d6] rounded-md animate-pulse" />
      <div className="absolute top-[55%] left-[15%] w-12 h-12 border border-dashed border-[#c1c8d6] rounded-md animate-pulse" />
      <div className="absolute top-[70%] left-[25%] w-10 h-10 border border-dashed border-[#c1c8d6] rounded-md animate-pulse" />
      <div className="absolute top-[20%] left-[35%] w-12 h-12 border border-dashed border-[#c1c8d6] rounded-md " />
      <div className="absolute top-[50%] left-[40%] w-10 h-10 border border-dashed border-[#c1c8d6] rounded-md animate-pulse" />
      <div className="absolute top-[65%] left-[45%] w-12 h-12 border border-dashed border-[#c1c8d6] rounded-md animate-pulse" />

      <div className="absolute top-[35%] left-[10%] w-8 h-8 border border-dashed border-[#c1c8d6] rounded-md animate-pulse" />
      <div className="absolute top-[45%] left-[20%] w-10 h-10 border border-dashed border-[#c1c8d6] rounded-md " />
      <div className="absolute top-[60%] left-[30%] w-8 h-8 border border-dashed border-[#c1c8d6] rounded-md animate-pulse" />
      <div className="absolute top-[80%] left-[15%] w-12 h-12 border border-dashed border-[#c1c8d6] rounded-md " />

      <div className="absolute top-[48%] left-[55%] w-10 h-10 border border-dashed border-[#c1c8d6] rounded-md animate-pulse" />
      <div className="absolute top-[65%] left-[60%] w-8 h-8 border border-dashed border-[#c1c8d6] rounded-md " />
      <div className="absolute top-[75%] left-[50%] w-12 h-12 border border-dashed border-[#c1c8d6] rounded-md animate-pulse" />

      <div className="absolute top-[55%] left-[70%] w-8 h-8 border border-dashed border-[#c1c8d6] rounded-md " />
      <div className="absolute top-[68%] left-[80%] w-10 h-10 border border-dashed border-[#c1c8d6] rounded-md animate-pulse" />
      <div className="absolute top-[85%] left-[65%] w-12 h-12 border border-dashed border-[#c1c8d6] rounded-md " />
    </div>
  );
}