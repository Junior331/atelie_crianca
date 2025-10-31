/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function UploadPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [orderPosition, setOrderPosition] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    type CategoryRow = { id: string; name: string; slug: string };
    const { data } = await supabase
      .from("categories")
      .select("id, name, slug")
      .order("name");

    if (data) {
      const rows = data as CategoryRow[];
      setCategories(rows);
      if (rows.length > 0) {
        setSelectedCategory(rows[0].id);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file || !selectedCategory) {
      setError("Por favor, selecione uma categoria e uma imagem");
      return;
    }

    setUploading(true);
    setError("");

    try {
      // Upload file to storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(7)}.${fileExt}`;
      const filePath = `${selectedCategory}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("images").getPublicUrl(filePath);

      // Insert into database
      type ImageInsert = {
        category_id: string;
        title: string;
        description: string | null;
        image_url: string;
        storage_path: string;
        order_position: number;
        is_active: boolean;
      };
      const insertValues: ImageInsert[] = [
        {
          category_id: selectedCategory,
          title,
          description: description || null,
          image_url: publicUrl,
          storage_path: filePath,
          order_position: orderPosition,
          is_active: true,
        },
      ];
      const { error: dbError } = await supabase
        .from("images")
        .insert(insertValues as unknown as never[]);

      if (dbError) throw dbError;

      // Reset form
      setTitle("");
      setDescription("");
      setOrderPosition(0);
      setFile(null);
      setPreview(null);

      alert("Imagem enviada com sucesso!");
      router.push("/admin");
    } catch (err: any) {
      setError(err.message || "Erro ao fazer upload");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                Upload de Imagem
              </h1>
            </div>
            <div className="flex items-center">
              <Link href="/admin" className="text-gray-700 hover:text-gray-900">
                Voltar ao Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Categoria *
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                required
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm rounded-md"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Título *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm px-3 py-2"
                placeholder="Nome da imagem"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Descrição
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm px-3 py-2"
                placeholder="Descrição opcional da imagem"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Posição de Ordenação
              </label>
              <input
                type="number"
                value={orderPosition}
                onChange={(e) => setOrderPosition(parseInt(e.target.value))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm px-3 py-2"
                placeholder="0"
              />
              <p className="mt-1 text-sm text-gray-500">
                Número menor aparece primeiro
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Imagem *
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
                className="mt-1 block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-pink-50 file:text-pink-700
                  hover:file:bg-pink-100"
              />
            </div>

            {preview && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preview:
                </label>
                <Image
                  width={600}
                  height={200}
                  src={preview}
                  alt="Preview"
                  className="max-h-64 rounded-lg border border-gray-300"
                />
              </div>
            )}

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <Link
                href="/admin"
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={uploading}
                className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? "Enviando..." : "Enviar Imagem"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
