import type { CollectionConfig } from 'payload'

const generateOrderNumber = () =>
  `MDC-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'customer', 'total', 'status', 'createdAt'],
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.collection === 'admins') return true
      return { customer: { equals: user.id } }
    },
    create: () => true,
    update: ({ req: { user } }) => user?.collection === 'admins',
    delete: ({ req: { user } }) => user?.collection === 'admins',
  },
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        if (operation === 'create' && !data.orderNumber) {
          data.orderNumber = generateOrderNumber()
        }
        return data
      },
    ],
    // TODO v0.3: atomic stock decrement on status=paid via drizzle sql template
  },
  fields: [
    { name: 'orderNumber', type: 'text', required: true, unique: true, admin: { readOnly: true, position: 'sidebar' } },
    { name: 'customer', type: 'relationship', relationTo: 'customers' },
    {
      name: 'items',
      type: 'array',
      required: true,
      fields: [
        { name: 'product', type: 'relationship', relationTo: 'products', required: true },
        { name: 'variantLabel', type: 'text' },
        { name: 'quantity', type: 'number', required: true, min: 1 },
        { name: 'unitPrice', type: 'number', required: true },
      ],
    },
    { name: 'subtotal', type: 'number', required: true },
    { name: 'shipping', type: 'number', defaultValue: 0 },
    { name: 'total', type: 'number', required: true },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'In Attesa', value: 'pending' },
        { label: 'Pagato', value: 'paid' },
        { label: 'In Lavorazione', value: 'processing' },
        { label: 'Spedito', value: 'shipped' },
        { label: 'Consegnato', value: 'delivered' },
        { label: 'Annullato', value: 'cancelled' },
        { label: 'Rimborsato', value: 'refunded' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'stripePaymentIntentId', type: 'text', admin: { position: 'sidebar', readOnly: true } },
    {
      name: 'shippingAddress',
      type: 'group',
      fields: [
        { name: 'fullName', type: 'text' },
        { name: 'line1', type: 'text' },
        { name: 'line2', type: 'text' },
        { name: 'city', type: 'text' },
        { name: 'province', type: 'text' },
        { name: 'postalCode', type: 'text' },
        { name: 'country', type: 'text', defaultValue: 'IT' },
        { name: 'phone', type: 'text' },
      ],
    },
    { name: 'trackingNumber', type: 'text' },
    { name: 'notes', type: 'textarea' },
  ],
}
