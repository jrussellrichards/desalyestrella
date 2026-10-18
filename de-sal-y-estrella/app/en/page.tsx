import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { client } from '@/lib/sanity.client'
import { groq } from 'next-sanity'
import { Property } from '@/types'
import { urlFor } from '@/lib/image'
import { hasAssetRef } from '@/utils/hasAssetRef'
import {
  IconBrandWhatsapp,
  IconStarFilled,
  IconBeach,
  IconMessageCircle,
  IconClock24,
  IconArrowRight,
  IconChevronDown,
  IconUsers,
  IconBed,
  IconBath,
} from '@tabler/icons-react'
import { AIRBNB_PROFILE_URL, AIRBNB_STATS, SITE_URL, getRating, whatsappLink } from '@/lib/site'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Beachfront stays in La Serena and Pichilemu, Chile',
  description:
    'Sea-view apartments at Aqua Resort La Serena and a cabin by the sea in Pichilemu. Airbnb Superhosts with 24/7 support on WhatsApp.',
  alternates: { canonical: `${SITE_URL}/en`, languages: { es: SITE_URL, en: `${SITE_URL}/en` } },
}

const query = groq`*[_type == "property"] | order(_createdAt asc){
  _id, name, slug, location, gallery, capacity, bedrooms, bathrooms, rating, reviewCount
}`

// Nombres y descripciones en inglés de cada refugio (el contenido de Sanity está en español).
const EN_BY_NAME: { match: RegExp; title: string; text: string; place: string }[] = [
  { match: /403/, title: 'Aqua Resort · Apartment 403', text: 'Sea-view apartment with a terrace on Avenida del Mar.', place: 'La Serena' },
  { match: /308/, title: 'Aqua Resort · Apartment 308', text: 'Bright apartment facing the sea, ideal for families.', place: 'La Serena' },
  { match: /pichilemu/i, title: 'Cabin by the sea', text: 'A cozy cabin a short walk from the beach, in the surf capital of Chile.', place: 'Pichilemu' },
]

const formatRating = (n: number) => n.toFixed(2)

const reasons = [
  { icon: IconBeach, title: 'Truly beachfront', text: 'On the best stretch of Avenida del Mar, and steps from the waves in Pichilemu.' },
  { icon: IconStarFilled, title: `${formatRating(AIRBNB_STATS.averageRating)} from ${AIRBNB_STATS.totalReviews} reviews`, text: 'Airbnb Superhosts: our guests come back and recommend us.' },
  { icon: IconMessageCircle, title: 'Hosted by the owners', text: 'We take care of every stay ourselves, before and during your trip.' },
  { icon: IconClock24, title: 'Answers 24/7', text: 'Check-in, check-out, the apartment and things to do, any time on WhatsApp.' },
]

const faqs = [
  {
    q: 'Is it safe to book here?',
    a: `Yes. We are Airbnb Superhosts with ${AIRBNB_STATS.totalReviews} reviews and a ${formatRating(AIRBNB_STATS.averageRating)} average. You book by talking to us directly on WhatsApp.`,
  },
  { q: 'How do I book and pay?', a: 'Message us on WhatsApp with your dates and we confirm availability and price. You can pay by direct bank transfer or book through Airbnb.' },
  { q: 'How does check-in work?', a: 'Before you arrive we send you clear instructions on WhatsApp, and we are there if you need help.' },
  { q: 'What is the cancellation policy?', a: 'Flexible: full refund up to 7 days before arrival, except peak dates, which we tell you about when you book.' },
  { q: 'Can I write to you in English?', a: 'Of course. Message us on WhatsApp in English at any time and we will reply.' },
]

export default async function EnglishHome() {
  const properties: Property[] = await client.fetch(query)

  return (
    <div lang="en" className="bg-salt dark:bg-gray-900">
      {/* HERO */}
      <section className="relative isolate flex min-h-[78vh] items-end overflow-hidden text-white sm:min-h-[84vh]">
        <Image
          src="/destinos/hero-mar.jpg"
          alt="Sea view and palm trees on Avenida del Mar from Aqua Resort La Serena"
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover object-[50%_60%]"
        />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-gray-950/70 via-gray-950/20 to-transparent" />
        <div className="mx-auto w-full max-w-7xl px-6 pb-14 sm:pb-20 lg:px-8">
          <p className="inline-flex items-center rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold backdrop-blur">
            La Serena · Pichilemu · Chile
          </p>
          <h1 className="mt-5 max-w-3xl font-display text-hero font-bold">Wake up by the sea</h1>
          <p className="mt-4 max-w-xl text-lg text-white/90 sm:text-xl">
            Apartments at Aqua Resort La Serena and a cabin in Pichilemu.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#stays"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-4 text-base font-semibold text-navy-900 shadow-lg transition hover:bg-sea-50"
            >
              See our stays
              <IconArrowRight className="h-5 w-5" />
            </a>
            <a
              href={whatsappLink("Hi, I'd like to check availability")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 px-7 py-4 text-base font-semibold text-white ring-1 ring-white/50 backdrop-blur transition hover:bg-white/20"
            >
              <IconBrandWhatsapp className="h-5 w-5" />
              WhatsApp
            </a>
          </div>
          <a
            href={AIRBNB_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 text-sm text-white/90 hover:text-white"
          >
            <IconStarFilled className="h-4 w-4 text-gold-300" />
            <span>
              <strong className="font-semibold">{formatRating(AIRBNB_STATS.averageRating)}</strong> · {AIRBNB_STATS.totalReviews} reviews · Superhosts
            </span>
          </a>
        </div>
      </section>

      {/* STAYS */}
      <section id="stays" className="scroll-mt-24 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-sea-600">Our stays</p>
          <h2 className="mt-2 font-display text-h2 font-semibold text-ink dark:text-white">Choose where to wake up</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {properties.map(p => {
              const en = EN_BY_NAME.find(e => e.match.test(`${p.name} ${p.location}`))
              const cover = p.gallery?.find(hasAssetRef)
              const img = cover ? urlFor(cover).width(900).height(700).fit('crop').auto('format').url() : null
              const rating = getRating(p)
              return (
                <Link
                  key={p._id}
                  href={`/refugios/${p.slug.current}`}
                  className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 transition hover:shadow-lg dark:bg-gray-800 dark:ring-gray-700"
                >
                  <div className="relative aspect-[9/7] overflow-hidden">
                    {img && (
                      <Image src={img} alt={en?.title || p.name} fill sizes="(min-width:1024px) 33vw, 100vw" className="object-cover transition duration-700 group-hover:scale-105" />
                    )}
                    <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-semibold text-navy-900">
                      {en?.place || p.location}
                    </span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-display text-xl font-semibold text-ink dark:text-white">{en?.title || p.name}</h3>
                      {rating && (
                        <span className="flex shrink-0 items-center gap-1 text-sm">
                          <IconStarFilled className="h-4 w-4 text-gold-500" />
                          <strong>{formatRating(rating.rating)}</strong>
                          <span className="text-ink-faint">({rating.reviewCount})</span>
                        </span>
                      )}
                    </div>
                    {en && <p className="mt-2 text-sm text-ink-subtle">{en.text}</p>}
                    <p className="mt-4 flex flex-wrap gap-4 text-sm text-ink-subtle">
                      {p.capacity && <span className="flex items-center gap-1.5"><IconUsers className="h-4 w-4 text-sea-600" />{p.capacity} guests</span>}
                      {p.bedrooms && <span className="flex items-center gap-1.5"><IconBed className="h-4 w-4 text-sea-600" />{p.bedrooms} bedrooms</span>}
                      {p.bathrooms && <span className="flex items-center gap-1.5"><IconBath className="h-4 w-4 text-sea-600" />{p.bathrooms} {p.bathrooms > 1 ? 'bathrooms' : 'bathroom'}</span>}
                    </p>
                    <p className="mt-5 flex items-center gap-1 border-t border-gray-100 pt-4 text-sm font-semibold text-navy-900 dark:border-gray-700 dark:text-white">
                      Book <IconArrowRight className="h-4 w-4" />
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="bg-sea-50 py-20 text-navy-900 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-2 lg:items-center lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-sea-600">Why De Sal y Estrella</p>
            <h2 className="mt-2 font-display text-h2 font-semibold">Places looked after with care</h2>
            <p className="mt-5 text-copy-lg text-ink-subtle">A few hand-picked stays, run by us.</p>
          </div>
          <ul className="grid gap-5">
            {reasons.map(r => (
              <li key={r.title} className="flex gap-5 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-sea-100">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sea-500 text-white">
                  <r.icon className="h-6 w-6" />
                </span>
                <div>
                  <p className="font-display text-lg font-semibold">{r.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-subtle">{r.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <h2 className="text-center font-display text-h2 font-semibold text-ink dark:text-white">Frequently asked questions</h2>
          <div className="mt-10 divide-y divide-gray-200 border-y border-gray-200 dark:divide-gray-700 dark:border-gray-700">
            {faqs.map(f => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-ink dark:text-white [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <IconChevronDown className="h-5 w-5 shrink-0 text-gold-600 transition group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-ink-subtle dark:text-ink-dark-subtle">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24 lg:px-8">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-to-br from-sea-500 to-sea-700 px-8 py-14 text-center text-white sm:px-16">
          <h2 className="font-display text-h2 font-semibold">Have dates in mind?</h2>
          <p className="mx-auto mt-4 max-w-xl text-white/90">Message us and we will get back to you right away.</p>
          <a
            href={whatsappLink("Hi, I'd like to check availability for these dates: ")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-4 font-semibold text-sea-700 hover:bg-sea-50"
          >
            <IconBrandWhatsapp className="h-5 w-5" />
            Message us on WhatsApp
          </a>
        </div>
      </section>
    </div>
  )
}
