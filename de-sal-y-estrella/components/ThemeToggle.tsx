'use client'

import { useEffect, useState } from 'react'
import { IconMoon, IconSun } from '@tabler/icons-react'

const KEY = 'guia-tema'

// Se ejecuta dentro del contenedor de la guía, antes de que React lo hidrate
export const THEME_SCRIPT = `try{var t=localStorage.getItem('${KEY}');if(t)document.currentScript.parentElement.classList.add('tema-'+t)}catch(e){}`

function container() {
  return document.querySelector<HTMLElement>('[data-guia]')
}

function isDark(el: HTMLElement) {
  if (el.classList.contains('tema-oscuro')) return true
  if (el.classList.contains('tema-claro')) return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

// Botón para que el huésped cambie entre modo claro y oscuro sin tocar la configuración del celular
export default function ThemeToggle() {
  const [dark, setDark] = useState<boolean | null>(null)

  useEffect(() => {
    const el = container()
    if (el) setDark(isDark(el))
  }, [])

  return (
    <button
      type="button"
      onClick={() => {
        const el = container()
        if (!el) return
        const next = !isDark(el)
        el.classList.remove('tema-claro', 'tema-oscuro')
        el.classList.add(next ? 'tema-oscuro' : 'tema-claro')
        try {
          localStorage.setItem(KEY, next ? 'oscuro' : 'claro')
        } catch {}
        setDark(next)
      }}
      aria-label={dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-sea-50 text-sea-700 hover:bg-sea-100 dark:bg-gray-800 dark:text-amber-300"
    >
      {dark ? <IconSun className="h-5 w-5" /> : <IconMoon className="h-5 w-5" />}
    </button>
  )
}
