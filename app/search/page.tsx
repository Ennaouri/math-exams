"use client"
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useEffect, Suspense } from 'react'
import Link from 'next/link';

function SearchContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const query = searchParams?.get('q') || ''
    const [searchQuery, setSearchQuery] = useState(query)
    const [results, setResults] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (query) {
            setLoading(true)
            fetch(`/api/search?q=${encodeURIComponent(query)}`)
                .then(res => res.json())
                .then(data => {
                    setResults(data)
                    setLoading(false)
                })
                .catch(() => setLoading(false))
        }
    }, [query])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-gray-900 text-white py-12">
                <div className="max-w-4xl mx-auto px-4">
                    <h1 className="text-3xl font-bold mb-6">Recherche</h1>
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Rechercher cours, exercices, examens..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold">
                            Chercher
                        </button>
                    </form>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                <nav className="mb-4 text-sm text-gray-500">
                    <ol className="flex items-center space-x-2">
                        <li><Link href="/" className="hover:text-red-600">Home</Link></li>
                        <li>/</li>
                        <li className="text-gray-700">Recherche: {query}</li>
                    </ol>
                </nav>
                {loading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Recherche en cours...</p>
                    </div>
                ) : query ? (
                    results.length > 0 ? (
                        <div>
                            <p className="text-gray-600 mb-4">{results.length} résultat(s) trouvé(s) pour "{query}"</p>
                            <div className="space-y-4">
                                {results.map((post: any) => (
                                    <Link 
                                        key={post.id} 
                                        href={`/postdetails/${post.slug}`}
                                        className="block bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-4"
                                    >
                                        <div className="flex gap-4">
                                            {post.thumbnail && (
                                                <img 
                                                    src={post.thumbnail} 
                                                    alt={post.name}
                                                    className="w-32 h-24 object-cover rounded"
                                                />
                                            )}
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">{post.name}</h3>
                                                <p className="text-gray-600 text-sm mt-1 line-clamp-2">{post.description}</p>
                                                {post.attribute && (
                                                    <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                                        {post.attribute}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-600 text-lg">Aucun résultat trouvé pour "{query}"</p>
                            <p className="text-gray-500 mt-2">Essayez avec d'autres mots-clés</p>
                        </div>
                    )
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-600 text-lg">Entrez un mot-clé pour rechercher</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        }>
            <SearchContent />
        </Suspense>
    )
}