import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'price', 'stock', 'brand', 'category'],
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, admin: { position: 'sidebar' } },
    { name: 'description', type: 'richText' },
    { name: 'price', type: 'number', required: true, min: 0 },
    { name: 'compareAtPrice', type: 'number', min: 0, admin: { description: 'Prezzo di listino (barrato)' } },
    { name: 'sku', type: 'text', admin: { position: 'sidebar' } },
    { name: 'stock', type: 'number', required: true, defaultValue: 0, min: 0 },
    { name: 'images', type: 'upload', relationTo: 'media', hasMany: true },
    { name: 'category', type: 'relationship', relationTo: 'categories' },
    { name: 'brand', type: 'relationship', relationTo: 'brands' },
    {
      name: 'variants',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
        { name: 'priceAdjustment', type: 'number', defaultValue: 0 },
        { name: 'stock', type: 'number', defaultValue: 0 },
        { name: 'sku', type: 'text' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Bozza', value: 'draft' },
        { label: 'Pubblicato', value: 'published' },
        { label: 'Archiviato', value: 'archived' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'badges',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Sped 24h', value: 'fast-shipping' },
        { label: 'Offerta a Tempo', value: 'timed-offer' },
        { label: 'Bestseller', value: 'bestseller' },
        { label: 'Nuovo', value: 'new' },
      ],
    },
    { name: 'shippingDays', type: 'number', defaultValue: 3, admin: { description: 'Giorni previsti per spedizione' } },
  ],
}
