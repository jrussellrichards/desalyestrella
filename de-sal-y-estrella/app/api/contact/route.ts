import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json()
    if (!name || !email || !message) {
      return NextResponse.json({ ok: false }, { status: 400 })
    }
    // TODO: integrar servicio (Resend, SendGrid, etc.)
    console.log('[CONTACTO] =>', { name, email, message })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}