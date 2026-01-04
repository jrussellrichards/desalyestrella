"use client"
import { useEffect } from 'react'

export default function ErrorBoundary({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Algo salió mal</h1>
      <p className="mt-4 text-gray-600 dark:text-gray-400">No pudimos cargar este refugio. Intenta de nuevo.</p>
      <button
        onClick={() => reset()}
        className="mt-6 rounded-md bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        Reintentar
      </button>
    </div>
  )
}
