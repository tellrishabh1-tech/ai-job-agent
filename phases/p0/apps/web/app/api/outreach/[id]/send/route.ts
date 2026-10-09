import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email-sender";
import { outreachLogs } from "@/lib/outreach-store";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  let body: Record<string, unknown> = {};
  try { body = await request.json(); } catch {}

  // Find the log entry. A draft created on a different serverless instance
  // can be supplied by the browser as a local draft payload.
  const storedLog = outreachLogs.find((l) => l.id === id);
  const log = storedLog ?? (
    body.body_html || body.body_text
      ? {
          id,
          recipient_email: body.to_email ?? "",
          recipient_name: body.to_name ?? "Hiring Manager",
          subject: body.subject ?? "Opportunity",
          body_html: body.body_html ?? "",
          body_text: body.body_text ?? "",
          status: "draft",
          delivery_status: "pending",
          sent_at: new Date().toISOString(),
        }
      : undefined
  );
  if (!log) {
    return NextResponse.json({ error: "Outreach log not found" }, { status: 404 });
  }

  const toEmail = String(body.to_email ?? log.recipient_email ?? "");
  const toName = String(body.to_name ?? log.recipient_name ?? "Hiring Manager");
  const subject = String(body.subject ?? log.subject ?? "Opportunity");

  // Send the email
  const result = await sendEmail({
    toEmail,
    toName,
    subject,
    bodyHtml: (log.body_html as string) || "",
    bodyText: (log.body_text as string) || "",
  });

  // Update log
  if (result.success) {
    log.status = "sent";
    log.delivery_status = "delivered";
    log.sent_at = new Date().toISOString();
    return NextResponse.json({ status: "sent", messageId: result.messageId, logId: id, sentAt: log.sent_at });
  } else {
    log.status = "failed";
    log.error_message = result.error || "Unknown error";
    return NextResponse.json({ status: "failed", error: result.error });
  }
}
