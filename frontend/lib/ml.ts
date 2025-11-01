export type InferenceType = 'diabetes' | 'heart' | 'parkinsons'

export async function infer(type: InferenceType, payload: Record<string, any>) {
  const res = await fetch('/api/infer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, payload }),
  })

  const json = await res.json()
  if (!res.ok || json?.ok === false) {
    throw new Error(json?.error || 'Inference failed')
  }
  return json.data
}