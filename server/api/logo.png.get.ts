import { readFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  try {
    const logoPath = join(process.cwd(), 'public', 'logo.png')
    const logoBuffer = await readFile(logoPath)
    
    setHeader(event, 'Content-Type', 'image/png')
    setHeader(event, 'Cache-Control', 'public, max-age=31536000') // 1 year
    
    return logoBuffer
  } catch (error) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Logo not found'
    })
  }
})