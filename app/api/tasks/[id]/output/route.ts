import fs from 'fs'
import { readFile } from 'fs/promises'
import { bucket, tasks } from '@/lib/database'
import { ObjectId } from 'mongodb'

export async function GET(req: Request, { params }) {
  const token = req.headers.get('Authorization')

  if (!token) {
    return new Response(undefined, { status: 401 })
  }

  const task = await tasks.findOne({ '_id': new ObjectId(params.id) })

  const writableStream = fs.createWriteStream('./data/result.dat')
  const downloadStream = bucket.openDownloadStream(task['output_id'])
  downloadStream.pipe(writableStream)

  await new Promise((resolve) => {
    writableStream.on('finish', resolve);
  })

  const formData = new FormData()

  const file = await readFile('./data/result.dat', 'binary')
  formData.set('file', new Blob([file]))

  return new Response(formData, { status: 200 })
}
