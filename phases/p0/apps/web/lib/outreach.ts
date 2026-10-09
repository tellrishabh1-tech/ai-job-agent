export interface OutreachQueueItem {
  id: string;
  companyName: string;
  jobTitle: string;
  recipientEmail: string;
  recipientName: string;
  subject: string;
  status: "draft" | "queued" | "sent" | "failed";
  createdAt: string;
  errorMessage?: string;
}

export interface OutreachDeliveryEntry {
  id: string;
  companyName: string;
  jobTitle: string;
  recipientEmail: string;
  recipientName: string;
  subject: string;
  sentAt: string;
  status: string;
  deliveryStatus: string;
  errorMessage?: string;
}

export interface OutreachLogResponse {
  id: string;
  application_id: string;
  user_id: string;
  recipient_email: string;
  recipient_name: string;
  company_name: string;
  job_title: string;
  subject: string;
  subject_hash: string;
  status: string;
  delivery_status: string;
  error_message: string | null;
  body_html: string;
  body_text: string;
  sent_at: string;
  opened_at: string | null;
  replied_at: string | null;
}

export interface OutreachStatsResponse {
  total: number;
  sent: number;
  opened: number;
  replied: number;
  bounced: number;
  failed: number;
  open_rate: number;
  reply_rate: number;
  bounce_rate: number;
  hourly_remaining: number;
  daily_remaining: number;
}

interface OutreachLogsResponse {
  logs: OutreachLogResponse[];
  total: number;
}

export function toQueueItem(log: OutreachLogResponse): OutreachQueueItem {
  return {
    id: log.id,
    companyName: log.company_name || "",
    jobTitle: log.job_title || "",
    recipientEmail: log.recipient_email || "",
    recipientName: log.recipient_name || "",
    subject: log.subject,
    status: mapQueueStatus(log),
    createdAt: log.sent_at,
    errorMessage: log.error_message || undefined,
  };
}

export function toDeliveryEntry(log: OutreachLogResponse): OutreachDeliveryEntry {
  return {
    id: log.id,
    companyName: log.company_name || "",
    jobTitle: log.job_title || "",
    recipientEmail: log.recipient_email || "",
    recipientName: log.recipient_name || "",
    subject: log.subject,
    sentAt: log.sent_at,
    status: log.status,
    deliveryStatus: log.delivery_status || log.status,
    errorMessage: log.error_message || undefined,
  };
}

export async function getOutreachStats(): Promise<OutreachStatsResponse> {
  const stats = await fetchJson<OutreachStatsResponse>("/api/outreach/stats");
  const localLogs = readLocalDrafts();
  const localSent = localLogs.filter((log) => log.status === "sent");
  const localOpened = localLogs.filter((log) => log.delivery_status === "opened");
  const localReplied = localLogs.filter((log) => log.delivery_status === "replied");
  const localBounced = localLogs.filter((log) => log.delivery_status === "bounced");
  const localFailed = localLogs.filter((log) => log.status === "failed");
  const localTotal = localLogs.length;
  const total = stats.total + localTotal;
  const sent = stats.sent + localSent.length;
  const opened = stats.opened + localOpened.length;
  const replied = stats.replied + localReplied.length;
  const bounced = stats.bounced + localBounced.length;

  return {
    ...stats,
    total,
    sent,
    opened,
    replied,
    bounced,
    failed: stats.failed + localFailed.length,
    open_rate: total > 0 ? Math.round((opened / total) * 100) : 0,
    reply_rate: total > 0 ? Math.round((replied / total) * 100) : 0,
    bounce_rate: total > 0 ? Math.round((bounced / total) * 100) : 0,
  };
}

export async function getOutreachLogs(options?: {
  status?: string;
  limit?: number;
  offset?: number;
}): Promise<OutreachLogResponse[]> {
  const params = new URLSearchParams();
  if (options?.status) {
    params.set("status", options.status);
  }
  if (typeof options?.limit === "number") {
    params.set("limit", String(options.limit));
  }
  if (typeof options?.offset === "number") {
    params.set("offset", String(options.offset));
  }

  const query = params.toString();
  const data = await fetchJson<OutreachLogsResponse>(
    `/api/outreach/logs${query ? `?${query}` : ""}`,
  );
  const serverLogs = data.logs ?? [];
  const localLogs = readLocalDrafts();
  const serverIds = new Set(serverLogs.map((log) => log.id));
  return [...serverLogs, ...localLogs.filter((log) => !serverIds.has(log.id))];
}

function mapQueueStatus(log: OutreachLogResponse): OutreachQueueItem["status"] {
  if (log.status === "draft") {
    return "draft";
  }
  if (log.status === "failed") {
    return "failed";
  }
  if (log.delivery_status === "pending") {
    return "queued";
  }
  return "sent";
}

function formatRecipient(log: OutreachLogResponse): string {
  if (log.recipient_name && log.recipient_email) {
    return `${log.recipient_name} <${log.recipient_email}>`;
  }
  return log.recipient_name || log.recipient_email || "Unknown recipient";
}

export async function sendOutreach(
  id: string,
  overrides?: { toEmail?: string; toName?: string; subject?: string },
): Promise<{ status: string; messageId?: string; logId?: string; sentAt?: string; error?: string }> {
  const body: Record<string, string> = {};
  if (overrides?.toEmail) body.to_email = overrides.toEmail;
  if (overrides?.toName) body.to_name = overrides.toName;
  if (overrides?.subject) body.subject = overrides.subject;
  const localDraft = readLocalDrafts().find((draft) => draft.id === id);
  if (localDraft) {
    body.body_html = localDraft.body_html;
    body.body_text = localDraft.body_text;
  }

  const res = await fetch(`/api/outreach/${id}/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    let message = res.statusText || "Failed to send";
    try {
      const payload = (await res.json()) as { error?: string; detail?: string };
      message = payload.error ?? payload.detail ?? message;
    } catch {
      // Ignore non-JSON bodies
    }
    throw new Error(message);
  }
  const result = await res.json() as { status: string; messageId?: string; logId?: string; sentAt?: string; error?: string };
  if (typeof window !== "undefined" && result.status === "sent") {
    const updatedDrafts = readLocalDrafts().map((draft) =>
      draft.id === id
        ? { ...draft, status: "sent", delivery_status: "delivered", sent_at: result.sentAt ?? new Date().toISOString() }
        : draft,
    );
    window.localStorage.setItem(
      "outreach:drafts",
      JSON.stringify(updatedDrafts),
    );
  }
  return result;
}

export async function trackOutreach(
  id: string,
  event: string,
  error?: string,
): Promise<{ status: string; event: string }> {
  const params = new URLSearchParams({ event });
  if (error) params.set("error", error);
  const res = await fetch(`/api/outreach/${id}/track?${params.toString()}`, { method: "POST" });
  if (!res.ok) {
    let message = res.statusText || "Failed to track";
    try {
      const payload = (await res.json()) as { error?: string; detail?: string };
      message = payload.error ?? payload.detail ?? message;
    } catch {
      // Ignore non-JSON bodies
    }
    throw new Error(message);
  }
  return res.json() as Promise<{ status: string; event: string }>;
}

export async function cancelOutreach(id: string): Promise<{ status: string; logId?: string }> {
  const res = await fetch(`/api/outreach/${id}/cancel`, { method: "POST" });
  if (!res.ok) {
    let message = res.statusText || "Failed to cancel";
    try {
      const payload = (await res.json()) as { error?: string; detail?: string };
      message = payload.error ?? payload.detail ?? message;
    } catch {
      // Ignore non-JSON bodies
    }
    throw new Error(message);
  }
  return res.json() as Promise<{ status: string; logId?: string }>;
}

export async function generateOutreach(params: {
  applicationId: string;
  recipientName?: string;
  recipientEmail?: string;
  templateType?: string;
  job?: Record<string, unknown>;
  application?: Record<string, unknown>;
}): Promise<{ draft: { id: string; subject: string; body_html: string; body_text: string }; applicationId: string }> {
  const query = new URLSearchParams();
  query.set("application_id", params.applicationId);
  if (params.recipientName) query.set("recipient_name", params.recipientName);
  if (params.recipientEmail) query.set("recipient_email", params.recipientEmail);
  if (params.templateType) query.set("template_type", params.templateType);
  if (params.job) {
    query.set("job", JSON.stringify(params.job));
    query.set("company_name", String(params.job.company ?? ""));
    query.set("job_title", String(params.job.title ?? ""));
  }
  if (params.application) {
    query.set("application", JSON.stringify(params.application));
    if (!params.job) {
      query.set("company_name", String((params.application as Record<string, unknown>).company ?? ""));
      query.set("job_title", String((params.application as Record<string, unknown>).role ?? ""));
    }
  }

  const res = await fetch(`/api/outreach/generate?${query.toString()}`, { method: "POST" });
  if (!res.ok) {
    let message = res.statusText || "Failed to generate";
    try {
      const payload = (await res.json()) as { error?: string; detail?: string };
      message = payload.error ?? payload.detail ?? message;
    } catch {
      // Ignore non-JSON bodies
    }
    throw new Error(message);
  }
  const result = await res.json() as {
    draft: { id: string; subject: string; body_html: string; body_text: string };
    applicationId: string;
  };

  if (typeof window !== "undefined") {
    const localDraft: OutreachLogResponse = {
      id: result.draft.id,
      application_id: result.applicationId,
      user_id: "local",
      recipient_email: params.recipientEmail ?? "",
      recipient_name: params.recipientName ?? "Hiring Manager",
      company_name: String(params.job?.company ?? ""),
      job_title: String(params.job?.title ?? ""),
      subject: result.draft.subject,
      subject_hash: "",
      status: "draft",
      delivery_status: "pending",
      error_message: null,
      body_html: result.draft.body_html,
      body_text: result.draft.body_text,
      sent_at: new Date().toISOString(),
      opened_at: null,
      replied_at: null,
    };
    const drafts = readLocalDrafts().filter((draft) => draft.id !== localDraft.id);
    window.localStorage.setItem("outreach:drafts", JSON.stringify([...drafts, localDraft]));
  }

  return result;
}

function readLocalDrafts(): OutreachLogResponse[] {
  if (typeof window === "undefined") return [];
  try {
    const value = JSON.parse(window.localStorage.getItem("outreach:drafts") ?? "[]");
    return Array.isArray(value) ? value as OutreachLogResponse[] : [];
  } catch {
    return [];
  }
}

async function fetchJson<T>(input: RequestInfo | URL): Promise<T> {
  const response = await fetch(input, { cache: "no-store" });
  if (!response.ok) {
    let message = response.statusText || "Request failed";
    try {
      const payload = (await response.json()) as { error?: string; detail?: string };
      message = payload.error ?? payload.detail ?? message;
    } catch {
      // Ignore non-JSON error bodies.
    }
    throw new Error(message);
  }

  try {
    return (await response.json()) as T;
  } catch {
    throw new Error("Unexpected response from server");
  }
}
