export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800">
      <div className="mx-auto max-w-7xl px-4 py-6 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} De Sal y Estrella. Todos los derechos
          reservados.
        </p>
      </div>
    </footer>
  )
}
