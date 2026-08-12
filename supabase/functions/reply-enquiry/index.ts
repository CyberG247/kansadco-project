import { createClient } from "npm:@supabase/supabase-js@2";
import { sendEnquiryReply, type EnquiryEmailRecord } from "../_shared/enquiry-email.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) => Response.json(body, {
  status,
  headers: { ...corsHeaders, "Cache-Control": "no-store" },
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

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return json({ error: "Method not allowed." }, 405);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const secretKey = getSecretKey();
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!supabaseUrl || !secretKey || !token) return json({ error: "Authentication required." }, 401);

  const supabaseAdmin = createClient(supabaseUrl, secretKey, { auth: { persistSession: false } });
  const { data: userResult, error: userError } = await supabaseAdmin.auth.getUser(token);
  if (userError || !userResult.user) return json({ error: "Authentication required." }, 401);

  const { data: profile } = await supabaseAdmin.from("profiles").select("role").eq("id", userResult.user.id).maybeSingle();
  if (!profile || !["admin", "editor"].includes(profile.role)) return json({ error: "Administrator access required." }, 403);

  const payload = await request.json().catch(() => ({})) as Record<string, unknown>;
  const enquiryId = clean(payload.enquiryId);
  const subject = clean(payload.subject);
  const message = clean(payload.message);
  if (!/^[0-9a-f-]{36}$/i.test(enquiryId)) return json({ error: "A valid enquiry is required." }, 422);
  if (subject.length < 2 || subject.length > 240) return json({ error: "Use a subject between 2 and 240 characters." }, 422);
  if (message.length < 2 || message.length > 5_000) return json({ error: "Write a response between 2 and 5,000 characters." }, 422);

  const { data: enquiry, error: enquiryError } = await supabaseAdmin.from("enquiries").select("*").eq("id", enquiryId).maybeSingle();
  if (enquiryError || !enquiry) return json({ error: "Enquiry not found." }, 404);

  const { data: reply, error: replyError } = await supabaseAdmin.from("enquiry_replies").insert({
    enquiry_id: enquiry.id,
    admin_id: userResult.user.id,
    subject,
    message,
    delivery_status: "Pending",
  }).select("*").single();
  if (replyError || !reply) return json({ error: "The response could not be prepared." }, 500);

  const { data: settings } = await supabaseAdmin.from("site_settings").select("primary_email").eq("id", 1).maybeSingle();
  const replyToEmail = Deno.env.get("BREVO_NOTIFICATION_EMAIL") ?? settings?.primary_email ?? "info@kansadco.com";

  try {
    const messageId = await sendEnquiryReply(enquiry as EnquiryEmailRecord, { id: reply.id, subject, message }, replyToEmail);
    const sentAt = new Date().toISOString();
    await Promise.all([
      supabaseAdmin.from("enquiry_replies").update({ delivery_status: "Sent", brevo_message_id: messageId, delivery_error: null, sent_at: sentAt }).eq("id", reply.id),
      supabaseAdmin.from("enquiries").update({ status: "Replied" }).eq("id", enquiry.id),
    ]);
    return json({ sent: true, reply: { ...reply, delivery_status: "Sent", brevo_message_id: messageId, sent_at: sentAt } });
  } catch (error) {
    const reason = error instanceof Error ? error.message.slice(0, 500) : "Email delivery failed.";
    await supabaseAdmin.from("enquiry_replies").update({ delivery_status: "Failed", delivery_error: reason }).eq("id", reply.id);
    return json({ error: "Brevo could not deliver this reply. It has been retained in the enquiry history." }, 502);
  }
});
