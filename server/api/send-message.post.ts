type ContactPayload = {
  name: string;
  email: string;
  message: string;
  source: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function field(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

async function verifyTurnstile(secret: string, token: string, ip?: string) {
  const result = await $fetch<{ success: boolean }>(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      body: { secret, response: token, ...(ip ? { remoteip: ip } : {}) },
    },
  );
  return result.success;
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const requestBody = (await readBody(event)) as unknown;
  if (typeof requestBody !== "object" || requestBody === null) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid request body",
    });
  }
  const body = requestBody as Record<string, unknown>;

  const payload: ContactPayload = {
    name: field(body.name, 100),
    email: field(body.email, 200),
    message: field(body.message, 1000),
    source: field(body.source, 200),
  };
  if (!payload.name || !payload.message || !EMAIL_PATTERN.test(payload.email)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid fields" });
  }

  const turnstileSecret = config.turnstile.secretKey;
  const token = field(body["cf-turnstile-response"], 2048);
  if (!turnstileSecret || !token) {
    throw createError({ statusCode: 400, statusMessage: "Captcha required" });
  }
  const human = await verifyTurnstile(
    turnstileSecret,
    token,
    getRequestIP(event, { xForwardedFor: true }),
  ).catch(() => false);
  if (!human) {
    throw createError({ statusCode: 403, statusMessage: "Captcha failed" });
  }

  try {
    const response = await $fetch<string>(config.contactWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({ ...payload, secret: config.contactWebhookSecret }),
      responseType: "text",
    });
    if (response.trim() !== "ok") {
      throw new Error(`Unexpected webhook response: ${response.slice(0, 200)}`);
    }
    return { success: true };
  } catch (error: unknown) {
    console.error("Error forwarding contact message:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to send message",
    });
  }
});
