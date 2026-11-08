import type { Metadata } from 'next'
import React from 'react'
import './globals.css'

export const metadata: Metadata = {
  title: 'Marketplace dei Crediti — Shop',
  description: 'Prodotti nuovi al miglior prezzo, con garanzia.',
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body className="antialiased bg-neutral-950 text-white min-h-screen">
        {children}
      </body>
    </html>
  )
}
