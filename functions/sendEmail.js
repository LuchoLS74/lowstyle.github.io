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
        return new Response(JSON.stringify({ 
          error: "Configuración del servidor faltante" 
        }), { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const YOUR_EMAIL = "luciianog11@gmail.com";

      // Adjuntos (si subieron comprobante) - SIN usar Buffer
      let attachments = [];
      if (receipt && receipt.name && receipt.size > 0) {
        try {
          // Usar ArrayBuffer y convertir a base64 manualmente
          const arrayBuffer = await receipt.arrayBuffer();
          const bytes = new Uint8Array(arrayBuffer);
          
          // Convertir a base64 sin Buffer
          let base64 = '';
          const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
          
          for (let i = 0; i < bytes.length; i += 3) {
            const a = bytes[i];
            const b = bytes[i + 1] || 0;
            const c = bytes[i + 2] || 0;
            
            const bitmap = (a << 16) | (b << 8) | c;
            
            base64 += chars.charAt((bitmap >> 18) & 63);
            base64 += chars.charAt((bitmap >> 12) & 63);
            base64 += bytes[i + 1] !== undefined ? chars.charAt((bitmap >> 6) & 63) : '=';
            base64 += bytes[i + 2] !== undefined ? chars.charAt(bitmap & 63) : '=';
          }

          attachments.push({
            filename: receipt.name,
            content: base64,
            content_type: receipt.type || "application/octet-stream"
          });
        } catch (attachError) {
          console.error("Error procesando archivo:", attachError);
          // Continuar sin adjunto si hay error
        }
      }

      // Enviar mail con Resend
      const emailData = {
        // Usar dominio verificado o sandbox
        from: "onboarding@resend.dev", // Cambiar por tu dominio verificado
        to: [YOUR_EMAIL],
        subject: "Nueva solicitud VIP - Low Style MTA",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #A52A2A;">🎮 Nueva solicitud de VIP - Low Style</h2>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>👤 Usuario MTA SA:</strong> ${username}</p>
              <p><strong>💳 Alias de pago:</strong> ${alias}</p>
              <p><strong>📅 Fecha:</strong> ${new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })}</p>
              <p><strong>📎 Comprobante:</strong> ${attachments.length > 0 ? 'Adjunto en el email' : '❌ Sin comprobante'}</p>
            </div>
            <p style="color: #666;">Este email fue enviado automáticamente desde el formulario VIP de lowstylemta.pages.dev</p>
          </div>
        `,
        attachments: attachments.length > 0 ? attachments : undefined
      };

      console.log("Enviando email a Resend...");

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
          details: res.status + ": " + responseData
        }), { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Respuesta exitosa
      return new Response(JSON.stringify({ 
        success: true,
        message: "Email enviado correctamente" 
      }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ 
      error: "Formato de datos incorrecto" 
    }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error("Error en sendEmail:", error);
    return new Response(JSON.stringify({ 
      error: "Error interno del servidor",
      details: error.message 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}


