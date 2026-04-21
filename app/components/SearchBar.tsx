"use client"
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

export default function SearchBar() {
    const router = useRouter()
    const [query, setQuery] = useState("")
  return (
    <div className="text-left text-lg py-3 m-auto flex justify-center">
    <input
      className="rounded mr-3 p-2 w-[450px]"
      type="text"
      placeholder="cours, exercice ou examen"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
    <button className="rounded bg-blue-600 hover:bg-blue-700 px-6 py-2 text-white transition-colors" onClick={() => {
        if (query.trim() === "") return;
        router.push(`/search?q=${encodeURIComponent(query.trim())}`)
        setQuery("")
      }
      }>
      Chercher
    </button>
  </div>
  )
}
