export interface EnquiryEmailRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  source: "Contact" | "Private tour" | "Admin";
  created_at: string;
}

export interface EmailDeliveryResult {
  status: "Sent" | "Partial";
  notificationMessageId: string;
  acknowledgementMessageId: string | null;
  error: string | null;
}

interface BrevoMessage {
  to: Array<{ email: string; name?: string }>;
  subject: string;
  htmlContent: string;
  textContent: string;
  replyTo?: { email: string; name?: string };
  tags?: string[];
  headers?: Record<string, string>;
}

const escapeHtml = (value: string) => value
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

const paragraphize = (value: string) => escapeHtml(value).replaceAll("\n", "<br />");

const formatDate = (value: string) => new Intl.DateTimeFormat("en-GB", {
  dateStyle: "long",
  timeStyle: "short",
  timeZone: "Africa/Lagos",
}).format(new Date(value));

const frame = (preheader: string, eyebrow: string, title: string, body: string, footer: string) => `<!doctype html>
<html lang="en">
  <head><meta name="viewport" content="width=device-width,initial-scale=1" /><meta name="color-scheme" content="light" /></head>
  <body style="margin:0;background:#edf0ec;color:#13201a;font-family:Arial,Helvetica,sans-serif;padding:32px 12px">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${preheader}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
      <tr><td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:680px;background:#ffffff;border-radius:30px;overflow:hidden;border:1px solid #dce2dd;box-shadow:0 20px 60px rgba(16,35,25,.08)">
          <tr><td style="padding:28px 38px;background:#10251a;border-bottom:1px solid #294033">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr>
              <td style="font-family:Arial,Helvetica,sans-serif;font-size:18px;font-weight:700;letter-spacing:5px;color:#ffffff">KANSADCO</td>
              <td align="right" style="font-family:Arial,Helvetica,sans-serif;font-size:9px;line-height:1.5;letter-spacing:1.8px;text-transform:uppercase;color:#91a398">Engineering<br />Nigeria Limited</td>
            </tr></table>
          </td></tr>
          <tr><td style="padding:44px 38px 46px;background:#10251a">
            <div style="font-size:10px;letter-spacing:2.4px;text-transform:uppercase;color:#9fb1a6">${eyebrow}</div>
            <div style="max-width:560px;margin-top:15px;font-family:Georgia,Times New Roman,serif;font-size:42px;line-height:1.08;letter-spacing:-.8px;color:#ffffff">${title}</div>
          </td></tr>
          <tr><td style="padding:38px">${body}</td></tr>
          <tr><td style="padding:24px 38px;background:#f4f6f3;border-top:1px solid #e3e8e4;color:#647168;font-size:10px;line-height:1.8;letter-spacing:.4px">${footer}</td></tr>
        </table>
        <div style="padding:18px 24px 0;color:#7c8981;font-size:9px;line-height:1.6;letter-spacing:1.4px;text-transform:uppercase">Built with purpose · Delivered with integrity</div>
      </td></tr>
    </table>
  </body>
</html>`;

const sendBrevoMessage = async (message: BrevoMessage, idempotencyKey: string) => {
  const apiKey = Deno.env.get("BREVO_API_KEY");
  if (!apiKey) throw new Error("Brevo API key is not configured.");

  const senderEmail = Deno.env.get("BREVO_SENDER_EMAIL") ?? "info@kansadco.com";
  const senderName = Deno.env.get("BREVO_SENDER_NAME") ?? "Kansadco";
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "accept": "application/json",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: { email: senderEmail, name: senderName },
      ...message,
      headers: { ...message.headers, "Idempotency-Key": idempotencyKey },
    }),
  });

  const payload = await response.json().catch(() => ({})) as { messageId?: string; message?: string; code?: string };
  if (!response.ok || !payload.messageId) {
    const detail = payload.message || payload.code || `HTTP ${response.status}`;
    throw new Error(`Brevo rejected the message: ${detail}`);
  }
  return payload.messageId;
};

export const sendEnquiryEmails = async (
  enquiry: EnquiryEmailRecord,
  notificationEmail: string,
  existingNotificationMessageId?: string | null,
): Promise<EmailDeliveryResult> => {
  const receivedAt = formatDate(enquiry.created_at);
  const safe = {
    name: escapeHtml(enquiry.name),
    email: escapeHtml(enquiry.email),
    phone: escapeHtml(enquiry.phone || "Not provided"),
    subject: escapeHtml(enquiry.subject),
    message: paragraphize(enquiry.message),
    source: escapeHtml(enquiry.source),
  };
  const details = `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="font-size:14px;line-height:1.65">
      <tr><td style="padding:11px 0;color:#647168;width:130px">From</td><td style="padding:11px 0;color:#13201a">${safe.name}</td></tr>
      <tr><td style="padding:11px 0;color:#647168;border-top:1px solid #e7eae7">Email</td><td style="padding:11px 0;border-top:1px solid #e7eae7"><a href="mailto:${safe.email}" style="color:#13201a">${safe.email}</a></td></tr>
      <tr><td style="padding:11px 0;color:#647168;border-top:1px solid #e7eae7">Telephone</td><td style="padding:11px 0;color:#13201a;border-top:1px solid #e7eae7">${safe.phone}</td></tr>
      <tr><td style="padding:11px 0;color:#647168;border-top:1px solid #e7eae7">Received</td><td style="padding:11px 0;color:#13201a;border-top:1px solid #e7eae7">${escapeHtml(receivedAt)}</td></tr>
    </table>
    <div style="margin-top:24px;padding:22px;border-radius:18px;background:#f1f2ef">
      <div style="font-size:10px;letter-spacing:1.7px;text-transform:uppercase;color:#647168;margin-bottom:10px">Message</div>
      <div style="font-size:14px;line-height:1.75;color:#26342d">${safe.message}</div>
    </div>`;

  const notificationMessageId = existingNotificationMessageId ?? await sendBrevoMessage({
    to: [{ email: notificationEmail, name: "Kansadco Client Relations" }],
    replyTo: { email: enquiry.email, name: enquiry.name },
    subject: `[${enquiry.source}] ${enquiry.subject}`,
    htmlContent: frame(
      `New ${safe.source.toLowerCase()} enquiry from ${safe.name}`,
      `${safe.source} · Website enquiry`,
      safe.subject,
      details,
      `Reference ${escapeHtml(enquiry.id)} · Reply to this email to contact ${safe.name}.`,
    ),
    textContent: `New ${enquiry.source} enquiry\n\nSubject: ${enquiry.subject}\nFrom: ${enquiry.name}\nEmail: ${enquiry.email}\nTelephone: ${enquiry.phone || "Not provided"}\nReceived: ${receivedAt}\n\n${enquiry.message}\n\nReference: ${enquiry.id}`,
    tags: ["website-enquiry", enquiry.source === "Private tour" ? "private-tour" : "contact"],
  }, `enquiry-notification-${enquiry.id}`);

  try {
    const websiteUrl = Deno.env.get("PUBLIC_SITE_URL") ?? "https://kansadco.com";
    const acknowledgementBody = `
      <p style="margin:0 0 18px;font-family:Georgia,Times New Roman,serif;font-size:24px;line-height:1.35;color:#13251c">Hello ${safe.name},</p>
      <p style="margin:0;font-size:15px;line-height:1.85;color:#405047">Thank you for contacting KANSADCO. Your request has been received and forwarded to our client relations team. A member of the team will review the details and get back to you using the contact information you provided.</p>
      <div style="margin-top:28px;padding:22px 24px;border-radius:20px;background:#f0f3ef;border:1px solid #e0e6e1">
        <div style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#6f7e75">Enquiry receipt</div>
        <div style="margin-top:10px;font-family:Georgia,Times New Roman,serif;font-size:24px;line-height:1.3;color:#13251c">${safe.subject}</div>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:18px;border-top:1px solid #d8dfd9">
          <tr><td style="padding-top:14px;font-size:10px;letter-spacing:1.3px;text-transform:uppercase;color:#758179">Reference</td><td align="right" style="padding-top:14px;font-size:11px;color:#314239">${escapeHtml(enquiry.id)}</td></tr>
          <tr><td style="padding-top:9px;font-size:10px;letter-spacing:1.3px;text-transform:uppercase;color:#758179">Received</td><td align="right" style="padding-top:9px;font-size:11px;color:#314239">${escapeHtml(receivedAt)} WAT</td></tr>
        </table>
      </div>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:30px"><tr>
        <td width="31%" valign="top" style="padding:16px 12px;border-top:2px solid #173b28"><div style="font-size:9px;letter-spacing:1.6px;color:#6f7e75">01</div><div style="margin-top:8px;font-size:11px;font-weight:700;letter-spacing:.7px;text-transform:uppercase;color:#193126">Received</div></td>
        <td width="3%"></td>
        <td width="31%" valign="top" style="padding:16px 12px;border-top:2px solid #173b28"><div style="font-size:9px;letter-spacing:1.6px;color:#6f7e75">02</div><div style="margin-top:8px;font-size:11px;font-weight:700;letter-spacing:.7px;text-transform:uppercase;color:#193126">Forwarded</div></td>
        <td width="3%"></td>
        <td width="32%" valign="top" style="padding:16px 12px;border-top:2px solid #cfd8d1"><div style="font-size:9px;letter-spacing:1.6px;color:#6f7e75">03</div><div style="margin-top:8px;font-size:11px;font-weight:700;letter-spacing:.7px;text-transform:uppercase;color:#193126">Personal reply</div></td>
      </tr></table>
      <div style="margin-top:28px;text-align:center"><a href="${escapeHtml(websiteUrl)}" style="display:inline-block;padding:14px 24px;border-radius:999px;background:#10251a;color:#ffffff;text-decoration:none;font-size:10px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase">Visit Kansadco</a></div>`;
    const acknowledgementMessageId = await sendBrevoMessage({
      to: [{ email: enquiry.email, name: enquiry.name }],
      replyTo: { email: notificationEmail, name: "Kansadco Client Relations" },
      subject: "Your request has been received | KANSADCO",
      htmlContent: frame(
        "Your request has been forwarded to the KANSADCO client relations team.",
        "Enquiry received · Client relations",
        "Your request is now with our team.",
        acknowledgementBody,
        `KANSADCO Engineering Nig. Ltd. · Abuja & Kano, Nigeria<br />This is an automatic confirmation sent to ${safe.email}. Reply directly to continue the conversation.`,
      ),
      textContent: `Hello ${enquiry.name},\n\nThank you for contacting KANSADCO. Your request has been received and forwarded to our client relations team. A member of the team will review the details and get back to you using the contact information you provided.\n\nENQUIRY RECEIPT\nSubject: ${enquiry.subject}\nReference: ${enquiry.id}\nReceived: ${receivedAt} WAT\n\nStatus: Received → Forwarded → Personal response\n\nYou may reply directly to this email to continue the conversation.\n\nKANSADCO Engineering Nig. Ltd.\n${websiteUrl}`,
      tags: ["website-acknowledgement"],
    }, `enquiry-acknowledgement-${enquiry.id}`);
    return { status: "Sent", notificationMessageId, acknowledgementMessageId, error: null };
  } catch (error) {
    return {
      status: "Partial",
      notificationMessageId,
      acknowledgementMessageId: null,
      error: error instanceof Error ? error.message.slice(0, 500) : "Acknowledgement email failed.",
    };
  }
};
