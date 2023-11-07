import { getUserId } from '@/lib/auth'
import { tasks } from '@/lib/database'
import { ObjectId } from 'mongodb'

export async function GET(req: Request) {
  const token = req.headers.get('Authorization')

  if (!token) {
    return new Response(undefined, { status: 401 })
  }

  const user_id = await getUserId(token)
  const progress_arr = await tasks.find({ 'user_id': new ObjectId(user_id) })
    .project({ '_id': 1, 'progress': 1 }).toArray()

  const progress = {} 

  for (let idx in progress_arr) {
    progress[progress_arr[idx]['_id']] = progress_arr[idx]['progress']
  }

  return new Response(JSON.stringify(progress), { status: 200 })
}
