import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { supabase } from "@/lib/supabase/Config";

const JWT_SECRET = process.env.JWT_SECRET_KEY!;

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Token não fornecido" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const { app_metadata, exp, user_metadata, sub: id } = decoded as { app_metadata: { provider?: string }, sub?: string, exp: number, user_metadata?: { full_name?: string; email?: string; } };
    if (!exp || Date.now() >= exp * 1000) {
      return NextResponse.json({ error: "Token expirado" }, { status: 401 });
    }

    type UserMetadata = {
      role?: string,
      full_name?: string,
      email?: string,
    }
  
    const { full_name, email, role  } = user_metadata as UserMetadata;
    const { provider } = app_metadata || {};

    if (provider === "google") {
      // Only client has login with google
      const { error: profileError } = await supabase
      .from("client")
      .upsert(
        [{ id, full_name, email }],
        { onConflict: "id" }
      );
  
      if (profileError) {
        console.error("Erro ao inserir perfil:", profileError);
        return NextResponse.json({ error: "Erro ao criar perfil do usuário" }, { status: 500 });
      }
    }
    
    return NextResponse.json({ valid: true, data: {
      full_name,
      email,
      id,
      role,
    } }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }
}