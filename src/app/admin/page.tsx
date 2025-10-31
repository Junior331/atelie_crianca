'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'

interface Category {
  id: string
  name: string
  slug: string
}

interface ImageItem {
  id: string
  title: string
  description: string | null
  image_url: string
  is_active: boolean
  order_position: number
  category_id: string
  categories: Category
}

export default function AdminDashboard() {
  const [images, setImages] = useState<ImageItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchData()
  }, [selectedCategory])

  const fetchData = async () => {
    setLoading(true)
    try {
      // Fetch categories
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('*')
        .order('name')

      if (categoriesData) {
        setCategories(categoriesData)
      }

      // Fetch images
      let query = supabase
        .from('images')
        .select(`
          *,
          categories (
            id,
            name,
            slug
          )
        `)
        .order('order_position')

      if (selectedCategory !== 'all') {
        query = query.eq('category_id', selectedCategory)
      }

      const { data: imagesData } = await query

      if (imagesData) {
        setImages(imagesData as any)
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    document.cookie = 'supabase-auth-token=; path=/; max-age=0'
    router.push('/admin/login')
  }

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await supabase
        .from('images')
        .update({ is_active: !currentStatus })
        .eq('id', id)

      fetchData()
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
    }
  }

  const deleteImage = async (id: string, storagePath: string) => {
    if (!confirm('Tem certeza que deseja excluir esta imagem?')) return

    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('images')
        .remove([storagePath])

      if (storageError) throw storageError

      // Delete from database
      await supabase.from('images').delete().eq('id', id)

      fetchData()
    } catch (error) {
      console.error('Erro ao excluir imagem:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                Painel Admin - Ateliê da Criança
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/upload"
                className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700"
              >
                Upload Nova Imagem
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-gray-900"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Navigation Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Link
              href="/admin/souvenirs"
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-2">Mesa de Doces</h2>
              <p className="text-gray-600">Editar banner e galeria de imagens da Mesa de Doces</p>
            </Link>

            <Link
              href="/admin/corporate"
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-2">Corporativo</h2>
              <p className="text-gray-600">Editar banner e galeria de imagens Corporativas</p>
            </Link>

            <Link
              href="/admin/furniture"
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-2">Mobiliário</h2>
              <p className="text-gray-600">Editar banner e 6 imagens do Mobiliário</p>
            </Link>

            <Link
              href="/admin/upload"
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-2">Upload Geral</h2>
              <p className="text-gray-600">Fazer upload de novas imagens para qualquer categoria</p>
            </Link>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-4">Todas as Imagens</h3>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtrar por categoria:
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm rounded-md"
            >
              <option value="all">Todas as categorias</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Carregando...</p>
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhuma imagem encontrada</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {images.map((img) => (
                <div
                  key={img.id}
                  className="bg-white overflow-hidden shadow rounded-lg flex flex-col"
                >
                  <div className="relative h-48 w-full bg-gray-200 flex-shrink-0">
                    <Image
                      src={img.image_url}
                      alt={img.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="px-4 py-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {img.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {img.categories.name}
                    </p>
                    {img.description && (
                      <p className="mt-1 text-sm text-gray-600">
                        {img.description}
                      </p>
                    )}
                    <div className="mt-4 flex items-center justify-between">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          img.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {img.is_active ? 'Ativa' : 'Inativa'}
                      </span>
                      <span className="text-sm text-gray-500">
                        Ordem: {img.order_position}
                      </span>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <button
                        onClick={() => toggleActive(img.id, img.is_active)}
                        className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-700"
                      >
                        {img.is_active ? 'Desativar' : 'Ativar'}
                      </button>
                      <button
                        onClick={() => deleteImage(img.id, img.image_url)}
                        className="flex-1 bg-red-600 text-white px-3 py-2 rounded-md text-sm hover:bg-red-700"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
