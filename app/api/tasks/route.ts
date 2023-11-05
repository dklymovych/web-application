import { getUserId } from "@/lib/auth"
import { tasks } from '@/lib/database'
import { ObjectId } from "mongodb"

export async function GET(req: Request) {
  const token = req.headers.get('Authorization')

  if (!token) {
    return new Response(undefined, { status: 401 })
  }

  const user_id = await getUserId(token)
  const all_tasks = await tasks.find({ 'user_id': new ObjectId(user_id) }).toArray()

  return new Response(JSON.stringify({ 'tasks': all_tasks }), { status: 200 })
}
