"use client"
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

export default function SearchBar() {
    const router = useRouter()
    const [location, setLocasion] = useState("")
  return (
    <div className="text-left text-lg py-3 m-auto flex justify-center">
    <input
      className="rounded  mr-3 p-2 w-[450px]"
      type="text"
      placeholder="cours, exercice ou examen"
      value={location}
      onChange={(e) => setLocasion(e.target.value)}
    />
    <button className="rounded bg-red-600 px-9 py-2 text-white" onClick={() => {
        if (location === "") return;
        router.push(`/search?city=`)
        setLocasion("")
      }

      }>
      Chercher
    </button>
  </div>
  )
}
