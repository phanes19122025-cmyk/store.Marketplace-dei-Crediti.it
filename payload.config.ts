import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Admins } from '@/collections/Admins'
import { Products } from '@/collections/Products'
import { Categories } from '@/collections/Categories'
import { Brands } from '@/collections/Brands'
import { Orders } from '@/collections/Orders'
import { Customers } from '@/collections/Customers'
import { Media } from '@/collections/Media'
import { Pages } from '@/collections/Pages'
import { SiteSettings } from '@/globals/SiteSettings'
import { Navigation } from '@/globals/Navigation'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const requireSecret = () => {
  const s = process.env.PAYLOAD_SECRET
  if (!s) throw new Error('PAYLOAD_SECRET is required')
  return s
}

const r2Enabled = Boolean(process.env.R2_BUCKET && process.env.R2_ACCOUNT_ID)

export default buildConfig({
  admin: {
    user: 'admins',
    meta: { titleSuffix: ' | Shop MdC' },
  },
  collections: [Admins, Products, Categories, Brands, Orders, Customers, Media, Pages],
  globals: [SiteSettings, Navigation],
  editor: lexicalEditor(),
  secret: requireSecret(),
  typescript: { outputFile: path.resolve(dirname, 'src/payload-types.ts') },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI || '' },
    push: true, // v0.2 alpha: auto-sync schema on boot. Switch to migrations for v0.3+ prod.
  }),
  sharp,
  plugins: r2Enabled
    ? [
        s3Storage({
          collections: { media: { prefix: 'media' } },
          bucket: process.env.R2_BUCKET!,
          config: {
            endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
            credentials: {
              accessKeyId: process.env.R2_ACCESS_KEY_ID!,
              secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
            },
            region: 'auto',
            forcePathStyle: true,
          },
        }),
      ]
    : [],
})
