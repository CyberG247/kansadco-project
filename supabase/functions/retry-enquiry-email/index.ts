import { createClient } from "npm:@supabase/supabase-js@2";
import { sendEnquiryEmails, type EnquiryEmailRecord } from "../_shared/enquiry-email.ts";

const json = (body: unknown, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

const getSecretKey = () => {
  const keys = Deno.env.get("SUPABASE_SECRET_KEYS");
  if (keys) {
    const parsed = JSON.parse(keys) as Record<string, string>;
    if (parsed.default) return parsed.default;
  }
  return Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
};

Deno.serve(async (request) => {
  if (request.method !== "POST") return json({ error: "Method not allowed." }, 405);
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const secretKey = getSecretKey();
  const authorization = request.headers.get("authorization");
  const token = authorization?.replace(/^Bearer\s+/i, "");
  if (!supabaseUrl || !secretKey || !token) return json({ error: "Authentication required." }, 401);

  const supabaseAdmin = createClient(supabaseUrl, secretKey, { auth: { persistSession: false } });
  const { data: userResult, error: userError } = await supabaseAdmin.auth.getUser(token);
  if (userError || !userResult.user) return json({ error: "Authentication required." }, 401);
  const { data: profile } = await supabaseAdmin.from("profiles").select("role").eq("id", userResult.user.id).maybeSingle();
  if (!profile || !["admin", "editor"].includes(profile.role)) return json({ error: "Administrator access required." }, 403);

  const payload = await request.json().catch(() => ({})) as { enquiryId?: string };
  if (!payload.enquiryId || !/^[0-9a-f-]{36}$/i.test(payload.enquiryId)) return json({ error: "A valid enquiry is required." }, 422);
  const { data, error: enquiryError } = await supabaseAdmin.from("enquiries").select("*").eq("id", payload.enquiryId).maybeSingle();
  if (enquiryError || !data) return json({ error: "Enquiry not found." }, 404);
  const { data: settings } = await supabaseAdmin.from("site_settings").select("primary_email").eq("id", 1).maybeSingle();
  const notificationEmail = Deno.env.get("BREVO_NOTIFICATION_EMAIL") ?? settings?.primary_email ?? "info@kansadco.com";

  try {
    const delivery = await sendEnquiryEmails(
      data as EnquiryEmailRecord,
      notificationEmail,
      data.notification_message_id,
    );
    await supabaseAdmin.from("enquiries").update({
      notification_status: delivery.status,
      notification_message_id: delivery.notificationMessageId,
      acknowledgement_message_id: delivery.acknowledgementMessageId,
      notification_error: delivery.error,
      notified_at: new Date().toISOString(),
    }).eq("id", data.id);
    return json({ sent: true, status: delivery.status });
  } catch (error) {
    const reason = error instanceof Error ? error.message.slice(0, 500) : "Email delivery failed.";
    await supabaseAdmin.from("enquiries").update({ notification_status: "Failed", notification_error: reason }).eq("id", data.id);
    return json({ error: "Brevo could not deliver the message. The enquiry remains safely stored." }, 502);
  }
});
