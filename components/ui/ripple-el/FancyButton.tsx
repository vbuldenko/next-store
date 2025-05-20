"use client";

import MotionRippleWrapper from "@/components/ui/ripple-el/MotionRippleWrapper";

export default function FancyButton() {
  return (
    <MotionRippleWrapper
      className="bg-black px-6 py-3 size-50 rounded text-white font-bold"
      options={{
        color: "rgba(100, 200, 255, 0.4)",
        size: 150,
        blur: 15,
        scale: 3,
        duration: 2,
        shadow: "0 0 30px rgba(100, 200, 255, 0.3)",
      }}
      onClick={() => console.log("Clicked!")}
    >
      Fancy Button
    </MotionRippleWrapper>
  );
}
