"use client"
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

export default function SearchBar() {
  const router = useRouter()
  const [query, setQuery] = useState("")

  const handleSearch = () => {
    if (query.trim() === "") return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    setQuery("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch()
  }

  return (
    <div className="flex justify-center w-full">
      <label htmlFor="site-search" className="sr-only">
        Rechercher un cours, exercice ou examen
      </label>
      <div className="flex w-full max-w-xl rounded-lg overflow-hidden shadow-lg">
        <input
          id="site-search"
          className="flex-1 px-4 py-3 text-gray-800 bg-white text-sm focus:outline-none"
          type="search"
          placeholder="cours, exercice ou examen…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Rechercher sur le site"
        />
        <button
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 text-white font-semibold text-sm transition-colors"
          onClick={handleSearch}
          aria-label="Lancer la recherche"
        >
          Chercher
        </button>
      </div>
    </div>
  )
}
