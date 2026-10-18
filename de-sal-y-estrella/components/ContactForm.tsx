'use client'
import { useState } from 'react'
import { trackEvent } from '@/lib/analytics'
import { whatsappLink } from '@/lib/site'

export default function ContactForm({ defaultEmail }: { defaultEmail?: string }) {
  const [state, setState] = useState<'idle'|'sending'|'ok'|'error'>('idle')
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const form = e.currentTarget as HTMLFormElement
    const data = new FormData(form)
    setState('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
            message: data.get('message')
        })
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setState('ok')
      trackEvent('generate_lead', { form: 'contacto' })
      form.reset()
    } catch {
      setState('error')
    }
  }
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre</label>
        <input id="name" name="name" required className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-gold-500 focus:ring-gold-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100" />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
        <input id="email" type="email" name="email" required className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-gold-500 focus:ring-gold-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100" />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mensaje</label>
        <textarea id="message" name="message" required rows={5} className="mt-1 w-full resize-none rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-gold-500 focus:ring-gold-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100" />
      </div>
      <div className="flex items-center gap-4">
        <button disabled={state==='sending'||state==='ok'} className="rounded-md bg-navy-900 px-5 py-2 text-sm font-semibold text-white shadow transition hover:bg-navy-800 disabled:opacity-60">
          {state==='sending' ? 'Enviando...' : state==='ok' ? 'Enviado' : 'Enviar'}
        </button>
        {state==='error' && (
          <p className="text-xs font-medium text-red-600">
            No pudimos enviar tu mensaje.{' '}
            <a href={whatsappLink('Hola, quisiera consultar por una estadía')} target="_blank" rel="noopener noreferrer" className="underline">
              Escríbenos por WhatsApp
            </a>
            .
          </p>
        )}
        {state==='ok' && <p className="text-xs font-medium text-emerald-600">Recibido. Te responderemos pronto.</p>}
      </div>
      <p className="text-[11px] text-gray-500 dark:text-gray-400">
        También puedes escribirnos directo a {defaultEmail || 'nuestro email'}.
      </p>
    </form>
  )
}