import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const acept = searchParams.get('acept');
    const clientId = searchParams.get('clientId');
    console.log(acept, clientId);

    // Definir qual arquivo servir
    const filePath =
      acept === 'true'
        ? path.join(process.cwd(), 'public', 'sdk', 'payment.js')
        : path.join(process.cwd(), 'public', 'sdk', 'OrderButton.js');

    const fileContents = await fs.readFile(filePath, 'utf8');

    return new NextResponse(fileContents, {
      status: 200,
      headers: {
        'Content-Type': 'application/javascript',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
