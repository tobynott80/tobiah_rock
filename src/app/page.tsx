'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface Artist {
  id: string;
  name: string;
}

export default function Home() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    fetchArtists();
  }, []);

  const fetchArtists = async () => {
    const res = await fetch('/api/artists');
    const artistIds = await res.json();

    const artistData = await Promise.all(
      artistIds.map(async (id: string) => {
        const res = await fetch(`/api/spotify/${id}`);
        const data = await res.json();
        return { id, name: data.name || id };
      }),
    );

    setArtists(artistData);
  };

  return (
    <div className='min-h-screen p-8 '>
      <div className='max-w-4xl mx-auto'>
        <div className='bg-background-s p-6 rounded shadow'>
          <h1 className='text-3xl font-bold mb-6'>Featured Artists</h1>

          {artists.length === 0 ? (
            <p className='text-red-500'>No artists available</p>
          ) : (
            <ul className='space-y-3'>
              {artists.map((artist) => (
                <li key={artist.id} className='border p-4 rounded'>
                  {session ? (
                    <Link
                      href={`/artist/${artist.id}`}
                      className='text-foreground hover:underline text-lg'
                    >
                      {artist.name}
                    </Link>
                  ) : (
                    <span className='text-lg'>{artist.name}</span>
                  )}
                </li>
              ))}
            </ul>
          )}

          <div className='mt-6 flex gap-4'>
            {!session && (
              <Link
                href='/login'
                className='bg-blue-500 text-white px-4 py-2 rounded'
              >
                Login
              </Link>
            )}
            {session && (
              <Link
                href='/admin'
                className='bg-green-500 text-white px-4 py-2 rounded'
              >
                Manage Artists
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
