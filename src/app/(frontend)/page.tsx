import config from '@payload-config'
import { getPayload } from 'payload'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const payload = await getPayload({ config })

  const products = await payload.find({
    collection: 'products',
    where: { status: { equals: 'published' } },
    limit: 20,
    sort: '-createdAt',
    depth: 2,
  })

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Marketplace dei Crediti</h1>
        <p className="text-neutral-400 mt-2">Prodotti nuovi al miglior prezzo</p>
      </header>

      {products.docs.length === 0 ? (
        <div className="text-center py-20 text-neutral-500">
          <p className="text-xl">Nessun prodotto pubblicato</p>
          <p className="mt-2">
            Vai su <a href="/admin" className="text-blue-400 underline">/admin</a> per aggiungere prodotti
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.docs.map((product: any) => {
            const cover = product.images?.[0]
            const coverUrl = typeof cover === 'object' && cover !== null ? cover.url : null
            return (
              <article key={product.id} className="bg-neutral-900 rounded-lg overflow-hidden border border-neutral-800 hover:border-neutral-600 transition">
                <div className="aspect-square bg-neutral-800 flex items-center justify-center text-neutral-600">
                  {coverUrl ? (
                    <img src={coverUrl} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>No img</span>
                  )}
                </div>
                <div className="p-4">
                  <h2 className="font-medium text-sm line-clamp-2">{product.name}</h2>
                  <div className="mt-2 flex items-center gap-2">
                    {product.compareAtPrice && product.compareAtPrice > product.price && (
                      <span className="text-neutral-500 line-through text-xs">&euro; {product.compareAtPrice.toFixed(2)}</span>
                    )}
                    <span className="text-lg font-bold">&euro; {product.price.toFixed(2)}</span>
                  </div>
                  {product.stock > 0 ? (
                    <span className="text-green-500 text-xs">Disponibile ({product.stock})</span>
                  ) : (
                    <span className="text-red-500 text-xs">Esaurito</span>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      )}
    </main>
  )
}
