import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
);

export async function POST(req: Request) {
  const debug: any = {
    step: "init",
    timestamps: {},
  };

  try {
    debug.timestamps.start = Date.now();
    console.log("▶️ /api/get/webhook/stats called");

    /* ============================
        PARSE BODY
    ============================ */
    const body = await req.json();
    debug.step = "parse_body";
    debug.body = body;

    const { endpoint_id } = body;

    if (!endpoint_id) {
      debug.error = "Missing endpoint_id";
      return new Response(JSON.stringify(debug), { status: 400 });
    }

    /* ============================
        STEP 1: GET WEBHOOK IDS
    ============================ */
    debug.step = "fetch_webhook_ids";

    const webhooksRes = await supabase
      .from("webhooks")
      .select("id_webhook, received_at, processed_at")
      .eq("endpoint_id", endpoint_id);

    debug.webhooks_count = webhooksRes.data?.length ?? 0;
    debug.webhooks_error = webhooksRes.error ?? null;

    if (webhooksRes.error) {
      debug.step = "error_fetch_webhooks";
      return new Response(JSON.stringify(debug), { status: 500 });
    }

    const webhooks = webhooksRes.data ?? [];
    const webhookIds = webhooks.map((w) => w.id_webhook);

    /* ============================
        STEP 2: AVG RESPONSE TIME
    ============================ */
    debug.step = "compute_response_time";

    const responseTimes = webhooks
      .filter((w) => w.processed_at)
      .map((w) => {
        const start = new Date(w.received_at).getTime();
        const end = new Date(w.processed_at).getTime();
        return end - start;
      })
      .filter((t) => t > 0);

    const avg_response_time_ms =
      responseTimes.length > 0
        ? Math.round(
            responseTimes.reduce((a, b) => a + b, 0) /
              responseTimes.length
          )
        : 0;

    debug.response_samples = responseTimes.length;
    debug.avg_response_time_ms = avg_response_time_ms;

    /* ============================
        STEP 3: FETCH CREDITS
        (NO NESTED SELECT)
    ============================ */
    debug.step = "fetch_credits";

    if (webhookIds.length === 0) {
      debug.avg_credit_use = 0;
      debug.note = "No webhooks found";
    } else {
      const creditsRes = await supabase
        .from("request_logs")
        .select("credit_use, id_request")
        .in("id_request", webhookIds);

      debug.credits_error = creditsRes.error ?? null;
      debug.credits_rows = creditsRes.data?.length ?? 0;

      if (creditsRes.error) {
        debug.step = "error_fetch_credits";
        return new Response(JSON.stringify(debug), { status: 500 });
      }

      const credits = creditsRes.data
        .map((r) => r.credit_use)
        .filter((c) => typeof c === "number");

      const avg_credit_use =
        credits.length > 0
          ? credits.reduce((a, b) => a + b, 0) / credits.length
          : 0;

      debug.credit_samples = credits.length;
      debug.avg_credit_use = Number(avg_credit_use.toFixed(2));
    }

    debug.step = "done";
    debug.timestamps.end = Date.now();
    debug.duration_ms =
      debug.timestamps.end - debug.timestamps.start;

    return new Response(
      JSON.stringify({
        avg_credit_use: debug.avg_credit_use ?? 0,
        avg_response_time_ms,
        debug,
      }),
      { status: 200 }
    );
  } catch (err: any) {
    debug.step = "fatal_exception";
    debug.error = err?.message ?? String(err);
    debug.stack = err?.stack;

    console.error("🔥 FATAL STATS ERROR:", debug);

    return new Response(JSON.stringify(debug), {
      status: 500,
    });
  }
}
