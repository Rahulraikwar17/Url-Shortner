import React from "react";
import { LoaderCircle } from "lucide-react";

const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="flex items-center justify-center gap-2">
      <LoaderCircle
        size={18}
        strokeWidth={2}
        className="animate-spin text-[#F29191]"
      />

      <span className="text-sm text-white/60">{text}</span>
    </div>
  );
};

export default Loader;
