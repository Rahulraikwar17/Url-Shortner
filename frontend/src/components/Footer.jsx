import React from "react";
import { Link2 } from "lucide-react";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-[#0d0d12] px-4 py-8 text-white sm:px-6">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-center gap-2">
          <Link2 size={16} strokeWidth={1.8} className="text-[#F29191]" />
          <span className="text-sm font-semibold tracking-tight">Snip</span>
        </div>

        <p className="text-xs text-white/35">
          &copy; {year} Snip. Short links, zero fuss.
        </p>
      </div>
    </footer>
  );
};

export default Footer;