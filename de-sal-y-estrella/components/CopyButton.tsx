'use client'

import { useState } from 'react'
import { IconCheck, IconCopy } from '@tabler/icons-react'

export default function CopyButton({ value, label = 'Copiar' }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false)

  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(value).then(
          () => {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
          },
          () => {},
        )
      }}
      className="inline-flex items-center gap-1.5 rounded-full bg-sea-50 px-3 py-1.5 text-sm font-semibold text-sea-700 transition hover:bg-sea-100"
    >
      {copied ? <IconCheck className="h-4 w-4" /> : <IconCopy className="h-4 w-4" />}
      {copied ? 'Copiada' : label}
    </button>
  )
}
