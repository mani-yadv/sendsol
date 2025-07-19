import { readFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  try {
    const iconPath = join(process.cwd(), 'public', 'icon-512x512.png')
    const iconBuffer = await readFile(iconPath)
    
    setHeader(event, 'Content-Type', 'image/png')
    setHeader(event, 'Cache-Control', 'public, max-age=31536000')
    
    return iconBuffer
  } catch (error) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Icon not found'
    })
  }
})