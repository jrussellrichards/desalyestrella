import Image from 'next/image'

export default function ChrismastPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .golden-ticket-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 9999;
          overflow: hidden;
          background-color: #000;
        }
        
        @media screen and (orientation: portrait) and (max-width: 1024px) {
          .golden-ticket-container {
            width: 100vh;
            height: 100vw;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(90deg);
          }
        }
      `}} />
      <div className="golden-ticket-container">
        <Image
          src="/golden_ticket.jpg"
          alt="Golden Ticket"
          fill
          style={{ objectFit: 'contain' }}
          priority
        />
      </div>
    </>
  )
}