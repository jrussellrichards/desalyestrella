import { Metadata } from 'next'

export const metadata: Metadata = {
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Guest Guide',
  },
}

export default function GuideLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-stone-950">
      {children}
    </div>
  )
}

