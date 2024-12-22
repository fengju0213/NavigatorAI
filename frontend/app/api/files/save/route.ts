import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const { fileName, data } = await request.json()
    
    // 确保文件名安全
    const safeName = path.basename(fileName)
    const filePath = path.join(process.cwd(), 'public', safeName)
    
    // 将数据写入文件
    const buffer = Buffer.from(data)
    fs.writeFileSync(filePath, buffer)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving file:', error)
    return NextResponse.json(
      { error: 'Failed to save file' }, 
      { status: 500 }
    )
  }
} 