export default defineEventHandler(async (event) => {
  console.log("Received contact form submission");
  const body = await readBody(event);

  try {
    const response = await $fetch(
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
    return response;
  } catch (error: any) {
    console.error("Error forwarding to n8n:", error);
    if (error.data) {
      console.error("Error response body:", error.data);
    }
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to send message",
    });
  }
});
