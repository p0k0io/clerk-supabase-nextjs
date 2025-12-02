"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function Home() {
  const { user, isLoaded } = useUser();
  const [userPlan, setUserPlan] = useState(null);
  const [userCredits, setUserCredits] = useState(null);

  useEffect(() => {
    if (isLoaded && user) {
      fetchUserPlan();
      fetchUserCredits();
    }
  }, [isLoaded, user]);
  const fetchUserCredits = async () => {
    try {
      const res = await fetch("/api/get/budget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });
      const data = await res.json();
      if (res.ok) {
        setUserCredits(data.credits);
        console.log("User credits:", data.credits);
      } else {
        console.error(data.error);
      }
    } catch (err) {
      console.error("Error fetching user credits:", err);
    }
  };

  const fetchUserPlan = async () => {
    try {
      const res = await fetch("/api/get/user/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });

      const data = await res.json();

      if (res.ok) {
        setUserPlan(data.plan);
        console.log("User plan:", data.plan);
      } else {
        console.error(data.error);
      }
    } catch (err) {
      console.error("Error fetching user plan:", err);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-start p-8">

      <div className="w-full max-w-3xl p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl flex flex-col gap-6">

        <div className="flex justify-between items-center">
  <div>
    <h1 className="text-2xl font-semibold text-white">Budget Dashboard</h1>
    <p className="text-sm text-white/60 mt-1">Manage your credits & usage</p>
  </div>

  <div className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm">
    <p className="text-white/70 text-sm">
      Plan:
      <span className="text-blue-400 font-semibold ml-1">
        {userPlan || "Cargando..."}
      </span>
    </p>
  </div>
</div>

<hr className="border-white/10" />

{/* Credits Section */}
<div className="flex flex-col gap-2">
  <h2 className="text-lg font-semibold text-white">Available Credits</h2>

  <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
    <p className="text-white text-xl font-semibold">
      {userCredits ?? 0}
    </p>
    <p className="text-white/60 text-sm">
      ≈ {(userCredits / 400).toFixed(2)} documents remaining
    </p>
  </div>
</div>

{/* Credit Packs */}
<div className="mt-4">
  <h2 className="text-base font-semibold text-white mb-2">Need more credits?</h2>

  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

    {/* Pack 1 */}
    <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm text-center hover:bg-white/10 transition">
      <p className="text-white text-base font-semibold leading-none">1M</p>
      <p className="text-white/40 text-[11px] leading-none">≈ 1,700 docs</p>
      <p className="text-blue-400 font-semibold text-sm mt-1 leading-none">15€</p>

      <button className="mt-2 px-3 py-1 text-xs font-medium rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30 transition">
        Get
      </button>
    </div>

    {/* Pack 2 */}
    <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm text-center hover:bg-white/10 transition">
      <p className="text-white text-base font-semibold leading-none">5M</p>
      <p className="text-white/40 text-[11px] leading-none">≈ 8,500 docs</p>
      <p className="text-blue-400 font-semibold text-sm mt-1 leading-none">60€</p>

      <button className="mt-2 px-3 py-1 text-xs font-medium rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30 transition">
        Get
      </button>
    </div>

    {/* Pack 3 */}
    <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm text-center hover:bg-white/10 transition">
      <p className="text-white text-base font-semibold leading-none">10M</p>
      <p className="text-white/40 text-[11px] leading-none">≈ 17,000 docs</p>
      <p className="text-blue-400 font-semibold text-sm mt-1 leading-none">90€</p>

      <button className="mt-2 px-3 py-1 text-xs font-medium rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30 transition">
        Get
      </button>
    </div>

  </div>
</div>


       
        
      </div>
    </div>
  );
}
