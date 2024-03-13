import Navbar from './components/Navbar'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>
      <main className="bg-gray-100 min-h-screen w-screen">
  <main className="max-w-screen-xl m-auto bg-white">
<Navbar />

        {children}
        </main>
</main>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.js"></script>
        
      </body>
    </html>
  )
}