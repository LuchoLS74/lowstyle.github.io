export async function onRequestPost(context) {
  const contentType = context.request.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await context.request.formData();

    const username = formData.get("username");
    const alias = formData.get("alias");
    const receipt = formData.get("receipt");

    const RESEND_API_KEY = context.env.RESEND_API_KEY;
    const YOUR_EMAIL = "luciianog11@gmail.com";

    // Adjuntos (si subieron comprobante)
    let attachments = [];
    if (receipt && receipt.name) {
      const arrayBuffer = await receipt.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString("base64");

      attachments.push({
        filename: receipt.name,
        content: base64
      });
    }

    // Enviar mail con Resend
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "VIP LowStyle <noreply@lowstyle.com>",
        to: [YOUR_EMAIL],
        subject: "Nueva compra de VIP (alias)",
        html: `
          <p>El jugador <b>${username}</b> envió comprobante de pago.</p>
          <p>Alias: <b>${alias}</b></p>
        `,
        attachments
      })
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  }

  return new Response("Bad Request", { status: 400 });
}


