'use client'
import { useState } from 'react'

export default function EmailCapture() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle'|'loading'|'ok'|'error'>('idle')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || status === 'loading') return
    setStatus('loading')
    try {
      // Endpoint futuro (ajusta cuando exista)
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ email })
      })
      setStatus('ok')
      setEmail('')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Recibe disponibilidad y nuevas aperturas
      </h3>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
        1–2 emails al mes. Nada de spam, solo inspiración y fechas clave.
      </p>
      <form onSubmit={submit} className="mt-5 flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="newsletter-email">Correo</label>
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          placeholder="tu@email..."
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
        />
        <button
          type="submit"
            disabled={status === 'loading' || status === 'ok'}
          className="inline-flex items-center justify-center rounded-md bg-amber-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-amber-500 disabled:opacity-60 disabled:hover:bg-amber-600"
        >
          {status === 'loading' && 'Enviando…'}
          {status === 'idle' && 'Unirme'}
          {status === 'ok' && '¡Listo!'}
          {status === 'error' && 'Reintentar'}
        </button>
      </form>
      <div className="mt-2 min-h-[20px]">
        {status === 'ok' && (
          <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
            Te añadimos. Revisa tu bandeja (y spam).
          </p>
        )}
        {status === 'error' && (
          <p className="text-xs font-medium text-red-600 dark:text-red-400">
            Ocurrió un error. Intenta más tarde.
          </p>
        )}
      </div>
      <p className="mt-4 text-[11px] tracking-wide text-gray-500 dark:text-gray-400">
        Puedes darte de baja en cualquier momento.
      </p>
    </div>
  )
}