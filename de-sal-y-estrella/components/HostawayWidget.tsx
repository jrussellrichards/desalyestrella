'use client'
import React, { useEffect, useState, useCallback } from 'react'

// typings to avoid `any`
declare global {
  interface Window {
    hostawayCalendarWidget?: (opts: HostawayOptions) => void
  }
}

type ZoomableStyle = CSSStyleDeclaration & { zoom?: string }

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
      if (window.hostawayCalendarWidget) {
        window.hostawayCalendarWidget({
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
  const childStyle = child.style as ZoomableStyle
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
    if (window.hostawayCalendarWidget) {
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
    let resizeTimer: number | null = null
    const onResize = () => {
      if (resizeTimer) window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => {
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
  // create stable stringified versions for deep props so the linter can verify deps
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      {/* Estilos elegantes y con variables para contraste seguro */}
      <style>{`
        /* Namespace: hostaway-box para variables por contenedor */
        .hostaway-box {
          /* Light mode: soft off-white surface that doesn't clash with blue background */
          --ha-bg: rgba(250, 250, 252, 0.9); /* near-white, slightly cool */
          --ha-surface: rgba(255,255,255,0.9);
          --ha-text: #0f1724; /* slate-900 */
          --ha-muted: #6b7280; /* gray-500 */
          --ha-accent: #f59e0b; /* amber-500 */
          --ha-danger: #ef4444; /* red-500 */
          --ha-border: rgba(15,23,36,0.08);
          background: linear-gradient(180deg, rgba(255,255,255,0.5), rgba(250,250,252,0.85));
          backdrop-filter: blur(6px);
          color: var(--ha-text);
        }

        /* Dark mode: semi-transparent navy surface to blend with page blue */
        .dark .hostaway-box {
          --ha-bg: rgba(8,20,39,0.6); /* deep navy translucent */
          --ha-surface: rgba(6,12,28,0.6);
          --ha-text: #e6eef6; /* soft light */
          --ha-muted: #9ca3af;
          --ha-border: rgba(255,255,255,0.04);
          background: linear-gradient(180deg, rgba(6,12,28,0.5), rgba(8,20,39,0.6));
          backdrop-filter: blur(8px);
        }

        /* Wrapper spacing */
        .hostaway-wrapper {
          width: 100%;
          box-sizing: border-box;
          padding: 1.25rem;
          min-height: 360px;
          background: transparent;
        }

        /* Keep widget allowed to render, but apply gentle, scoped improvements */
        #hostaway-calendar-widget { width: 100%; }

        /* General typography inside the widget */
        .hostaway-box #hostaway-calendar-widget, .hostaway-box #hostaway-calendar-widget * {
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
          color: inherit !important;
        }

          /* Keep inner widget panels mostly untouched — avoid covering content */
          .hostaway-box #hostaway-calendar-widget > * {
            background: transparent !important;
            padding: 0 !important;
          }

          /* Make iframes visible and responsive if the widget uses one */
          .hostaway-box #hostaway-calendar-widget iframe {
            width: 100% !important;
            min-height: 320px !important;
            border: none !important;
            display: block !important;
            background: transparent !important;
          }

          /* Force direct injected children to be visible and above background */
          .hostaway-box #hostaway-calendar-widget > * {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            z-index: 50 !important;
            position: relative !important;
          }

          /* Ensure text and controls inside the widget inherit readable colors */
          .hostaway-box #hostaway-calendar-widget * {
            color: var(--ha-text) !important;
          }

        /* Headers */
        .hostaway-box #hostaway-calendar-widget h1,
        .hostaway-box #hostaway-calendar-widget h2,
        .hostaway-box #hostaway-calendar-widget h3 {
          color: var(--ha-text) !important;
          font-weight: 600 !important;
        }

        /* Buttons - neutral surface with accent on hover */
        .hostaway-box #hostaway-calendar-widget button,
        .hostaway-box #hostaway-calendar-widget .nav-button {
          background: var(--ha-surface) !important;
          color: var(--ha-text) !important;
          border: 1px solid var(--ha-border) !important;
          padding: 6px 10px !important;
          border-radius: 8px !important;
          font-weight: 600 !important;
          transition: background 160ms ease, color 160ms ease, transform 160ms ease !important;
        }

        .hostaway-box #hostaway-calendar-widget button:hover,
        .hostaway-box #hostaway-calendar-widget .nav-button:hover {
          background: var(--ha-accent) !important;
          color: #fff !important;
          border-color: var(--ha-accent) !important;
          transform: translateY(-1px) !important;
        }

        /* Clear/reset actions - make them visible */
        .hostaway-box #hostaway-calendar-widget .clear-button,
        .hostaway-box #hostaway-calendar-widget button[class*="clear"],
        .hostaway-box #hostaway-calendar-widget [data-action*="clear"],
        .hostaway-box #hostaway-calendar-widget [aria-label*="clear"],
        .hostaway-box #hostaway-calendar-widget [aria-label*="limpiar"] {
          background: var(--ha-danger) !important;
          color: #fff !important;
          border-color: var(--ha-danger) !important;
        }

        /* Days: neutral surface for available, muted for blocked, accent for selected */
        .hostaway-box #hostaway-calendar-widget .available,
        .hostaway-box #hostaway-calendar-widget [data-available="true"],
        .hostaway-box #hostaway-calendar-widget td.available {
          background: transparent !important;
          color: var(--ha-text) !important;
          border-radius: 8px !important;
          padding: 6px !important;
        }

        .hostaway-box #hostaway-calendar-widget .available:hover,
        .hostaway-box #hostaway-calendar-widget [data-available="true"]:hover,
        .hostaway-box #hostaway-calendar-widget td.available:hover {
          background: var(--ha-accent) !important;
          color: #fff !important;
        }

        .hostaway-box #hostaway-calendar-widget .unavailable,
        .hostaway-box #hostaway-calendar-widget [data-available="false"],
        .hostaway-box #hostaway-calendar-widget td.unavailable,
        .hostaway-box #hostaway-calendar-widget .blocked {
          background: transparent !important;
          color: var(--ha-muted) !important;
          text-decoration: line-through !important;
          opacity: 0.9 !important;
        }

        .hostaway-box #hostaway-calendar-widget .selected,
        .hostaway-box #hostaway-calendar-widget [data-selected="true"],
        .hostaway-box #hostaway-calendar-widget td.selected {
          background: var(--ha-accent) !important;
          color: #fff !important;
          border-radius: 8px !important;
        }

        /* Prices / badges */
        .hostaway-box #hostaway-calendar-widget .price,
        .hostaway-box #hostaway-calendar-widget .price-display,
        .hostaway-box #hostaway-calendar-widget [class*="price"] {
          color: #059669 !important; /* green-600 */
          font-weight: 700 !important;
          font-size: 0.78rem !important;
        }

        /* Ensure links and misc text are visible */
        .hostaway-box #hostaway-calendar-widget a,
        .hostaway-box #hostaway-calendar-widget span,
        .hostaway-box #hostaway-calendar-widget p {
          color: var(--ha-text) !important;
        }

        /* Responsive tweaks */
        @media (max-width: 768px) {
          .hostaway-wrapper { padding: 1rem; min-height: 300px; }
          .hostaway-box #hostaway-calendar-widget > * > * { padding: 0.5rem !important; }
        }
      `}</style>

      <div className="hostaway-box bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-visible">
        <div className="hostaway-wrapper w-full">
          <div id="hostaway-calendar-widget" />
        </div>
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
