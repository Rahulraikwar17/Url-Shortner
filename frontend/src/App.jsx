import React, { useEffect, useLayoutEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import gsap from "gsap";
import { Link2 } from "lucide-react";

import CreateUrl from "./components/CreateUrl";
import Footer from "./components/Footer";
import Status from "./components/Status";
import LinkBar from "./components/LinkBar";
import LinksCount from "./components/LinksCount";

import { getUrls } from "./shared/urlApis";

// 0 links hone par ye dikhega
const EmptyState = () => {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(ref.current, {
        opacity: 0,
        y: 16,
        filter: "blur(12px)",
        duration: 0.6,
        ease: "power3.out",
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      className="flex w-[60vw] flex-col items-center gap-3 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-12 text-center"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
        <Link2 size={20} strokeWidth={1.8} className="text-[#F29191]" />
      </div>

      <div>
        <p className="text-base font-medium text-white">No links yet</p>
        <p className="mt-1 text-sm text-white/40">
          Paste a URL above and generate your first short link.
        </p>
      </div>
    </div>
  );
};

// Alag component taaki "first load" aur "naya link" me difference pata chale
const LinkList = ({ links }) => {
  const isInitialRender = useRef(true);

  useEffect(() => {
    isInitialRender.current = false;
  }, []);

  // 0 links: count aur LinkBar dono hide, sirf empty state
  if (links.length === 0) {
    return (
      <div className="flex flex-col items-center p-9">
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-9">
      <LinksCount count={links.length} />

      {links.map((link, i) => (
        <LinkBar
          key={link._id}
          link={link}
          // page load par stagger, baad me naye link par koi delay nahi
          delay={isInitialRender.current ? i * 0.07 : 0}
        />
      ))}
    </div>
  );
};

const App = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["links"],
    queryFn: getUrls,
  });

  const links = [...(data?.data?.urls || [])].reverse();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0d0d12] text-white">
        Loading links...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0d0d12] text-red-400">
        Failed to load links
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d12]">
      <CreateUrl />

      <LinkList links={links} />

      <Status />

      <Footer />
    </div>
  );
};

export default App;