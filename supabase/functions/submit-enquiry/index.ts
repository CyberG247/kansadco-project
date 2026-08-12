import { createClient } from "npm:@supabase/supabase-js@2";
import { sendEnquiryEmails, type EnquiryEmailRecord } from "../_shared/enquiry-email.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" },
});

const getSecretKey = () => {
  const keys = Deno.env.get("SUPABASE_SECRET_KEYS");
  if (keys) {
    const parsed = JSON.parse(keys) as Record<string, string>;
    if (parsed.default) return parsed.default;
  }
  return Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
};

const clean = (value: unknown) => typeof value === "string" ? value.trim() : "";
const validEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
const validNigerianPhone = (value: string) => /^\+234\d{10}$/.test(value);

const fingerprintRequest = async (request: Request) => {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const userAgent = request.headers.get("user-agent")?.slice(0, 220) ?? "unknown";
  const salt = Deno.env.get("ENQUIRY_RATE_LIMIT_SALT") ?? Deno.env.get("SUPABASE_URL") ?? "kansadco";
  const bytes = new TextEncoder().encode(`${salt}|${forwarded}|${userAgent}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
};

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return json({ error: "Method not allowed." }, 405);
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 20_000) return json({ error: "Submission is too large." }, 413);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const secretKey = getSecretKey();
  if (!supabaseUrl || !secretKey) return json({ error: "The enquiry service is unavailable." }, 503);
  const supabaseAdmin = createClient(supabaseUrl, secretKey, { auth: { persistSession: false } });

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return json({ error: "Send a valid JSON request." }, 400);
  }

  // A filled honeypot receives a normal-looking response without creating mail or data.
  if (clean(payload.website)) return json({ accepted: true }, 201);

  const name = clean(payload.name);
  const email = clean(payload.email).toLowerCase();
  const phone = clean(payload.phone);
  const subject = clean(payload.subject);
  const message = clean(payload.message);
  const source = payload.source === "Private tour" ? "Private tour" : "Contact";
  const formStartedAt = Number(payload.formStartedAt ?? 0);

  if (name.length < 2 || name.length > 160) return json({ error: "Enter your full name." }, 422);
  if (email.length > 320 || !validEmail(email)) return json({ error: "Enter a valid email address." }, 422);
  if (!validNigerianPhone(phone)) return json({ error: "Enter +234 followed by the 10-digit telephone number." }, 422);
  if (subject.length < 2 || subject.length > 240) return json({ error: "Enter a short enquiry subject." }, 422);
  if (message.length < 2 || message.length > 5_000) return json({ error: "Enter a message between 2 and 5,000 characters." }, 422);
  if (formStartedAt > 0 && Date.now() - formStartedAt < 900) return json({ error: "Please review the form before sending it." }, 422);

  const fingerprint = await fingerprintRequest(request);
  const { data: hasSlot, error: rateLimitError } = await supabaseAdmin.rpc("claim_enquiry_submission", { p_fingerprint: fingerprint });
  if (rateLimitError) return json({ error: "The enquiry service is temporarily unavailable." }, 503);
  if (!hasSlot) return json({ error: "Too many messages were sent from this device. Please try again in 15 minutes." }, 429);

  const { data, error: insertError } = await supabaseAdmin.from("enquiries").insert({
    name, email, phone, subject, message, source, status: "New", notification_status: "Pending",
  }).select("*").single();
  if (insertError || !data) return json({ error: "Your enquiry could not be saved. Please try again." }, 500);

  const enquiry = data as EnquiryEmailRecord;
  const { data: settings } = await supabaseAdmin.from("site_settings").select("primary_email").eq("id", 1).maybeSingle();
  const notificationEmail = Deno.env.get("BREVO_NOTIFICATION_EMAIL") ?? settings?.primary_email ?? "info@kansadco.com";

  try {
    const delivery = await sendEnquiryEmails(enquiry, notificationEmail);
    const notifiedAt = new Date().toISOString();
    await supabaseAdmin.from("enquiries").update({
      notification_status: delivery.status,
      notification_message_id: delivery.notificationMessageId,
      acknowledgement_message_id: delivery.acknowledgementMessageId,
      notification_error: delivery.error,
      notified_at: notifiedAt,
    }).eq("id", enquiry.id);
    return json({
      accepted: true,
      enquiry: {
        ...data,
        notification_status: delivery.status,
        notification_message_id: delivery.notificationMessageId,
        acknowledgement_message_id: delivery.acknowledgementMessageId,
        notification_error: delivery.error,
        notified_at: notifiedAt,
      },
      notificationSent: true,
      acknowledgementSent: delivery.status === "Sent",
    }, 201);
  } catch (error) {
    const reason = error instanceof Error ? error.message.slice(0, 500) : "Email delivery failed.";
    await supabaseAdmin.from("enquiries").update({ notification_status: "Failed", notification_error: reason }).eq("id", enquiry.id);
    // The enquiry is safely in the admin inbox, so a mail-provider outage must not invite duplicate submissions.
    return json({
      accepted: true,
      enquiry: { ...data, notification_status: "Failed", notification_error: reason, notified_at: null },
      notificationSent: false,
      acknowledgementSent: false,
    }, 201);
  }
});
