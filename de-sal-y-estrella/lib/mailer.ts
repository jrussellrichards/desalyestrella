// Envío de correos vía Resend (https://resend.com). Requiere en Vercel:
//   RESEND_API_KEY      clave de la API de Resend
//   CONTACT_TO_EMAIL    correo donde quieres recibir los mensajes
//   CONTACT_FROM_EMAIL  remitente verificado en Resend (opcional)
export async function sendNotificationEmail({
  subject,
  text,
  replyTo,
}: {
  subject: string
  text: string
  replyTo?: string
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_TO_EMAIL
  if (!apiKey || !to) {
    console.error('[mailer] Falta RESEND_API_KEY o CONTACT_TO_EMAIL')
    return false
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || 'De Sal y Estrella <onboarding@resend.dev>',
      to: [to],
      subject,
      text,
      reply_to: replyTo,
    }),
  })
  if (!res.ok) console.error('[mailer] Resend respondió', res.status, await res.text())
  return res.ok
}

export function isEmail(value: unknown): value is string {
  return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length < 200
}
