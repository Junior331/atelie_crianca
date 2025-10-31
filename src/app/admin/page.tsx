"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function AdminDashboard() {
  const router = useRouter();



  const handleLogout = async () => {
    await supabase.auth.signOut();
    document.cookie = "supabase-auth-token=; path=/; max-age=0";
    router.push("/admin/login");
  };
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                Painel Admin - Ateliê da Criança
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {/* <Link
                href="/admin/upload"
                className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700"
              >
                Upload Nova Imagem
              </Link> */}

              <Link
                href="/"
                className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700"
              >
                Voltar pra home
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

      <main className="mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Navigation Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
            <Link
              href="/admin/home"
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Página Inicial
              </h2>
              <p className="text-gray-600">Editar 11 imagens (3 seções)</p>
            </Link>

            <Link
              href="/admin/souvenirs"
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Mesa de Doces
              </h2>
              <p className="text-gray-600">
                Editar banner e galeria de imagens
              </p>
            </Link>

            <Link
              href="/admin/corporate"
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Corporativo
              </h2>
              <p className="text-gray-600">
                Editar banner e galeria de imagens
              </p>
            </Link>

            <Link
              href="/admin/furniture"
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Mobiliário
              </h2>
              <p className="text-gray-600">Editar banner e 6 imagens</p>
            </Link>

            <Link
              href="/admin/ateliegroup"
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Ateliê Group
              </h2>
              <p className="text-gray-600">Editar banner e grid 4x4</p>
            </Link>
            <Link
              href="/admin/playroom"
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Brinquedoteca
              </h2>
              <p className="text-gray-600">Editar banner e 22 imagens</p>
            </Link>

            <Link
              href="/admin/about"
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Quem Somos
              </h2>
              <p className="text-gray-600">Editar 3 imagens</p>
            </Link>

            <Link
              href="/admin/wedding"
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Casamentos
              </h2>
              <p className="text-gray-600">Editar banner e 6 imagens</p>
            </Link>

            {/* <Link
              aria-disabled
              href="/admin/upload"
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Upload Geral
              </h2>
              <p className="text-gray-600">Upload de imagens gerais</p>
            </Link> */}
          </div>

          {/* <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Todas as Imagens
          </h3>
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
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {img.is_active ? "Ativa" : "Inativa"}
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
                        {img.is_active ? "Desativar" : "Ativar"}
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
          )} */}
        </div>
      </main>
    </div>
  );
}
