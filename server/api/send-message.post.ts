function hasErrorData(value: unknown): value is { data: unknown } {
  return typeof value === "object" && value !== null && "data" in value;
}

export default defineEventHandler(async (event) => {
  console.log("Received contact form submission");
  const requestBody = (await readBody(event)) as unknown;
  if (typeof requestBody !== "object" || requestBody === null) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid request body",
    });
  }
  const body = requestBody as Record<string, unknown>;

  try {
    await $fetch(
      "https://n8n.farcas.xyz/webhook/bad52c1e-889e-429b-a789-89eabdb34cac",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Source-Allow": "contact",
        },
        body,
      },
    );
    return { success: true };
  } catch (error: unknown) {
    console.error("Error forwarding to n8n:", error);
    if (hasErrorData(error)) {
      console.error("Error response body:", error.data);
    }
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to send message",
    });
  }
});
