import type { CollectionConfig } from 'payload'

export const Customers: CollectionConfig = {
  slug: 'customers',
  auth: true,
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'firstName', 'lastName', 'createdAt'],
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.collection === 'admins') return true
      return { id: { equals: user.id } }
    },
    create: () => true,
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.collection === 'admins') return true
      return { id: { equals: user.id } }
    },
    delete: ({ req: { user } }) => user?.collection === 'admins',
  },
  fields: [
    { name: 'firstName', type: 'text' },
    { name: 'lastName', type: 'text' },
    { name: 'phone', type: 'text' },
    {
      name: 'addresses',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', defaultValue: 'Casa' },
        { name: 'fullName', type: 'text' },
        { name: 'line1', type: 'text', required: true },
        { name: 'line2', type: 'text' },
        { name: 'city', type: 'text', required: true },
        { name: 'province', type: 'text' },
        { name: 'postalCode', type: 'text', required: true },
        { name: 'country', type: 'text', defaultValue: 'IT' },
        { name: 'phone', type: 'text' },
        { name: 'isDefault', type: 'checkbox', defaultValue: false },
      ],
    },
    { name: 'stripeCustomerId', type: 'text', admin: { position: 'sidebar', readOnly: true } },
  ],
}
