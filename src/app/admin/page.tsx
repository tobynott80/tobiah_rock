'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [artists, setArtists] = useState<string[]>([])
  const [newArtistId, setNewArtistId] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    fetchArtists()
  }, [])

  const fetchArtists = async () => {
    const res = await fetch('/api/artists')
    const data = await res.json()
    setArtists(data)
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const res = await fetch('/api/artists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ artistId: newArtistId })
    })

    const data = await res.json()

    if (res.ok) {
      setNewArtistId('')
      fetchArtists()
    } else {
      setError(data.error)
    }
  }

  const handleDelete = async (id: string) => {
    await fetch(`/api/artists?id=${id}`, { method: 'DELETE' })
    fetchArtists()
  }

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Manage Artists</h1>

        <form onSubmit={handleAdd} className="mb-6">
          <label className="block mb-2">Add Artist ID</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newArtistId}
              onChange={(e) => setNewArtistId(e.target.value)}
              className="flex-1 border p-2 rounded"
              placeholder="e.g., 6M2wZ9GZgrQXHCFfjv46we"
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Add
            </button>
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>

        <div>
          <h2 className="font-bold mb-2">Current Artists ({artists.length}/20)</h2>
          <ul className="space-y-2">
            {artists.map((id) => (
              <li key={id} className="flex justify-between items-center border p-2 rounded">
                <span className="font-mono text-sm">{id}</span>
                <button
                  onClick={() => handleDelete(id)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
