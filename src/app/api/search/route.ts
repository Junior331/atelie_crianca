/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

interface SearchResult {
  id: string;
  title: string;
  type: "workshop" | "product" | "page";
  url: string;
  description?: string;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ results: [] });
    }

    const searchTerm = query.trim().toLowerCase();
    const results: SearchResult[] = [];

    // Search in workshops
    const { data: workshops } = await supabase
      .from("workshops")
      .select("id, title, slug, description")
      .eq("is_active", true)
      .ilike("title", `%${searchTerm}%`);

    if (workshops) {
      workshops.forEach((workshop: any) => {
        results.push({
          id: workshop.id,
          title: workshop.title,
          type: "workshop",
          url: `/workshop/${workshop.slug}`,
          description: workshop.description,
        });
      });
    }

    // Search in workshops by description
    const { data: workshopsByDesc } = await supabase
      .from("workshops")
      .select("id, title, slug, description")
      .eq("is_active", true)
      .ilike("description", `%${searchTerm}%`)
      .limit(5);

    if (workshopsByDesc) {
      workshopsByDesc.forEach((workshop: any) => {
        // Avoid duplicates
        if (!results.find((r) => r.id === workshop.id && r.type === "workshop")) {
          results.push({
            id: workshop.id,
            title: workshop.title,
            type: "workshop",
            url: `/workshop/${workshop.slug}`,
            description: workshop.description,
          });
        }
      });
    }

    // Search in products
    const { data: products } = await supabase
      .from("products")
      .select("id, name, slug, description")
      .eq("is_active", true)
      .ilike("name", `%${searchTerm}%`);

    if (products) {
      products.forEach((product: any) => {
        results.push({
          id: product.id,
          title: product.name,
          type: "product",
          url: `/products/${product.slug}`,
          description: product.description,
        });
      });
    }

    // Search in products by description
    const { data: productsByDesc } = await supabase
      .from("products")
      .select("id, name, slug, description")
      .eq("is_active", true)
      .ilike("description", `%${searchTerm}%`)
      .limit(5);

    if (productsByDesc) {
      productsByDesc.forEach((product: any) => {
        // Avoid duplicates
        if (!results.find((r) => r.id === product.id && r.type === "product")) {
          results.push({
            id: product.id,
            title: product.name,
            type: "product",
            url: `/products/${product.slug}`,
            description: product.description,
          });
        }
      });
    }

    // Static pages matching
    const staticPages = [
      { name: "Quem somos", href: "/about", keywords: ["sobre", "equipe", "história", "quem somos"] },
      { name: "Oficinas", href: "/workshops", keywords: ["oficina", "workshop", "atividade"] },
      { name: "Brinquedoteca", href: "/playroom", keywords: ["brinquedo", "playroom", "diversão", "criança"] },
      { name: "Casamentos", href: "/wedding", keywords: ["casamento", "wedding", "festa", "celebração", "noiva", "noivo"] },
      { name: "Produtos", href: "/products", keywords: ["produto", "comprar", "loja"] },
      { name: "Mesa de Lanchinho", href: "/souvenirstable", keywords: ["lanche", "mesa", "souvenir", "comida"] },
      { name: "Corporativo", href: "/corporate", keywords: ["corporativo", "empresa", "negócio"] },
      { name: "Mobiliário", href: "/furniture", keywords: ["mobiliário", "móvel", "furniture", "decoração"] },
      { name: "Grupo Ateliê", href: "/ateliegroup", keywords: ["grupo", "ateliê"] },
    ];

    staticPages.forEach((page) => {
      const matchesName = page.name.toLowerCase().includes(searchTerm);
      const matchesKeywords = page.keywords.some((keyword) =>
        keyword.includes(searchTerm)
      );

      if (matchesName || matchesKeywords) {
        results.push({
          id: page.href,
          title: page.name,
          type: "page",
          url: page.href,
        });
      }
    });

    // Limit total results
    const limitedResults = results.slice(0, 10);

    return NextResponse.json({ results: limitedResults });
  } catch (error) {
    console.error("Erro na busca:", error);
    return NextResponse.json(
      { error: "Erro ao realizar busca" },
      { status: 500 }
    );
  }
}
