'use client'
import React, { useEffect, useState, useCallback } from 'react'

type HostawayOptions = {
  baseUrl?: string
  listingId: number
  numberOfMonths?: number
  openInNewTab?: boolean
  font?: string
  rounded?: boolean
  button?: { action?: string; text?: string }
  clearButtonText?: string
  color?: { mainColor?: string; frameColor?: string; textColor?: string }
}

export default function HostawayWidget(props: HostawayOptions) {
  const [loadError, setLoadError] = useState(false)
  const [retryKey, setRetryKey] = useState(0)

  const tryReload = useCallback(() => {
    setLoadError(false)
    setRetryKey(k => k + 1)
  }, [])

  useEffect(() => {
    const init = () => {
      if ((window as any).hostawayCalendarWidget) {
        ;(window as any).hostawayCalendarWidget({
          baseUrl: props.baseUrl,
          listingId: props.listingId,
          numberOfMonths: props.numberOfMonths,
          openInNewTab: props.openInNewTab,
          font: props.font,
          rounded: props.rounded,
          button: props.button,
          clearButtonText: props.clearButtonText,
          color: props.color
        })
      }
    }

    // Ajuste simplificado - solo si es realmente necesario
    const adjustScale = () => {
      const wrapper = document.getElementById('hostaway-calendar-widget') as HTMLElement | null
      if (!wrapper) return
      const child = wrapper.firstElementChild as HTMLElement | null
      if (!child) return

      // Limpiar estilos que puedan causar problemas
      const childStyle = child.style
      childStyle.transform = ''
      childStyle.zoom = ''
      childStyle.position = ''
      childStyle.zIndex = ''
      
      // Permitir que el widget use su layout natural
      wrapper.style.height = 'auto'
      wrapper.style.overflow = 'visible'
      
      // Solo aplicar max-width para responsive
      childStyle.maxWidth = '100%'
      childStyle.width = 'auto'
    }

    let observer: MutationObserver | null = null
    const startObserving = () => {
      const wrapper = document.getElementById('hostaway-calendar-widget')
      if (!wrapper) return
      // run immediate adjust in case content is already present
      adjustScale()
      // observe for children added/changed so we can adjust when the widget injects markup
      observer = new MutationObserver(() => {
        // slight debounce
        setTimeout(adjustScale, 80)
      })
      observer.observe(wrapper, { childList: true, subtree: true, attributes: true })
    }

    const SCRIPT_ID = 'hostaway-calendar-script'
    // Remove any previously injected script when retrying to force reload
    const prev = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null
    if (prev) {
      prev.remove()
    }

    // If widget already available, initialize immediately
    if ((window as any).hostawayCalendarWidget) {
      init()
      return
    }

    const script = document.createElement('script')
    script.id = SCRIPT_ID
    // load via local proxy to avoid CORS errors from the CDN
    script.src = '/api/proxy-hostaway'
    script.async = true
    // keep default attributes; script now served from same origin
    script.onload = () => {
      setLoadError(false)
      init()
      // Un solo ajuste después de que se cargue
      setTimeout(() => {
        adjustScale()
        startObserving()
      }, 500)
    }
    script.onerror = (ev) => {
      console.error('Hostaway calendar script failed to load', ev)
      setLoadError(true)
    }
    document.body.appendChild(script)

    // debounced resize handler
    let resizeTimer: any = null
    const onResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        adjustScale()
      }, 140)
    }
    window.addEventListener('resize', onResize)

    return () => {
      // cleanup only the script we added
      const s = document.getElementById(SCRIPT_ID)
      if (s) s.remove()
      if (observer) {
        observer.disconnect()
        observer = null
      }
      window.removeEventListener('resize', onResize)
    }
    // retryKey allows re-running effect to attempt reloads
  }, [
    props.baseUrl,
    props.listingId,
    props.numberOfMonths,
    props.openInNewTab,
    props.font,
    props.rounded,
    JSON.stringify(props.button || {}),
    props.clearButtonText,
    JSON.stringify(props.color || {}),
    retryKey
  ])

  // Fallback link if the widget cannot be loaded (e.g., 403)
  const fallbackUrl = props.baseUrl || '#'

  return (
    <div>
      {/* Estilos simplificados para evitar interferencias */}
      <style>{`
        /* Contenedor principal - minimalista */
        .hostaway-wrapper { 
          width: 100%; 
          position: relative; 
          padding: 1rem;
          background: transparent;
        }

        /* Widget principal - permitir que use sus estilos nativos */
        #hostaway-calendar-widget { 
          width: 100%; 
          background: transparent !important;
        }
        
        /* No sobreescribir demasiado, solo mejorar tipografía */
        #hostaway-calendar-widget * { 
          font-family: 'Inter', 'Segoe UI', system-ui, sans-serif !important;
        }

        /* Mejorar solo la navegación y botones */
        #hostaway-calendar-widget button {
          border-radius: 6px !important;
          transition: all 0.2s ease !important;
        }

        #hostaway-calendar-widget button:hover {
          background: #f59e0b !important;
          color: white !important;
        }

        /* Mejorar días seleccionables */
        #hostaway-calendar-widget .available:hover,
        #hostaway-calendar-widget [data-available="true"]:hover {
          background: #f59e0b !important;
          color: white !important;
        }

        /* Responsive simple */
        @media (max-width: 768px) {
          .hostaway-wrapper {
            padding: 0.5rem;
          }
        }
      `}</style>

      <div className="hostaway-wrapper w-full">
        <div id="hostaway-calendar-widget" />
      </div>

      {loadError && (
        <div className="mt-3 rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
          <p>El calendario no pudo cargarse desde el proveedor (error 403 o bloqueado).</p>
          <div className="mt-2 flex gap-2">
            <a
              href={fallbackUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded bg-amber-600 px-3 py-1 text-xs font-semibold text-white hover:bg-amber-500"
            >
              Abrir página de reservas
            </a>
            <button
              onClick={tryReload}
              className="rounded border border-gray-300 bg-white px-3 py-1 text-xs hover:bg-gray-50"
            >
              Reintentar
            </button>
          </div>
          <p className="mt-2 text-xs text-rose-600">Si el problema persiste, verifica la URL del script o restricciones del CDN.</p>
        </div>
      )}
    </div>
  )
}
