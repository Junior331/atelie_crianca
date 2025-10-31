"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useFeatureFlags } from "@/hooks/use-feature-flags";
import { useState } from "react";

export default function AdminDashboard() {
  const router = useRouter();
  const { flags, toggleFlag } = useFeatureFlags();
  const [toggling, setToggling] = useState<string | null>(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    document.cookie = "supabase-auth-token=; path=/; max-age=0";
    router.push("/admin/login");
  };

  const handleToggleFlag = async (id: string, currentValue: boolean) => {
    setToggling(id);
    try {
      await toggleFlag(id, !currentValue);
    } catch (error) {
      console.error("Error toggling flag:", error);
    } finally {
      setToggling(null);
    }
  };

  // Service cards configuration
  const serviceCards = [
    {
      name: "Página Inicial",
      slug: "home",
      href: "/admin/home",
      description: "Editar 11 imagens (3 seções)",
      hasFlag: false,
    },
    {
      name: "Mesa de Lanchinho",
      slug: "souvenirstable",
      href: "/admin/souvenirs",
      description: "Editar banner e galeria de imagens",
      hasFlag: true,
    },
    {
      name: "Corporativo",
      slug: "corporate",
      href: "/admin/corporate",
      description: "Editar banner e galeria de imagens",
      hasFlag: true,
    },
    {
      name: "Mobiliário",
      slug: "furniture",
      href: "/admin/furniture",
      description: "Editar banner e 6 imagens",
      hasFlag: true,
    },
    {
      name: "Ateliê Group",
      slug: "ateliegroup",
      href: "/admin/ateliegroup",
      description: "Editar banner e grid 4x4",
      hasFlag: true,
    },
    {
      name: "Brinquedoteca",
      slug: "playroom",
      href: "/admin/playroom",
      description: "Editar banner e 22 imagens",
      hasFlag: true,
    },
    {
      name: "Quem Somos",
      slug: "about",
      href: "/admin/about",
      description: "Editar 3 imagens",
      hasFlag: true,
    },
    {
      name: "Casamentos",
      slug: "wedding",
      href: "/admin/wedding",
      description: "Editar banner e 6 imagens",
      hasFlag: true,
    },
  ];

  // Get flag status for a service
  const getFlagForService = (slug: string) => {
    return flags.find((f) => f.slug === slug);
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
                className="text-gray-700 hover:text-gray-900 cursor-pointer"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Feature Flags Section */}
          <div className="mb-8 bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Controle de Visibilidade (Feature Flags)
            </h2>
            <p className="text-gray-600 mb-4">
              Ative ou desative páginas/rotas no site. Quando desativada, a
              página não aparecerá no menu.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {flags.map((flag) => {
                const isToggling = toggling === flag.id;
                return (
                  <div
                    key={flag.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {flag.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {flag.description}
                      </p>
                    </div>
                    <button
                      onClick={() => handleToggleFlag(flag.id, flag.is_enabled)}
                      disabled={isToggling}
                      className={`ml-4 relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        flag.is_enabled ? "bg-pink-600" : "bg-gray-200"
                      } ${
                        isToggling
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          flag.is_enabled ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Service Cards Section */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Seção 2: Cards de Serviços
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {serviceCards.map((card) => {
              const flag = getFlagForService(card.slug);
              const isEnabled = flag?.is_enabled ?? true;
              const showFlag = card.hasFlag;

              return (
                <div
                  key={card.slug}
                  className={`flex flex-col justify-between bg-white p-6 rounded-lg shadow transition-all ${
                    !isEnabled && showFlag
                      ? "opacity-50 border-2 border-red-300"
                      : ""
                  }`}
                >
                  <div className="flex flex-col gap-2 mb-4">
                    <h2 className="text-xl font-bold text-gray-900">
                      {card.name}
                    </h2>
                    <p className="text-gray-600 text-sm ">{card.description}</p>
                    {showFlag && (
                      <p className="text-xs text-gray-500 ">
                        Status:{" "}
                        <span
                          className={
                            isEnabled
                              ? "text-green-600 font-medium"
                              : "text-red-600 font-medium"
                          }
                        >
                          {isEnabled ? "Visível no site" : "Oculto no site"}
                        </span>
                      </p>
                    )}
                  </div>
                  <Link
                    href={card.href}
                    className="block text-center px-4 py-2 rounded-md transition-colors bg-pink-600 text-white hover:bg-pink-700"
                  >
                    Editar Página
                  </Link>
                </div>
              );
            })}
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
