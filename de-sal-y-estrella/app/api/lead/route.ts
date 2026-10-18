import { NextResponse } from 'next/server'
import { isEmail, sendNotificationEmail } from '@/lib/mailer'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    if (!isEmail(email)) {
      return NextResponse.json({ ok: false }, { status: 400 })
    }
    const sent = await sendNotificationEmail({
      subject: 'Nuevo suscriptor desde la web',
      text: `Quiere recibir disponibilidad y novedades: ${email}`,
      replyTo: email,
    })
    return NextResponse.json({ ok: sent }, { status: sent ? 200 : 503 })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
