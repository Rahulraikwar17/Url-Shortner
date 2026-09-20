import React, { useEffect, useRef, useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { generateUrl } from "../shared/urlApis";

import { Link, ArrowRight, Sparkles } from "lucide-react";

import gsap from "gsap";

import Loader from "../components/Loader";
import HeroVisual from "../components/HeroVisual";

const HEADLINE_LINE_1 = "Long links get in the way.";
const HEADLINE_LINE_2 = "Shorten them and keep moving.";

const renderWords = (text) => {
  const parts = text.split(" ");

  return parts.map((word, i) => (
    <span
      key={i}
      className="word inline-block"
    >
      {word}
      {i !== parts.length - 1 ? "\u00A0" : ""}
    </span>
  ));
};

const CreateUrl = () => {
  const [url, setUrl] = useState("");

  const containerRef = useRef(null);
  const headlineRef = useRef(null);
  const subRef = useRef(null);
  const formRef = useRef(null);

  const queryClient = useQueryClient();

  const createUrlMutation = useMutation({
    mutationFn: generateUrl,

    onSuccess: () => {
      // GET links ko fresh kar do
      queryClient.invalidateQueries({
        queryKey: ["links"],
      });

      setUrl("");
    },

    onError: (error) => {
      console.error("Failed to create URL:", error);
    },
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      const words =
        headlineRef.current.querySelectorAll(".word");

      const tl = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      tl.from(words, {
        opacity: 0,
        y: 18,
        duration: 0.6,
        stagger: 0.04,
      })
        .from(
          subRef.current,
          {
            opacity: 0,
            y: 12,
            duration: 0.5,
          },
          "-=0.25"
        )
        .from(
          formRef.current,
          {
            opacity: 0,
            y: 12,
            duration: 0.5,
          },
          "-=0.3"
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!url.trim()) return;

    createUrlMutation.mutate({
      url,
    });
  };

  return (
    <main
      ref={containerRef}
      className="bg-[#0d0d12] px-4 pt -10 text-white sm:px-6 sm:py-24"
    >
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">

        <h1
          ref={headlineRef}
          className="overflow-hidden text-4xl font-semibold leading-tight tracking-tight sm:text-5xl"
        >
          <span className="block">
            {renderWords(HEADLINE_LINE_1)}
          </span>

          <span className="block text-white/50">
            {renderWords(HEADLINE_LINE_2)}
          </span>
        </h1>

        <p
          ref={subRef}
          className="mt-5 max-w-md text-sm text-white/45 sm:text-base"
        >
          Paste a URL, get something worth sharing. No sign-up,
          no clutter — just a shorter link that works.
        </p>

        <HeroVisual />

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="mt-4 w-full"
        >
          <div className="flex flex-col gap-3 sm:flex-row">

            <div className="group flex min-h-[58px] flex-1 items-center rounded-2xl border border-white/10 bg-white/[0.04] px-4 transition-all duration-300 focus-within:border-[#F29191]/60 focus-within:bg-white/[0.06] focus-within:shadow-[0_0_35px_rgba(242,145,145,0.08)]">

              <Link
                size={20}
                strokeWidth={1.8}
                className="mr-3 shrink-0 text-white/30 transition-all duration-300 group-focus-within:rotate-[-10deg] group-focus-within:text-[#F29191]"
              />

              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste your long URL..."
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/25 sm:text-base"
              />
            </div>

            <button
              type="submit"
              disabled={createUrlMutation.isPending}
              className="group relative flex min-h-[58px] items-center justify-center gap-2 overflow-hidden rounded-2xl bg-[#F29191] px-7 font-semibold text-[#1a1010] shadow-[0_10px_30px_rgba(242,145,145,0.18)] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:bg-[#ffa5a5] hover:shadow-[0_15px_40px_rgba(242,145,145,0.30)] active:translate-y-0 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60 sm:min-w-[190px]"
            >

              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

              {createUrlMutation.isPending ? (
                <Loader text="Creating..." />
              ) : (
                <>
                  <Sparkles
                    size={18}
                    className="relative transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110"
                  />

                  <span className="relative">
                    Create Short URL
                  </span>

                  <ArrowRight
                    size={18}
                    className="relative transition-transform duration-300 group-hover:translate-x-1"
                  />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default CreateUrl;