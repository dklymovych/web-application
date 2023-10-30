import bcrypt from 'bcrypt'
import { users } from '@/lib/database'

export async function POST(req: Request) {
  const { username, password } = await req.json()
  const user = await users.findOne({ username })

  if (user) {
    return new Response(undefined, { status: 400 })
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  await users.insertOne({
    "username": username,
    "password": hashedPassword
  })

  return new Response(undefined, { status: 201 })
}
