import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(MotionPathPlugin);

const HeroVisual = () => {
  const containerRef = useRef(null);
  const pathRef = useRef(null);
  const dotRef = useRef(null);
  const longBoxRef = useRef(null);
  const shortBoxRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const path = pathRef.current;
      const length = path.getTotalLength();

      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      gsap.set([longBoxRef.current, shortBoxRef.current], { opacity: 0, y: 14 });
      gsap.set(dotRef.current, { opacity: 0 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.to(longBoxRef.current, { opacity: 1, y: 0, duration: 0.6 })
        .to(path, { strokeDashoffset: 0, duration: 1, ease: "power2.inOut" }, "-=0.15")
        .to(dotRef.current, { opacity: 1, duration: 0.15 }, "<")
        .to(
          dotRef.current,
          {
            motionPath: {
              path: path,
              align: path,
              alignOrigin: [0.5, 0.5],
            },
            duration: 1,
            ease: "power2.inOut",
          },
          "<"
        )
        .to(shortBoxRef.current, { opacity: 1, y: 0, duration: 0.6 }, "-=0.3")
        .to(dotRef.current, { opacity: 0, duration: 0.3 }, "-=0.3");
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto flex w-full max-w-xl items-center justify-between gap-3 py-6 sm:gap-4"
    >
      <div
        ref={longBoxRef}
        className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3"
      >
        <p className="truncate font-mono text-[11px] text-white/35 sm:text-xs">
          https://example.com/products/summer-sale/2026?ref=newsletter&amp;utm_campaign=launch
        </p>
      </div>

      <svg className="h-10 w-14 shrink-0 overflow-visible sm:w-20" viewBox="0 0 80 40">
        <path
          ref={pathRef}
          d="M2,20 C 24,20 24,20 40,20 C 56,20 56,20 78,20"
          fill="none"
          stroke="#F29191"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle ref={dotRef} r="3.5" fill="#F29191" />
      </svg>

      <div
        ref={shortBoxRef}
        className="shrink-0 rounded-xl border border-[#F29191]/30 bg-[#F29191]/[0.08] px-4 py-3 shadow-[0_0_25px_rgba(242,145,145,0.12)]"
      >
        <p className="font-mono text-[11px] text-[#F29191] sm:text-xs">snip.to/x7q2</p>
      </div>
    </div>
  );
};

export default HeroVisual;