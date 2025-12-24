import Image from 'next/image'

export default function ChrismastPage() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 9999,
      overflow: 'hidden'
    }}>
      <Image
        src="/golden_ticket.jpg"
        alt="Golden Ticket"
        fill
        style={{ objectFit: 'cover' }}
      />
    </div>
  )
}