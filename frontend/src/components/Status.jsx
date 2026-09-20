import { BarChart3, ShieldCheck, Zap } from "lucide-react";

const Status = () => {
  return (
    <div className="bg-[#0d0d12] px-4 py-16 text-white sm:px-6 sm:py-24">
      <div className="mt-14 grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-left">
          <Zap size={18} className="mb-2 text-[#F29191]" strokeWidth={1.8} />
          <p className="text-lg font-semibold">~40ms</p>
          <p className="text-xs text-white/40">Average redirect time</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-left">
          <ShieldCheck
            size={18}
            className="mb-2 text-[#F29191]"
            strokeWidth={1.8}
          />
          <p className="text-lg font-semibold">99.9%</p>
          <p className="text-xs text-white/40">Uptime, every month</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-left">
          <BarChart3
            size={18}
            className="mb-2 text-[#F29191]"
            strokeWidth={1.8}
          />
          <p className="text-lg font-semibold">Free</p>
          <p className="text-xs text-white/40">No sign-up required</p>
        </div>
      </div>
    </div>
  );
};

export default Status;
