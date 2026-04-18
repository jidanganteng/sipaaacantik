import './globals.css'

export const metadata = {
  title: 'Bucin Animation',
  description: 'Elegant Love Animation',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  )
}