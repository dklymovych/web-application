import fs from 'fs'
import * as jose from 'jose'
import { writeFile } from 'fs/promises'
import { bucket, tasks } from '@/lib/database'
import { getUserId } from '@/lib/auth'

export async function POST(req: Request) {
  const token = req.headers.get('Authorization')

  if (!token) {
    return new Response(undefined, { status: 401 })
  }

  const user_id = await getUserId(token)

  const formData = await req.formData()
  const file: File = formData.get('file') as File

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  await writeFile('./data/graph.dat', buffer)

  const readableStream = fs.createReadStream('./data/graph.dat')
  const uploadStream = bucket.openUploadStream('graph.dat') 
  readableStream.pipe(uploadStream)

  await tasks.insertOne({
    'user_id': user_id,
    'input_id': uploadStream.id
  })

  return new Response(undefined, { status: 201 })
}
