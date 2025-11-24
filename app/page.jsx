"use client";
import { useEffect, useState } from "react";
import { useSession, useUser } from "@clerk/nextjs";
import { createClient } from "@supabase/supabase-js";
import FormInputType from "./components/FormInputType";

export default function Home() {

  // The `useUser()` hook will be used to ensure that Clerk has loaded data about the logged in user
  const { user } = useUser();

  console.log(user)
  // The `useSession()` hook will be used to get the Clerk session object
  return (
    <div className=" w-full h-20 bg-green-300">
    </div>
 
  );
}
