import Link from 'next/link'
import Image from 'next/image'
import { client } from '@/lib/sanity.client'
import { groq } from 'next-sanity'
import { fetchSettings } from '@/lib/settings'
import { AIRBNB_PROFILE_URL, AIRBNB_STATS, INSTAGRAM_URL, WHATSAPP_NUMBER, whatsappLink } from '@/lib/site'

const propertiesQuery = groq`*[_type == "property"] | order(name asc){ _id, name, "slug": slug.current }`

export default async function Footer() {
  const [properties, settings] = await Promise.all([
    client.fetch<{ _id: string; name: string; slug: string }[]>(propertiesQuery).catch(() => []),
    fetchSettings(),
  ])
  const email = settings.contactEmail

  return (
    <footer className="bg-navy-950 text-white/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <Image src="/brand/logo-horizontal-claro.png" alt="De Sal y Estrella" width={1160} height={356} className="h-14 w-auto" />
          <p className="mt-4 text-sm leading-relaxed">
            Departamentos frente al mar en Aqua Resort La Serena y cabaña en Pichilemu.
          </p>
          <p className="mt-3 text-sm">
            <span className="text-gold-400">★ {AIRBNB_STATS.averageRating.toFixed(2).replace('.', ',')}</span> en {AIRBNB_STATS.totalReviews} reseñas ·{' '}
            <a href={AIRBNB_PROFILE_URL} target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:underline">
              Superanfitriones en Airbnb
            </a>
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-gold-400">Refugios</p>
          <ul className="mt-4 space-y-2 text-sm">
            {properties.map(p => (
              <li key={p._id}>
                <Link href={`/refugios/${p.slug}`} className="hover:text-white">{p.name}</Link>
              </li>
            ))}
            <li><Link href="/refugios" className="hover:text-white">Ver todos</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-gold-400">Explora</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/experiencias/estrella" className="hover:text-white">Qué hacer en La Serena</Link></li>
            <li><Link href="/experiencias/sal" className="hover:text-white">Qué hacer en Pichilemu</Link></li>
            <li><Link href="/blog" className="hover:text-white">Guías de viaje</Link></li>
            <li><Link href="/historia" className="hover:text-white">Nuestra historia</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-gold-400">Reserva directo</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href={whatsappLink('Hola, quisiera consultar disponibilidad')} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                WhatsApp +{WHATSAPP_NUMBER.replace(/^56(\d)(\d{4})(\d{4})$/, '56 $1 $2 $3')}
              </a>
            </li>
            {email && (
              <li><a href={`mailto:${email}`} className="hover:text-white">{email}</a></li>
            )}
            <li>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white">Instagram @de_sal_y_estrella</a>
            </li>
            <li><Link href="/contacto" className="hover:text-white">Formulario de contacto</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-6 py-5 text-xs text-white/50 lg:px-8">
          &copy; {new Date().getFullYear()} De Sal y Estrella. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  )
}
