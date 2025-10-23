import { NextResponse } from 'next/server'

export async function GET() {
  const remoteUrl = 'https://d2q3n06xhbi0am.cloudfront.net/calendar.js'
  try {
    const res = await fetch(remoteUrl)
    const body = await res.text()
    if (!res.ok) {
      return new NextResponse(`/* upstream error: ${res.status} */\n` + body, { status: res.status })
    }
    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type': 'application/javascript; charset=utf-8',
        // allow any origin to load the proxied script if needed
        'Access-Control-Allow-Origin': '*',
        // cache on CDN / browser for a day (adjust as needed)
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600'
      }
    })
  } catch (err) {
    return new NextResponse('/* proxy fetch failed */', { status: 502 })
  }
}
