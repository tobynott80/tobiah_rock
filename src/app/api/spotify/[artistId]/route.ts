import { NextRequest, NextResponse } from 'next/server';

async function getSpotifyToken() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization:
        'Basic ' +
        Buffer.from(clientId + ':' + clientSecret).toString('base64'),
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json();
  return data.access_token;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ artistId: string }> },
) {
  const { artistId } = await params;
  try {
    const token = await getSpotifyToken();

    const response = await fetch(
      `https://api.spotify.com/v1/artists/${artistId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
    }

    const artist = await response.json();

    return NextResponse.json({
      name: artist.name,
      image: artist.images[0]?.url || null,
      genres: artist.genres,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch artist' },
      { status: 500 },
    );
  }
}
