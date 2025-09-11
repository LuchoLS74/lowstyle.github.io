export async function onRequestPost(context) {
  const { username } = await context.request.json();

  const RESEND_API_KEY = context.env.RESEND_API_KEY;
  const YOUR_EMAIL = "luciianog11@gmail.com";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: "VIP LowStyle <noreply@lowstyle.com>",
      to: [YOUR_EMAIL],
      subject: "Nueva compra de VIP",
      html: `<p>El jugador <b>${username}</b> hizo una compra de VIP.</p>`
    })
  });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}

