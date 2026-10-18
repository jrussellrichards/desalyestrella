'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { IconBrandWhatsapp } from '@tabler/icons-react'
import { whatsappLink } from '@/lib/site'

export default function WhatsAppWidget() {
    const pathname = usePathname()
    const [scrolled, setScrolled] = useState(false)

    // Aparece al bajar, para no tapar los botones del inicio de cada página
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 500)
        onScroll()
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    // En la ficha de un refugio, en móvil ya está la barra de reserva con WhatsApp
    const onPropertyPage = /^\/refugios\/[^/]+/.test(pathname || '')

    return (
        <a
            href={whatsappLink('Hola, quisiera consultar disponibilidad')}
            target="_blank"
            rel="noopener noreferrer"
            className={`fixed bottom-4 right-4 z-40 items-center gap-3 group transition-all duration-300 hover:scale-105 md:bottom-6 md:right-6 ${
                onPropertyPage ? 'hidden md:flex' : 'flex'
            } ${scrolled ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'}`}
            aria-label="Contactar por WhatsApp"
            tabIndex={scrolled ? 0 : -1}
        >
            <div className="hidden sm:block bg-white dark:bg-gray-800 shadow-lg rounded-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 border border-gray-100 dark:border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-4 group-hover:translate-x-0">
                ¿Dudas con las fechas? Escríbenos
            </div>
            <div className="bg-[#25D366] text-white p-3 md:p-4 rounded-full shadow-xl shadow-green-900/20 hover:shadow-green-900/30 transition-shadow">
                <IconBrandWhatsapp className="h-7 w-7 md:h-8 md:w-8" />
            </div>
        </a>
    )
}
