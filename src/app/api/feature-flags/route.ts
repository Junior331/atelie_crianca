import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Create server-side client with service role for admin operations
const getSupabaseAdmin = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createClient(supabaseUrl, supabaseServiceRole, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("feature_flags")
      .select("*")
      .order("name");

    if (error) {
      console.error("Error fetching feature flags:", error);

      // Fallback: retornar feature flags padrão quando Supabase está bloqueado
      const defaultFlags = [
        { id: '1', name: 'use_database_products', is_enabled: false, description: 'Use database for products' },
        { id: '2', name: 'use_database_workshops', is_enabled: false, description: 'Use database for workshops' },
      ];

      console.warn("Using default feature flags (Supabase blocked)");
      return NextResponse.json(defaultFlags);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error:", error);

    // Fallback em caso de erro
    const defaultFlags = [
      { id: '1', name: 'use_database_products', is_enabled: false },
      { id: '2', name: 'use_database_workshops', is_enabled: false },
    ];

    return NextResponse.json(defaultFlags);
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, is_enabled } = body;

    if (!id || typeof is_enabled !== "boolean") {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("feature_flags")
      .update({ is_enabled, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating feature flag:", error);
      return NextResponse.json(
        { error: "Failed to update feature flag", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
