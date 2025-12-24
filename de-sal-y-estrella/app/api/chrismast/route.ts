import fs from 'fs';
import path from 'path';

export async function GET() {
  const filePath = path.join(process.cwd(), 'public', 'golden_ticket.jpg');
  const imageBuffer = fs.readFileSync(filePath);

  return new Response(imageBuffer, {
    headers: {
      'Content-Type': 'image/jpeg',
    },
  });
}