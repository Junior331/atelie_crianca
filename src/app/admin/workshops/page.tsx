/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import type { Workshop, WorkshopImage, WorkshopWithImages } from "@/types/database";
import { Pencil, Trash2, Plus, X, Upload, Eye } from "lucide-react";

export default function WorkshopsAdmin() {
  const router = useRouter();
  const [workshops, setWorkshops] = useState<WorkshopWithImages[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingWorkshop, setEditingWorkshop] = useState<WorkshopWithImages | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    category_id: "",
    category_ids: [] as string[], // Múltiplas categorias
    is_active: true,
    order_position: 0,
  });

  useEffect(() => {
    checkAuth();
    loadWorkshops();
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
        .from("workshop_categories")
        .select("*")
        .eq("is_active", true)
        .order("order_position", { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    }
  };

  const loadWorkshops = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("workshops")
        .select(`
          *,
          workshop_images(*),
          workshop_category:workshop_categories(*)
        `)
        .order("order_position", { ascending: true });

      if (error) throw error;

      // Carregar categorias para cada workshop
      const workshopsWithCategories = await Promise.all(
        (data as WorkshopWithImages[]).map(async (workshop) => {
          const { data: relations } = await supabase
            .from("workshop_category_relations")
            .select("category_id, workshop_categories(*)")
            .eq("workshop_id", workshop.id);

          const categories = relations?.map((rel: any) => rel.workshop_categories).filter(Boolean) || [];

          return {
            ...workshop,
            workshop_images: workshop.workshop_images.sort((a, b) => a.order_position - b.order_position),
            workshop_categories: categories,
          };
        })
      );

      setWorkshops(workshopsWithCategories);
    } catch (error) {
      console.error("Erro ao carregar oficinas:", error);
      alert("Erro ao carregar oficinas");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    document.cookie = "supabase-auth-token=; path=/; max-age=0";
    router.push("/admin/login");
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const openCreateModal = () => {
    setEditingWorkshop(null);
    setFormData({
      title: "",
      slug: "",
      description: "",
      category_id: "",
      category_ids: [],
      is_active: true,
      order_position: workshops.length,
    });
    setIsModalOpen(true);
  };

  const openEditModal = async (workshop: WorkshopWithImages) => {
    setEditingWorkshop(workshop);

    // Carregar categorias selecionadas
    const { data: relations } = await supabase
      .from("workshop_category_relations")
      .select("category_id")
      .eq("workshop_id", workshop.id);

    const categoryIds = relations?.map(rel => rel.category_id) || [];

    setFormData({
      title: workshop.title,
      slug: workshop.slug,
      description: workshop.description || "",
      category_id: workshop.category_id || "",
      category_ids: categoryIds,
      is_active: workshop.is_active,
      order_position: workshop.order_position,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingWorkshop(null);
  };

  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Auto-gerar slug ao digitar título
    if (field === "title" && !editingWorkshop) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(value),
      }));
    }
  };

  const handleSaveWorkshop = async () => {
    if (!formData.title.trim() || !formData.slug.trim()) {
      alert("Título e Slug são obrigatórios");
      return;
    }

    try {
      let workshopId: string;

      if (editingWorkshop) {
        // Atualizar
        const { error } = await supabase
          .from("workshops")
          // @ts-expect-error - Supabase types not inferring correctly
          .update({
            title: formData.title,
            slug: formData.slug,
            description: formData.description,
            category_id: formData.category_id || null,
            is_active: formData.is_active,
            order_position: formData.order_position,
          })
          .eq("id", editingWorkshop.id);

        if (error) throw error;
        workshopId = editingWorkshop.id;
      } else {
        // Criar
        const { data, error } = await supabase
          .from("workshops")
          // @ts-expect-error - Supabase types not inferring correctly
          .insert({
            title: formData.title,
            slug: formData.slug,
            description: formData.description,
            category_id: formData.category_id || null,
            is_active: formData.is_active,
            order_position: formData.order_position,
          })
          .select()
          .single();

        if (error) throw error;
        workshopId = data.id;
      }

      // Atualizar relações de categorias
      // Deletar relações existentes
      await supabase
        .from("workshop_category_relations")
        .delete()
        .eq("workshop_id", workshopId);

      // Inserir novas relações
      if (formData.category_ids.length > 0) {
        const relations = formData.category_ids.map(categoryId => ({
          workshop_id: workshopId,
          category_id: categoryId,
        }));

        const { error: relError } = await supabase
          .from("workshop_category_relations")
          // @ts-expect-error - Supabase types not inferring correctly
          .insert(relations);

        if (relError) throw relError;
      }

      alert(editingWorkshop ? "Oficina atualizada com sucesso!" : "Oficina criada com sucesso!");
      closeModal();
      loadWorkshops();
    } catch (error: any) {
      console.error("Erro ao salvar oficina:", error);
      if (error.code === "23505") {
        alert("Erro: Já existe uma oficina com esse slug");
      } else {
        alert("Erro ao salvar oficina");
      }
    }
  };

  const handleDeleteWorkshop = async (workshop: WorkshopWithImages) => {
    if (!confirm(`Tem certeza que deseja excluir "${workshop.title}"? Todas as imagens também serão removidas.`)) {
      return;
    }

    try {
      // Deletar imagens do storage
      for (const img of workshop.workshop_images) {
        if (img.image_url.includes("/workshops/")) {
          const path = img.image_url.split("/workshops/")[1];
          await supabase.storage.from("images").remove([`workshops/${path}`]);
        }
      }

      // Deletar oficina (cascade vai remover workshop_images automaticamente)
      const { error } = await supabase
        .from("workshops")
        .delete()
        .eq("id", workshop.id);

      if (error) throw error;

      alert("Oficina excluída com sucesso!");
      loadWorkshops();
    } catch (error) {
      console.error("Erro ao excluir oficina:", error);
      alert("Erro ao excluir oficina");
    }
  };

  const handleToggleActive = async (workshop: Workshop) => {
    try {
      const { error } = await supabase
        .from("workshops")
        // @ts-expect-error - Supabase types not inferring correctly
        .update({ is_active: !workshop.is_active })
        .eq("id", workshop.id);

      if (error) throw error;

      loadWorkshops();
    } catch (error) {
      console.error("Erro ao alterar status:", error);
      alert("Erro ao alterar status");
    }
  };

  const handleUploadImage = async (workshopId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(workshopId);

    try {
      const workshop = workshops.find(w => w.id === workshopId);
      const currentPosition = workshop ? workshop.workshop_images.length : 0;

      const imagesToInsert: { workshop_id: string; image_url: string; order_position: number }[] = [];

      // Upload de todas as imagens
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split(".").pop();
        const fileName = `${workshopId}-${Date.now()}-${i}.${fileExt}`;
        const filePath = `workshops/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("images")
          .upload(filePath, file);

        if (uploadError) {
          console.error(`Erro ao fazer upload de ${file.name}:`, uploadError);
          continue; // Continua com os próximos arquivos
        }

        const { data: { publicUrl } } = supabase.storage
          .from("images")
          .getPublicUrl(filePath);

        imagesToInsert.push({
          workshop_id: workshopId,
          image_url: publicUrl,
          order_position: currentPosition + i,
        });
      }

      // Inserir todas as imagens no banco de uma vez
      if (imagesToInsert.length > 0) {
        const { error: dbError } = await supabase
          .from("workshop_images")
          // @ts-expect-error - Supabase types not inferring correctly
          .insert(imagesToInsert);

        if (dbError) throw dbError;
      }

      const successCount = imagesToInsert.length;
      const failCount = files.length - successCount;

      if (failCount > 0) {
        alert(`${successCount} imagem(ns) enviada(s) com sucesso! ${failCount} falhou(aram).`);
      } else {
        alert(`${successCount} imagem(ns) enviada(s) com sucesso!`);
      }

      loadWorkshops();

      // Limpar o input
      event.target.value = "";
    } catch (error) {
      console.error("Erro ao fazer upload:", error);
      alert("Erro ao fazer upload das imagens");
    } finally {
      setUploading(null);
    }
  };

  const handleDeleteImage = async (image: WorkshopImage) => {
    if (!confirm("Tem certeza que deseja remover esta imagem?")) return;

    try {
      if (image.image_url.includes("/workshops/")) {
        const path = image.image_url.split("/workshops/")[1];
        await supabase.storage.from("images").remove([`workshops/${path}`]);
      }

      const { error } = await supabase
        .from("workshop_images")
        .delete()
        .eq("id", image.id);

      if (error) throw error;

      alert("Imagem removida com sucesso!");
      loadWorkshops();
    } catch (error) {
      console.error("Erro ao remover imagem:", error);
      alert("Erro ao remover imagem");
    }
  };

  const handleMoveWorkshop = async (workshop: Workshop, direction: "up" | "down") => {
    const currentIndex = workshops.findIndex(w => w.id === workshop.id);
    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (newIndex < 0 || newIndex >= workshops.length) return;

    const otherWorkshop = workshops[newIndex];

    try {
      // @ts-expect-error - Supabase types not inferring correctly
      await supabase.from("workshops").update({ order_position: newIndex }).eq("id", workshop.id);
      // @ts-expect-error - Supabase types not inferring correctly  
      await supabase.from("workshops").update({ order_position: currentIndex }).eq("id", otherWorkshop.id);

      loadWorkshops();
    } catch (error) {
      console.error("Erro ao reordenar:", error);
      alert("Erro ao reordenar oficinas");
    }
  };

  const filteredWorkshops = workshops.filter(w =>
    w.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.description?.toLowerCase().includes(searchTerm.toLowerCase())
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
              <h1 className="text-xl font-bold text-gray-900">Gerenciar Oficinas</h1>
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
                Nova Oficina
              </button>

              <Link
                href="/admin/categories"
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
              placeholder="Buscar oficinas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent w-full sm:w-64"
            />
          </div>

          {/* Workshops List */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Carregando...</p>
            </div>
          ) : filteredWorkshops.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-500">Nenhuma oficina encontrada</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredWorkshops.map((workshop, index) => (
                <div
                  key={workshop.id}
                  className="bg-white rounded-lg shadow p-6"
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Info Section */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col gap-1">
                            <button
                              onClick={() => handleMoveWorkshop(workshop, "up")}
                              disabled={index === 0}
                              className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                              title="Mover para cima"
                            >
                              ↑
                            </button>
                            <button
                              onClick={() => handleMoveWorkshop(workshop, "down")}
                              disabled={index === filteredWorkshops.length - 1}
                              className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                              title="Mover para baixo"
                            >
                              ↓
                            </button>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{workshop.title}</h3>
                            <p className="text-sm text-gray-500">/{workshop.slug}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleActive(workshop)}
                            className={`px-3 py-1 rounded text-sm font-medium ${
                              workshop.is_active
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {workshop.is_active ? "Ativo" : "Inativo"}
                          </button>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4">{workshop.description || "Sem descrição"}</p>

                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4 flex-wrap">
                        <span>📸 {workshop.workshop_images.length} {workshop.workshop_images.length === 1 ? "imagem" : "imagens"}</span>
                        <span>📍 Posição: {workshop.order_position + 1}</span>
                        {workshop.workshop_categories && workshop.workshop_categories.length > 0 && (
                          <div className="flex gap-1 flex-wrap">
                            {workshop.workshop_categories.map((category) => (
                              <span key={category.id} className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium">
                                {category.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(workshop)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
                        >
                          <Pencil size={16} />
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteWorkshop(workshop)}
                          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center gap-2"
                        >
                          <Trash2 size={16} />
                          Excluir
                        </button>
                        <Link
                          href={`/workshop/${workshop.slug}`}
                          target="_blank"
                          className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 flex items-center gap-2"
                        >
                          <Eye size={16} />
                          Ver no Site
                        </Link>
                      </div>
                    </div>

                    {/* Images Section */}
                    <div className="lg:w-1/2">
                      <h4 className="font-semibold text-gray-900 mb-3">Imagens</h4>
                      <div className="grid grid-cols-3 gap-2 mb-3 overflow-y-auto max-h-56">
                        {workshop.workshop_images.map((img) => (
                          <div key={img.id} className="relative aspect-square group">
                            <Image
                              src={img.image_url}
                              alt={workshop.title}
                              fill
                              className="object-cover rounded"
                            />
                            <button
                              onClick={() => handleDeleteImage(img)}
                              className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => handleUploadImage(workshop.id, e)}
                          className="hidden"
                          id={`upload-${workshop.id}`}
                          disabled={uploading === workshop.id}
                        />
                        <label
                          htmlFor={`upload-${workshop.id}`}
                          className={`px-4 py-2 rounded-md flex items-center gap-2 justify-center transition-colors ${
                            uploading === workshop.id
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-pink-600 hover:bg-pink-700 cursor-pointer"
                          } text-white`}
                        >
                          <Upload size={16} />
                          {uploading === workshop.id ? "Enviando..." : "Upload de Imagens"}
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
                  {editingWorkshop ? "Editar Oficina" : "Nova Oficina"}
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
                    Título *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleFormChange("title", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Ex: Oficina de Aquário"
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
                    placeholder="Ex: oficina-de-aquario"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    URL será: /workshop/{formData.slug}
                  </p>
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
                    placeholder="Descreva a oficina..."
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Categorias (selecione uma ou mais)
                    </label>
                    <Link
                      href="/admin/categories"
                      target="_blank"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-pink-600 hover:text-pink-700 hover:underline bg-pink-50 px-3 py-1 rounded-full transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 5v14M5 12h14"/>
                      </svg>
                      Gerenciar Categorias
                    </Link>
                  </div>
                  <div className="border border-gray-300 rounded-md p-3 max-h-48 overflow-y-auto space-y-2">
                    {categories.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-2">
                        Nenhuma categoria disponível
                      </p>
                    ) : (
                      categories.map((category) => (
                        <label
                          key={category.id}
                          className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={formData.category_ids.includes(category.id)}
                            onChange={(e) => {
                              const newCategoryIds = e.target.checked
                                ? [...formData.category_ids, category.id]
                                : formData.category_ids.filter(id => id !== category.id);
                              handleFormChange("category_ids", newCategoryIds);
                            }}
                            className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                          />
                          <span className="text-sm text-gray-700">{category.name}</span>
                        </label>
                      ))
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    A oficina aparecerá nos filtros de todas as categorias selecionadas
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
                    Oficina ativa (visível no site)
                  </label>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleSaveWorkshop}
                  className="flex-1 bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700"
                >
                  {editingWorkshop ? "Salvar Alterações" : "Criar Oficina"}
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
