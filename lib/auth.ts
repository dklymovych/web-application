import * as jose from 'jose'

export function getToken() {
  return localStorage.getItem('token')
}

export async function getUserId(token: string): Promise<string> {
  const { payload, protectedHeader } = await jose.jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET_KEY), {
    issuer: 'http://localhost:3000',
    audience: 'http://localhost:3000',
  })

  return payload['_id'] as string
}
