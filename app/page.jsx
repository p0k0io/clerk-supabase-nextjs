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
  const { session } = useSession();
  const [fileInput, setFileInput] =  useState(null);
  // Create a custom supabase client that injects the Clerk Supabase token into the request headers

  // This `useEffect` will wait for the User object to be loaded before requesting
  // the tasks for the logged in user


async function handleUpload(event) {
  event.preventDefault() // evitar recargar la página
  const file = event.target.elements.file.files[0] // input name="file"

  if (!file) return

  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onloadend = async () => {
    const base64 = reader.result.split(',')[1]

    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file: base64, fileName: file.name })
    })

    const data = await res.json()
    console.log(data)
  }
}

  return (
    <div className="min-w-full bg-gradient-to-l from-slate-50 to-slate-300 h-screen justify-center items-center flex flex-col gap-4">

      <div className="w-4/5 bg-white rounded-2xl h-44  jsustify-center items-center flex flex-col gap-4 px-3 py-6">

      <div className="w-1/5 bg-red-300 h-full rounded-2xl">
          <form onSubmit={handleUpload} className="flex flex-col gap-4">
            <label>
              <span>Upload a file</span>
              <input type="file" name="file" />
            </label>
            <button type="submit">Submit</button>
          </form>
      </div>

      </div>



<FormInputType/>



  
    </div>
  );
}
