export async function onRequestPost(context) {
  try {
    const contentType = context.request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await context.request.formData();

      const username = formData.get("username");
      const alias = formData.get("alias");
      const receipt = formData.get("receipt");

      // Verificar que tienes la variable de entorno configurada
      const RESEND_API_KEY = context.env.RESEND_API_KEY;
      
      if (!RESEND_API_KEY) {
        console.error("RESEND_API_KEY no está configurada");
        return new Response(JSON.stringify({ error: "Configuración del servidor faltante" }), { status: 500 });
      }

      const YOUR_EMAIL = "luciianog11@gmail.com";

      // Adjuntos (si subieron comprobante)
      let attachments = [];
      if (receipt && receipt.name && receipt.size > 0) {
        const arrayBuffer = await receipt.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString("base64");

        attachments.push({
          filename: receipt.name,
          content: base64,
          // Agregar el tipo de contenido
          content_type: receipt.type || "application/octet-stream"
        });
      }

      // Enviar mail con Resend
      const emailData = {
        // IMPORTANTE: El dominio 'from' debe estar verificado en Resend
        // Si no tienes dominio verificado, usa el dominio sandbox de Resend
        from: "onboarding@resend.dev", // Cambiar este email
        to: [YOUR_EMAIL],
        subject: "Nueva compra de VIP - Low Style",
        html: `
          <h2>Nueva solicitud de VIP</h2>
          <p><strong>Usuario MTA SA:</strong> ${username}</p>
          <p><strong>Alias de pago:</strong> ${alias}</p>
          <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-AR')}</p>
          ${attachments.length > 0 ? '<p><strong>Comprobante:</strong> Adjunto en el email</p>' : '<p><em>Sin comprobante adjunto</em></p>'}
        `,
        attachments: attachments.length > 0 ? attachments : undefined
      };

      console.log("Enviando email:", emailData);

      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(emailData)
      });

      const responseData = await res.text();
      console.log("Respuesta de Resend:", res.status, responseData);

      if (!res.ok) {
        console.error("Error de Resend:", responseData);
        return new Response(JSON.stringify({ 
          error: "Error al enviar el email",
          details: responseData 
        }), { status: 500 });
      }

      return new Response(JSON.stringify({ 
        success: true,
        message: "Email enviado correctamente" 
      }), { 
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    return new Response(JSON.stringify({ error: "Formato de datos incorrecto" }), { status: 400 });
    
  } catch (error) {
    console.error("Error en sendEmail:", error);
    return new Response(JSON.stringify({ 
      error: "Error interno del servidor",
      details: error.message 
    }), { status: 500 });
  }
}


