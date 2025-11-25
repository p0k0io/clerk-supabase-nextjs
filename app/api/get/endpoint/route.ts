import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("endpoints")
      .select("id, id_user, name, info, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching endpoints:", error);
      return NextResponse.json({ error: "Database fetch failed" }, { status: 500 });
    }

    return NextResponse.json({ endpoints: data });
  } catch (err) {
    console.error("Error getting endpoints:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
