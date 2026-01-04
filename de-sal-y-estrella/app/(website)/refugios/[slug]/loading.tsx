export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="h-6 w-1/3 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      <div className="mt-6 grid grid-cols-2 gap-2 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-video animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
        ))}
      </div>
      <div className="mt-10 space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        ))}
      </div>
    </div>
  )
}
