import { NextResponse } from 'next/server';

const BE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ||
  'http://localhost:5000/api';

export async function POST(request) {
  try {
    const body = await request.json();

    const res = await fetch(`${BE_URL}/shipment-verification/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json(
      { message: { id: 'Gagal terhubung ke server', en: 'Failed to connect to server' }, data: { valid: false } },
      { status: 502 }
    );
  }
}
