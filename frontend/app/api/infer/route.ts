import { NextResponse } from 'next/server'

// Proxy POST /api/infer -> ML backend
// Body: { type: 'diabetes'|'heart'|'parkinsons', payload: Record<string, any> }
export async function POST(req: Request) {
  try {
    const { type, payload } = await req.json()

    if (!type || !payload || typeof type !== 'string') {
      return NextResponse.json({ error: 'Invalid body. Expect { type, payload }' }, { status: 400 })
    }

    const baseUrl = process.env.ML_API_URL || 'http://127.0.0.1:5001'

    // Map type -> Flask endpoint
    const endpointMap: Record<string, string> = {
      diabetes: '/predict/diabetes',
      heart: '/predict/heart',
      parkinsons: '/predict/parkinsons',
    }

    const path = endpointMap[type]
    if (!path) {
      return NextResponse.json({ error: `Unsupported type: ${type}` }, { status: 400 })
    }

    const url = `${baseUrl}${path}`

    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const text = await resp.text()

    // Try to parse JSON; if not JSON, pass back raw text
    let data: any
    try {
      data = JSON.parse(text)
    } catch {
      data = { raw: text }
    }

    return NextResponse.json({ ok: resp.ok, status: resp.status, data })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Inference proxy error' }, { status: 500 })
  }
}