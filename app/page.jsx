"use client";
import { useEffect, useState } from "react";
import { useSession, useUser } from "@clerk/nextjs";
import { createClient } from "@supabase/supabase-js";
import FormInputType from "./components/FormInputType";
import { motion } from "framer-motion";
import { div } from "framer-motion/client";

export default function Home() {

  // The `useUser()` hook will be used to ensure that Clerk has loaded data about the logged in user
  const { user } = useUser();

  console.log(user)
  // The `useSession()` hook will be used to get the Clerk session object
  return (
    <div className="bg-gray-100 w-full h-[720px] flex flex-row">
      <div className="h-full w-2/5 bg-red-900">

      <h1 className="text-white font-bold text-6xl">orbital</h1>

      </div>
      <div className="h-full w-3/5 bg-red-300">

      </div>

    </div> 
  );
}
