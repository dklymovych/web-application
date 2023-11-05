import bcrypt from 'bcrypt'
import * as jose from 'jose'
import { users } from '@/lib/database'

export async function POST(req: Request) {
  const { username, password } = await req.json()
  const user = await users.findOne({ username })

  if (!user) {
    return new Response(undefined, { status: 400 })
  }

  const hashPassword = await user['password']
  const match = await bcrypt.compare(password, hashPassword); 

  if (!match) {
    return new Response(undefined, { status: 400 })
  }

  const jwt = await new jose.SignJWT({ '_id': user['_id'] })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer('http://localhost:3000')
    .setAudience('http://localhost:3000')
    .setExpirationTime('5h')
    .sign(new TextEncoder().encode(process.env.JWT_SECRET_KEY))

  return new Response(JSON.stringify({ "token": jwt }), { status: 200 })
}
