import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const publicDir = path.join(process.cwd(), 'public')
    const files = fs.readdirSync(publicDir)
    return NextResponse.json({ files })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read files' }, { status: 500 })
  }
} 