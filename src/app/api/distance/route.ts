import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { origin, destination } = await req.json();

  if (!origin || !destination) {
    return NextResponse.json(
      { error: 'Lähtö- ja kohdeosoite vaaditaan.' },
      { status: 400 },
    );
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'API-avain puuttuu, syötä km manuaalisesti.' },
      { status: 500 },
    );
  }

  const url = new URL('https://maps.googleapis.com/maps/api/distancematrix/json');
  url.searchParams.set('origins', origin);
  url.searchParams.set('destinations', destination);
  url.searchParams.set('key', apiKey);
  url.searchParams.set('language', 'fi');
  url.searchParams.set('units', 'metric');

  const res = await fetch(url.toString());
  const data = await res.json();

  if (data.status !== 'OK') {
    return NextResponse.json(
      { error: 'Osoitetta ei löydy, syötä km manuaalisesti.' },
      { status: 422 },
    );
  }

  const element = data.rows?.[0]?.elements?.[0];
  if (!element || element.status !== 'OK') {
    return NextResponse.json(
      { error: 'Osoitetta ei löydy, syötä km manuaalisesti.' },
      { status: 422 },
    );
  }

  const distance_km = Math.round(element.distance.value / 100) / 10;
  const duration_minutes = Math.round(element.duration.value / 60);
  const distance_text: string = element.distance.text;

  return NextResponse.json({ distance_km, duration_minutes, distance_text });
}
