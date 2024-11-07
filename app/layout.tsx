export const metadata = {
  title: 'HDG - Online-Bildung-Information-Systeme',
  description: 'Powered by Necirvan Alpar',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
