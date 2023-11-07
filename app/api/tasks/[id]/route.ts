import { tasks } from "@/lib/database"
import { ObjectId } from "mongodb"


export async function DELETE(req: Request, { params }) {
  const token = req.headers.get('Authorization')

  if (!token) {
    return new Response(undefined, { status: 401 })
  }

  await tasks.deleteOne({ '_id': new ObjectId(params.id) })
  return new Response(undefined, { status: 200 })
}
