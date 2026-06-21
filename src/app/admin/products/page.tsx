/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { uploadFile } from "@/utils/upload-helpers";
import { deleteFromR2 } from "@/lib/r2-client";
import Image from "next/image";
import Link from "next/link";
import type { ProductWithImages, ProductImage } from "@/types/database";
import { Pencil, Trash2, Plus, X, Upload } from "lucide-react";

export default function ProductsAdmin() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductWithImages[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProduct, setEditingProduct] = useState<ProductWithImages | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    category_id: "",
    is_active: true,
    order_position: 0,
  });

  useEffect(() => {
    checkAuth();
    loadProducts();
    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) router.push("/admin/login");
  };

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("product_categories")
        .select("*")
        .eq("is_active", true)
        .order("order_position", { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          product_images(*),
          product_category:product_categories(*)
        `)
        .order("order_position", { ascending: true });

      if (error) throw error;

      // Ordenar imagens de cada produto
      const productsWithSortedImages = (data as ProductWithImages[]).map(product => ({
        ...product,
        product_images: product.product_images.sort((a, b) => a.order_position - b.order_position)
      }));

      setProducts(productsWithSortedImages);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      alert("Erro ao carregar produtos");
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
    setEditingProduct(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      category_id: "",
      is_active: true,
      order_position: products.length,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: ProductWithImages) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description || "",
      category_id: product.category_id || "",
      is_active: product.is_active,
      order_position: product.order_position,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Auto-gerar slug ao digitar nome
    if (field === "name" && !editingProduct) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(value),
      }));
    }
  };

  const handleSaveProduct = async () => {
    if (!formData.name.trim() || !formData.slug.trim()) {
      alert("Nome e Slug são obrigatórios");
      return;
    }

    try {
      if (editingProduct) {
        const oldPosition = editingProduct.order_position;
        const newPosition = formData.order_position;

        // Atualizar o produto atual primeiro
        const { error } = await supabase
          .from("products")
          // @ts-expect-error - Supabase types not inferring correctly
          .update({
            name: formData.name,
            slug: formData.slug,
            description: formData.description,
            category_id: formData.category_id || null,
            is_active: formData.is_active,
            order_position: newPosition,
          })
          .eq("id", editingProduct.id);

        if (error) throw error;

        // Se a posição mudou, reorganizar todos os produtos para evitar duplicatas
        if (oldPosition !== newPosition) {
          // Buscar todos os produtos ordenados
          const { data: allProducts } = await supabase
            .from("products")
            .select("id, order_position")
            .order("order_position", { ascending: true });

          if (allProducts) {
            // Criar array com as posições corretas
            const productsToUpdate: Array<{id: string, newPos: number}> = [];

            // Remover o produto editado da lista
            const otherProducts: any = allProducts.filter((p: any) => p.id !== editingProduct.id);

            // Encontrar onde inserir o produto editado
            let currentPos = 0;
            for (let i = 0; i < otherProducts.length; i++) {
              if (currentPos === newPosition) {
                currentPos++; // Pular a posição do produto editado
              }

              if (otherProducts[i].order_position !== currentPos) {
                productsToUpdate.push({
                  id: otherProducts[i].id,
                  newPos: currentPos
                });
              }
              currentPos++;
            }

            // Atualizar todos os produtos que precisam
            for (const update of productsToUpdate) {
              await supabase
                .from("products")
                // @ts-expect-error - Supabase types not inferring correctly
                .update({ order_position: update.newPos })
                .eq("id", update.id);
            }
          }
        }

        alert("Produto atualizado com sucesso!");
      } else {
        // Criar
        const { error } = await supabase
          .from("products")
          // @ts-expect-error - Supabase types not inferring correctly
          .insert({
            name: formData.name,
            slug: formData.slug,
            description: formData.description,
            category_id: formData.category_id || null,
            is_active: formData.is_active,
            order_position: formData.order_position,
          });

        if (error) throw error;
        alert("Produto criado com sucesso!");
      }

      closeModal();
      loadProducts();
    } catch (error: any) {
      console.error("Erro ao salvar produto:", error);
      if (error.code === "23505") {
        alert("Erro: Já existe um produto com esse slug");
      } else {
        alert("Erro ao salvar produto");
      }
    }
  };

  const handleDeleteProduct = async (product: ProductWithImages) => {
    if (!confirm(`Tem certeza que deseja excluir "${product.name}"? Todas as imagens também serão removidas.`)) {
      return;
    }

    try {
      // Deletar imagens do storage (R2 ou Supabase)
      for (const img of product.product_images) {
        try {
          const urlParts = img.image_url.split('/');
          const filename = urlParts[urlParts.length - 1];
          const path = `images/products/${filename}`;
          await deleteFromR2(path);
        } catch (deleteError) {
          console.warn("Erro ao deletar imagem do storage:", deleteError);
        }
      }

      // Deletar produto (cascade vai remover product_images automaticamente)
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", product.id);

      if (error) throw error;

      alert("Produto excluído com sucesso!");
      loadProducts();
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      alert("Erro ao excluir produto");
    }
  };

  const handleToggleActive = async (product: ProductWithImages) => {
    try {
      const { error } = await supabase
        .from("products")
        // @ts-expect-error - Supabase types not inferring correctly
        .update({ is_active: !product.is_active })
        .eq("id", product.id);

      if (error) throw error;

      loadProducts();
    } catch (error) {
      console.error("Erro ao alterar status:", error);
      alert("Erro ao alterar status");
    }
  };

  const handleUploadImage = async (productId: string) => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${productId}-${Date.now()}.${fileExt}`;

      const { url, error: uploadError } = await uploadFile(file, "images", `products/${fileName}`);

      if (uploadError) throw new Error(uploadError);

      // Obter a próxima posição
      const product = products.find(p => p.id === productId);
      const nextPosition = product ? product.product_images.length : 0;

      const { error: dbError } = await supabase
        .from("product_images")
        // @ts-expect-error - Supabase types not inferring correctly
        .insert({
          product_id: productId,
          image_url: url,
          order_position: nextPosition,
        });

      if (dbError) throw dbError;

      alert("Imagem enviada com sucesso!");
      loadProducts();

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Erro ao fazer upload:", error);
      alert("Erro ao fazer upload da imagem");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (image: ProductImage) => {
    if (!confirm("Tem certeza que deseja remover esta imagem?")) return;

    try {
      // Deletar do storage (R2 ou Supabase)
      try {
        const urlParts = image.image_url.split('/');
        const filename = urlParts[urlParts.length - 1];
        const path = `images/products/${filename}`;
        await deleteFromR2(path);
      } catch (deleteError) {
        console.warn("Erro ao deletar imagem do storage:", deleteError);
      }

      const { error } = await supabase
        .from("product_images")
        .delete()
        .eq("id", image.id);

      if (error) throw error;

      alert("Imagem removida com sucesso!");
      loadProducts();
    } catch (error) {
      console.error("Erro ao remover imagem:", error);
      alert("Erro ao remover imagem");
    }
  };

  const handleUpdateImageField = async (imageId: string, field: "name" | "description", value: string) => {
    try {
      const { error } = await supabase
        .from("product_images")
        // @ts-expect-error - Supabase types not inferring correctly
        .update({ [field]: value || null })
        .eq("id", imageId);

      if (error) throw error;

      // Atualizar o estado local sem recarregar tudo
      setProducts(prev => prev.map(product => ({
        ...product,
        product_images: product.product_images.map(img =>
          img.id === imageId ? { ...img, [field]: value || null } : img
        )
      })));
    } catch (error) {
      console.error(`Erro ao atualizar ${field}:`, error);
      alert(`Erro ao atualizar ${field}`);
    }
  };

  const handleMoveProduct = async (product: ProductWithImages, direction: "up" | "down") => {
    const currentIndex = products.findIndex(p => p.id === product.id);
    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (newIndex < 0 || newIndex >= products.length) return;

    const otherProduct = products[newIndex];

    try {
      // @ts-expect-error - Supabase types not inferring correctly
      await supabase.from("products").update({ order_position: newIndex }).eq("id", product.id);
      // @ts-expect-error - Supabase types not inferring correctly
      await supabase.from("products").update({ order_position: currentIndex }).eq("id", otherProduct.id);

      loadProducts();
    } catch (error) {
      console.error("Erro ao reordenar:", error);
      alert("Erro ao reordenar produtos");
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <h1 className="text-xl font-bold text-gray-900">Gerenciar Produtos</h1>
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

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          {/* Header Actions */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={openCreateModal}
                className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 flex items-center gap-2 shadow-sm"
              >
                <Plus size={20} />
                Novo Produto
              </button>

              <Link
                href="/admin/product-categories"
                className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 flex items-center gap-2 shadow-sm transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7"/>
                  <rect x="14" y="3" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/>
                </svg>
                Gerenciar Categorias
              </Link>
            </div>

            <input
              type="text"
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent w-full sm:w-64"
            />
          </div>

          {/* Products List */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Carregando...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-500">Nenhum produto encontrado</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow p-6"
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Info Section */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col gap-1">
                            <button
                              onClick={() => handleMoveProduct(product, "up")}
                              disabled={index === 0}
                              className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                              title="Mover para cima"
                            >
                              ↑
                            </button>
                            <button
                              onClick={() => handleMoveProduct(product, "down")}
                              disabled={index === filteredProducts.length - 1}
                              className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                              title="Mover para baixo"
                            >
                              ↓
                            </button>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
                            <p className="text-sm text-gray-500">/{product.slug}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleActive(product)}
                            className={`px-3 py-1 rounded text-sm font-medium ${
                              product.is_active
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {product.is_active ? "Ativo" : "Inativo"}
                          </button>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4">{product.description || "Sem descrição"}</p>

                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <span>📸 {product.product_images.length} {product.product_images.length === 1 ? "imagem" : "imagens"}</span>
                        <span>📍 Posição: {product.order_position + 1}</span>
                        {product.product_category && (
                          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium">
                            {product.product_category.name}
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
                        >
                          <Pencil size={16} />
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product)}
                          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center gap-2"
                        >
                          <Trash2 size={16} />
                          Excluir
                        </button>
                      </div>
                    </div>

                    {/* Images Section */}
                    <div className="lg:w-1/2">
                      <h4 className="font-semibold text-gray-900 mb-3">Imagens</h4>
                      <div className="space-y-3 mb-3 overflow-y-auto max-h-96">
                        {product.product_images.map((img, idx) => (
                          <div key={img.id} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                            <div className="flex gap-3">
                              <div className="relative w-20 h-20 flex-shrink-0 group">
                                <Image
                                  src={img.image_url}
                                  alt={img.name || product.name}
                                  fill
                                  className="object-cover rounded"
                                />
                                <button
                                  onClick={() => handleDeleteImage(img)}
                                  className="absolute -top-1 -right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                                >
                                  <X size={12} />
                                </button>
                              </div>
                              <div className="flex-1 space-y-2">
                                <input
                                  type="text"
                                  placeholder={`Nome da imagem ${idx + 1}`}
                                  defaultValue={img.name || ""}
                                  onBlur={(e) => handleUpdateImageField(img.id, "name", e.target.value)}
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-pink-500 focus:border-transparent"
                                />
                                <textarea
                                  placeholder="Descrição (opcional)"
                                  defaultValue={img.description || ""}
                                  onBlur={(e) => handleUpdateImageField(img.id, "description", e.target.value)}
                                  rows={2}
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-pink-500 focus:border-transparent resize-none"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={() => handleUploadImage(product.id)}
                          className="hidden"
                          id={`upload-${product.id}`}
                        />
                        <label
                          htmlFor={`upload-${product.id}`}
                          className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 flex items-center gap-2 cursor-pointer justify-center"
                        >
                          <Upload size={16} />
                          {uploading ? "Enviando..." : "Upload Nova Imagem"}
                        </label>
                      </div>
                    </div>
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
                  {editingProduct ? "Editar Produto" : "Novo Produto"}
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
                    placeholder="Ex: Arco Balões Dourado"
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
                    placeholder="Ex: arco-baloes-dourado"
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
                    placeholder="Descreva o produto..."
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Categoria
                    </label>
                    <Link
                      href="/admin/product-categories"
                      target="_blank"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-pink-600 hover:text-pink-700 hover:underline bg-pink-50 px-3 py-1 rounded-full transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 5v14M5 12h14"/>
                      </svg>
                      Gerenciar Categorias
                    </Link>
                  </div>
                  <select
                    value={formData.category_id}
                    onChange={(e) => handleFormChange("category_id", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="">Sem categoria</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    As categorias são usadas para filtrar os produtos na página pública
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Posição de Exibição
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.order_position + 1}
                    onChange={(e) => handleFormChange("order_position", (parseInt(e.target.value) || 1) - 1)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Menor número = maior prioridade (aparece primeiro no site)
                  </p>
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
                    Produto ativo (visível no site)
                  </label>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleSaveProduct}
                  className="flex-1 bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700"
                >
                  {editingProduct ? "Salvar Alterações" : "Criar Produto"}
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
