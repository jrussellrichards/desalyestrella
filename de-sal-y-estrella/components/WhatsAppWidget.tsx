'use client'

import { IconBrandWhatsapp } from '@tabler/icons-react'

export default function WhatsAppWidget() {
    return (
        <a
            href="https://wa.me/56990736569"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 group transition-transform hover:scale-105"
            aria-label="Contactar por WhatsApp"
        >
            <div className="hidden sm:block bg-white dark:bg-gray-800 shadow-lg rounded-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 border border-gray-100 dark:border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-4 group-hover:translate-x-0">
                ¿Dudas con las fechas? Te respondo en 2 minutos
            </div>
            <div className="bg-[#25D366] text-white p-4 rounded-full shadow-xl shadow-green-900/20 hover:shadow-green-900/30 transition-shadow">
                <IconBrandWhatsapp size={32} />
            </div>
        </a>
    )
}
