import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { endpoint_id } = body;

    if (!endpoint_id) {
      return new Response(
        JSON.stringify({ error: "Missing endpoint_id" }),
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("webhooks")
      .select("id_webhook, endpoint_id, status, http_status, retry_count, received_at, processed_at, error")
      .eq("endpoint_id", endpoint_id);

    if (error) {
      console.error("Error fetching webhooks:", error);
      return new Response(
        JSON.stringify({ error: "Database fetch failed" }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ webhooks: data }),
      { status: 200 }
    );

  } catch (err) {
    console.error("Error fetching webhooks:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
}
