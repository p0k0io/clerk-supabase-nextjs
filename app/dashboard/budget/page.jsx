"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function Home() {
  const { user, isLoaded } = useUser();
  const [userPlan, setUserPlan] = useState(null);

  useEffect(() => {
    if (isLoaded && user) {
      fetchUserPlan();
    }
  }, [isLoaded, user]);

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
          <h1 className="text-2xl font-semibold text-white">Budget Dashboard</h1>

          <p className="text-white/80">
            Plan:{" "}
            <span className="text-blue-400 font-semibold">
              {userPlan || "Cargando..."}
            </span>
          </p>
        </div>

        <hr className="border-white/20" />

        {/* Aquí meterás el contenido del dashboard */}

       
        
      </div>
    </div>
  );
}
