import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import fs from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'artists.json')

function ensureDataFile() {
  const dir = path.dirname(DATA_FILE)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]))
  }
}

export async function GET() {
  try {
    ensureDataFile()
    const data = fs.readFileSync(DATA_FILE, 'utf-8')
    const artists = JSON.parse(data)
    return NextResponse.json(artists)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read artists' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { artistId } = body

    if (!artistId) {
      return NextResponse.json({ error: 'Artist ID required' }, { status: 400 })
    }

    ensureDataFile()
    const data = fs.readFileSync(DATA_FILE, 'utf-8')
    const artists = JSON.parse(data)

    if (artists.length >= 20) {
      return NextResponse.json({ error: 'Maximum 20 artists allowed' }, { status: 400 })
    }

    if (artists.includes(artistId)) {
      return NextResponse.json({ error: 'Artist already exists' }, { status: 400 })
    }

    artists.push(artistId)
    fs.writeFileSync(DATA_FILE, JSON.stringify(artists))

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add artist' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const artistId = searchParams.get('id')

    if (!artistId) {
      return NextResponse.json({ error: 'Artist ID required' }, { status: 400 })
    }

    ensureDataFile()
    const data = fs.readFileSync(DATA_FILE, 'utf-8')
    let artists = JSON.parse(data)

    artists = artists.filter((id: string) => id !== artistId)
    fs.writeFileSync(DATA_FILE, JSON.stringify(artists))

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete artist' }, { status: 500 })
  }
}
