'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface ArtistData {
  name: string
  image: string | null
  genres: string[]
}

export default function ArtistPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [artist, setArtist] = useState<ArtistData | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchArtist()
    }
  }, [session])

  const fetchArtist = async () => {
    const res = await fetch(`/api/spotify/${params.id}`)
    const data = await res.json()
    setArtist(data)
  }

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session) {
    return null
  }

  if (!artist) {
    return <div>Loading artist...</div>
  }

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
        <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
           Back to Artists
        </Link>

        <h1 className="text-3xl font-bold mb-4">{artist.name}</h1>

        {artist.image && (
          <img src={artist.image} alt={artist.name} className="w-full max-w-md mb-4 rounded" />
        )}

        <div>
          <h2 className="text-xl font-bold mb-2">Genres</h2>
          {artist.genres.length > 0 ? (
            <ul className="list-disc list-inside">
              {artist.genres.map((genre) => (
                <li key={genre} className="text-gray-700">
                  {genre}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No genres available</p>
          )}
        </div>
      </div>
    </div>
  )
}
