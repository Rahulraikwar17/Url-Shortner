import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { Link2 } from "lucide-react";

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

// Column me 10 digits stacked hain, isliye 1 digit = 10% yPercent
const STEP = 10;

// Upar/niche edge par digit halka fade ho jaye (slot-machine feel)
const MASK =
  "linear-gradient(to bottom, transparent 0%, #000 20%, #000 80%, transparent 100%)";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ------------------------------------------------------------------ */
/*  Ek digit: 0-9 ka vertical column, jo target digit tak roll hota hai */
/* ------------------------------------------------------------------ */
const Digit = ({ value, animateIn }) => {
  const wrapRef = useRef(null);
  const colRef = useRef(null);
  const hasMounted = useRef(false);

  useLayoutEffect(() => {
    const col = colRef.current;
    const target = -value * STEP;
    const dur = prefersReducedMotion() ? 0 : 1;

    // Pehli baar: bina animation ke seedha sahi digit dikhao (0 pe "0")
    if (!hasMounted.current) {
      hasMounted.current = true;

      if (!animateIn) {
        gsap.set(col, { yPercent: target });
        return;
      }

      // Naya place aaya (jaise 9 -> 10): 0 se shuru karke roll karo
      gsap.set(col, { yPercent: 0 });
      gsap.from(wrapRef.current, {
        width: 0,
        opacity: 0,
        duration: 0.5 * dur,
        ease: "power3.out",
        clearProps: "width,opacity",
      });
    }

    // Value badli: purana digit upar (ya niche) jaye, naya dusri taraf se aaye
    gsap.to(col, {
      yPercent: target,
      duration: 0.9 * dur,
      ease: "expo.out",
      overwrite: "auto",
    });

    // Chalte waqt halka blur, rukte hi saaf
    gsap.fromTo(
      col,
      { filter: "blur(3px)" },
      {
        filter: "blur(0px)",
        duration: 0.8 * dur,
        ease: "power2.out",
        overwrite: "auto",
      },
    );
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <span
      ref={wrapRef}
      aria-hidden="true"
      className="inline-block h-[1.2em] overflow-hidden"
      style={{ maskImage: MASK, WebkitMaskImage: MASK }}
    >
      <span ref={colRef} className="flex flex-col will-change-transform">
        {DIGITS.map((d) => (
          <span key={d} className="block h-[1.2em] text-center leading-[1.2]">
            {d}
          </span>
        ))}
      </span>
    </span>
  );
};

/* ------------------------------------------------------------------ */
/*  Capsule counter (links list ke upar, right side)                    */
/* ------------------------------------------------------------------ */
const LinksCount = ({ count = 0 }) => {
  const safeCount = Math.max(0, Math.floor(Number(count) || 0));
  const digits = String(safeCount).split("").map(Number);
  const label = safeCount === 1 ? "link" : "links";

  // First render me digits animate-in nahi hone chahiye, baad me naye place hon toh ho
  const isFirstRender = useRef(true);
  useLayoutEffect(() => {
    isFirstRender.current = false;
  }, []);

  return (
    // w-[60vw] LinkBar ki width ke barabar, taaki capsule list ke right edge se align rahe
    <div className="mb-3 flex w-[60vw] justify-end">
      <div
        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] py-1.5 pl-3 pr-3.5 text-sm text-white"
        role="status"
      >
        <Link2
          size={14}
          strokeWidth={2}
          className="shrink-0 text-[#F29191]"
          aria-hidden="true"
        />

        <span className="sr-only">
          {safeCount} {label}
        </span>

        <span className="flex font-medium tabular-nums">
          {digits.map((digit, i) => {
            // Key = place value (right se), taaki 9 -> 10 par unit digit wahi rahe
            const place = digits.length - 1 - i;

            return (
              <Digit
                key={place}
                value={digit}
                animateIn={!isFirstRender.current}
              />
            );
          })}
        </span>

        <span className="text-white/45" aria-hidden="true">
          {label}
        </span>
      </div>
    </div>
  );
};

export default LinksCount;