/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import type { ProductCategory } from "@/types/database";
import { Pencil, Trash2, Plus, X } from "lucide-react";

export default function ProductCategoriesAdmin() {
  const router = useRouter();
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    is_active: true,
    order_position: 0,
  });

  useEffect(() => {
    checkAuth();
    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) router.push("/admin/login");
  };

  const loadCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("product_categories")
        .select("*")
        .order("order_position", { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
      alert("Erro ao carregar categorias");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    document.cookie = "supabase-auth-token=; path=/; max-age=0";
    router.push("/admin/login");
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      is_active: true,
      order_position: categories.length,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (category: ProductCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      is_active: category.is_active,
      order_position: category.order_position,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Auto-gerar slug ao digitar nome
    if (field === "name" && !editingCategory) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(value),
      }));
    }
  };

  const handleSaveCategory = async () => {
    if (!formData.name.trim() || !formData.slug.trim()) {
      alert("Nome e Slug são obrigatórios");
      return;
    }

    try {
      if (editingCategory) {
        // Atualizar
        const { error } = await supabase
          .from("product_categories")
          // @ts-expect-error - Supabase types not inferring correctly
          .update({
            name: formData.name,
            slug: formData.slug,
            description: formData.description,
            is_active: formData.is_active,
            order_position: formData.order_position,
          })
          .eq("id", editingCategory.id);

        if (error) throw error;
        alert("Categoria atualizada com sucesso!");
      } else {
        // Criar
        const { error } = await supabase
          .from("product_categories")
          // @ts-expect-error - Supabase types not inferring correctly
          .insert({
            name: formData.name,
            slug: formData.slug,
            description: formData.description,
            is_active: formData.is_active,
            order_position: formData.order_position,
          });

        if (error) throw error;
        alert("Categoria criada com sucesso!");
      }

      closeModal();
      loadCategories();
    } catch (error: any) {
      console.error("Erro ao salvar categoria:", error);
      if (error.code === "23505") {
        alert("Erro: Já existe uma categoria com esse nome ou slug");
      } else {
        alert("Erro ao salvar categoria");
      }
    }
  };

  const handleDeleteCategory = async (category: ProductCategory) => {
    if (!confirm(`Tem certeza que deseja excluir "${category.name}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from("product_categories")
        .delete()
        .eq("id", category.id);

      if (error) throw error;

      alert("Categoria excluída com sucesso!");
      loadCategories();
    } catch (error) {
      console.error("Erro ao excluir categoria:", error);
      alert("Erro ao excluir categoria");
    }
  };

  const handleToggleActive = async (category: ProductCategory) => {
    try {
      const { error } = await supabase
        .from("product_categories")
        // @ts-expect-error - Supabase types not inferring correctly
        .update({ is_active: !category.is_active })
        .eq("id", category.id);

      if (error) throw error;

      loadCategories();
    } catch (error) {
      console.error("Erro ao alterar status:", error);
      alert("Erro ao alterar status");
    }
  };

  const handleMoveCategory = async (category: ProductCategory, direction: "up" | "down") => {
    const currentIndex = categories.findIndex(c => c.id === category.id);
    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (newIndex < 0 || newIndex >= categories.length) return;

    const otherCategory = categories[newIndex];

    try {
      // @ts-expect-error - Supabase types not inferring correctly
      await supabase.from("product_categories").update({ order_position: newIndex }).eq("id", category.id);
      // @ts-expect-error - Supabase types not inferring correctly
      await supabase.from("product_categories").update({ order_position: currentIndex }).eq("id", otherCategory.id);

      loadCategories();
    } catch (error) {
      console.error("Erro ao reordenar:", error);
      alert("Erro ao reordenar categorias");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="text-gray-600 hover:text-gray-900">
                ← Voltar
              </Link>
              <h1 className="text-xl font-bold text-gray-900">Gerenciar Categorias de Produtos</h1>
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-700 hover:text-gray-900 cursor-pointer"
            >
              Sair
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          {/* Info banner */}
          <div className="mb-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600 flex-shrink-0 mt-0.5">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
              <div className="flex-1">
                <p className="text-sm text-purple-900">
                  <strong>As categorias são usadas para organizar e filtrar produtos na página pública.</strong>
                  Ao criar/editar um produto, você pode associá-lo a uma categoria (Acessórios, Arcos, Brindes, Fantasias).
                </p>
                <Link
                  href="/admin/products"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-purple-600 hover:text-purple-700 hover:underline mt-2"
                >
                  Ir para Produtos →
                </Link>
              </div>
            </div>
          </div>

          {/* Header Actions */}
          <div className="mb-6 flex justify-between items-center">
            <button
              onClick={openCreateModal}
              className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 flex items-center gap-2 shadow-sm"
            >
              <Plus size={20} />
              Nova Categoria
            </button>
          </div>

          {/* Categories List */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Carregando...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-500">Nenhuma categoria encontrada</p>
            </div>
          ) : (
            <div className="space-y-4">
              {categories.map((category, index) => (
                <div
                  key={category.id}
                  className="bg-white rounded-lg shadow p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => handleMoveCategory(category, "up")}
                          disabled={index === 0}
                          className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Mover para cima"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => handleMoveCategory(category, "down")}
                          disabled={index === categories.length - 1}
                          className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Mover para baixo"
                        >
                          ↓
                        </button>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{category.name}</h3>
                        <p className="text-sm text-gray-500">/{category.slug}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleActive(category)}
                        className={`px-3 py-1 rounded text-sm font-medium ${
                          category.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {category.is_active ? "Ativo" : "Inativo"}
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4">{category.description || "Sem descrição"}</p>

                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <span>📍 Posição: {category.order_position + 1}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(category)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
                    >
                      <Pencil size={16} />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category)}
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center gap-2"
                    >
                      <Trash2 size={16} />
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal Create/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingCategory ? "Editar Categoria" : "Nova Categoria"}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleFormChange("name", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Ex: Infantis"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slug (URL) *
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => handleFormChange("slug", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Ex: infantis"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleFormChange("description", e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Descreva a categoria..."
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => handleFormChange("is_active", e.target.checked)}
                    className="border-gray-300 text-pink-600 focus:ring-pink-500"
                  />
                  <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                    Categoria ativa (visível no site)
                  </label>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleSaveCategory}
                  className="flex-1 bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700"
                >
                  {editingCategory ? "Salvar Alterações" : "Criar Categoria"}
                </button>
                <button
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
