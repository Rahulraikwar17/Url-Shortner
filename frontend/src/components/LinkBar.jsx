import gsap from "gsap";
import { ExternalLink, Trash2, Copy } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteUrl } from "../shared/urlApis";

const LinkBar = ({ link, delay = 0 }) => {
  const wrapRef = useRef(null);
  const barRef = useRef(null);
  const deleteTlRef = useRef(null);
  const copiedRef = useRef(null);

  const [copied, setCopied] = useState(false);

  const queryClient = useQueryClient();

  const shortUrl = `http://localhost:3000/${link.shortCode}`;

  // ---------- DELETE MUTATION ----------
  const deleteMutation = useMutation({
    mutationFn: deleteUrl,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["links"],
      });
    },

    onError: (error) => {
      console.error("Failed to delete URL:", error);

      // Delete fail hua toh animation reverse
      const tl = deleteTlRef.current;

      if (!tl) return;

      tl.eventCallback("onReverseComplete", () => {
        gsap.set(wrapRef.current, {
          clearProps: "overflow,height,paddingBottom",
        });

        deleteTlRef.current = null;
      });

      tl.reverse();
    },
  });

  // ---------- ENTER ANIMATION ----------
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(wrapRef.current, {
        overflow: "hidden",
      });

      const tl = gsap.timeline({
        delay,

        onComplete: () => {
          gsap.set(wrapRef.current, {
            clearProps: "overflow,height",
          });
        },
      });

      // Space create
      // Baaki links smoothly neeche jayenge
      tl.from(wrapRef.current, {
        height: 0,
        paddingBottom: 0,
        duration: 0.55,
        ease: "power3.out",
      })

        // Bar blur + fade
        .from(
          barRef.current,
          {
            opacity: 0,
            filter: "blur(18px)",
            y: -25,
            scale: 0.96,
            duration: 0.6,
            ease: "power3.out",
          },
          0
        );
    }, wrapRef);

    return () => ctx.revert();
  }, [delay]);

  // ---------- COPY ----------
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);

      setCopied(true);

      // Copied popup animation
      requestAnimationFrame(() => {
        if (!copiedRef.current) return;

        gsap.fromTo(
          copiedRef.current,
          {
            opacity: 0,
            y: 5,
            scale: 0.9,
            filter: "blur(6px)",
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.25,
            ease: "power2.out",
          }
        );
      });

      // 1.2 sec baad popup hide
      setTimeout(() => {
        if (!copiedRef.current) {
          setCopied(false);
          return;
        }

        gsap.to(copiedRef.current, {
          opacity: 0,
          y: -4,
          scale: 0.95,
          filter: "blur(5px)",
          duration: 0.2,
          ease: "power2.in",
          onComplete: () => {
            setCopied(false);
          },
        });
      }, 1200);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  // ---------- DELETE ----------
  const handleDelete = () => {
    if (deleteTlRef.current) return;

    gsap.set(wrapRef.current, {
      overflow: "hidden",
    });

    deleteTlRef.current = gsap
      .timeline({
        onComplete: () => {
          deleteMutation.mutate(link._id);
        },
      })

      // Bar blur + fade out
      .to(barRef.current, {
        opacity: 0,
        filter: "blur(14px)",
        scale: 0.96,
        y: -5,
        duration: 0.35,
        ease: "power2.in",
      })

      // Space collapse
      // Baaki links smoothly upar aayenge
      .to(
        wrapRef.current,
        {
          height: 0,
          paddingBottom: 0,
          duration: 0.45,
          ease: "power3.inOut",
        },
        0.15
      );
  };

  return (
    <div
      ref={wrapRef}
      className="w-[60vw] pb-2.5"
    >
      <div
        ref={barRef}
        className="flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-[#0d0d0d] px-5 py-4"
      >
        {/* Original + Short URL */}
        <div className="min-w-0 flex-1">
          <p
            className="truncate text-xs text-white/40"
            title={link.orginalUrl}
          >
            {link.orginalUrl}
          </p>

          <div className="mt-1 flex items-center gap-3">
            <p
              className="min-w-0 truncate font-mono text-sm text-[#F29191] sm:text-base"
              title={shortUrl}
            >
              {shortUrl}
            </p>

            <span className="shrink-0 rounded-lg border border-white/10 bg-[#151515] px-2 py-1 text-xs text-white/45">
              {link.clicks} clicks
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex shrink-0 items-center gap-2">

          {/* Copy */}
          <div className="relative">
            {copied && (
              <span
                ref={copiedRef}
                className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/10 bg-[#18181b] px-2.5 py-1 text-[10px] font-medium text-white shadow-xl"
              >
                Copied ✓
              </span>
            )}

            <button
              type="button"
              onClick={handleCopy}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-[#151515] text-white/70 transition hover:border-[#F29191]/60 hover:text-[#F29191]"
              title="Copy"
            >
              <Copy
                size={16}
                strokeWidth={1.8}
              />
            </button>
          </div>

          {/* Open */}
          <a
            href={shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-[#151515] text-white/70 transition hover:border-[#F29191]/60 hover:text-[#F29191]"
            title="Open"
          >
            <ExternalLink
              size={16}
              strokeWidth={1.8}
            />
          </a>

          {/* Delete */}
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-[#151515] text-white/70 transition hover:border-red-400/50 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
            title="Delete"
          >
            <Trash2
              size={16}
              strokeWidth={1.8}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LinkBar;