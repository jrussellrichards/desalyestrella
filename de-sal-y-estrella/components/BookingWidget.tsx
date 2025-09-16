'use client'

// Este componente toma un string de HTML (el código del widget de tu PMS)
// y lo renderiza de forma segura en la página.
// Usamos 'dangerouslySetInnerHTML' porque confiamos en la fuente del código (tu PMS).
export default function BookingWidget({ htmlCode }: { htmlCode: string }) {
  // Si no hay código de widget en el CMS, mostramos un mensaje amigable.
  if (!htmlCode) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center dark:border-gray-700 dark:bg-gray-800">
        <p className="text-gray-500">
          El motor de reservas estará disponible próximamente.
        </p>
      </div>
    )
  }

  return <div dangerouslySetInnerHTML={{ __html: htmlCode }} />
}
