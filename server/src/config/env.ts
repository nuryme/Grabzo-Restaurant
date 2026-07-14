import 'dotenv/config'

function required(name: string, fallback?: string): string {
  const v = process.env[name] ?? fallback
  if (v === undefined) throw new Error(`Missing required env var: ${name}`)
  return v
}

export const env = {
  port: Number(process.env.PORT ?? 4000),
  clientOrigin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173',
  mongoUri: required('MONGODB_URI', 'mongodb://127.0.0.1:27017/grabzo'),
  jwtSecret: required('JWT_SECRET', 'dev-insecure-secret-change-me'),
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME ?? '',
    apiKey: process.env.CLOUDINARY_API_KEY ?? '',
    apiSecret: process.env.CLOUDINARY_API_SECRET ?? '',
  },
  seed: {
    ownerEmail: process.env.SEED_OWNER_EMAIL ?? 'owner@grabzo.test',
    ownerPassword: process.env.SEED_OWNER_PASSWORD ?? 'grabzo123',
  },
}
