import React from 'react'

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-64 bg-gradient-to-r from-[#0f1f47] to-[#5f6984] p-2">
    <div className="text-center mt-10">
      <h1 className="text-white text-5xl font-bold mb-2">
        Mathématiques Du Secondaire
      </h1>
      {children}
    </div>
    <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
  </div>
  )
}
