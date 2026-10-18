import { NextResponse } from 'next/server'
import { isEmail, sendNotificationEmail } from '@/lib/mailer'

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json()
    if (typeof name !== 'string' || !name.trim() || !isEmail(email) || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json({ ok: false }, { status: 400 })
    }
    const sent = await sendNotificationEmail({
      subject: `Nuevo mensaje web de ${name.slice(0, 80)}`,
      text: `Nombre: ${name}\nEmail: ${email}\n\n${message.slice(0, 5000)}`,
      replyTo: email,
    })
    return NextResponse.json({ ok: sent }, { status: sent ? 200 : 503 })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
