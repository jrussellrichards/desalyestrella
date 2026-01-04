import { fetchSettings } from '@/lib/settings'
import { urlFor } from '@/lib/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default async function WebsiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const settings = await fetchSettings()
  const logoUrl = settings.siteLogo ? urlFor(settings.siteLogo).width(320).fit('max').auto('format').url() : null

  return (
    <div className="flex flex-col min-h-screen">
      <Header logoUrl={logoUrl} logoAlt={settings.siteLogo?.alt || null} />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  )
}
