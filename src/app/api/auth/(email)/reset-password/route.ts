import { supabase } from "@/lib/supabase/Config";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // const { error } = supabase.auth.admin.
    const { error } = { error: { message: "" } };

    if (error) {
      return NextResponse.json({ error: `Erro ao reenviar o e-mail de confirmação: ${error.message}` }, { status: 400 });
     } else {
      return NextResponse.json({ status: 200, message: "E-mail de confirmação reenviado com sucesso!" }, { status: 200 });
    }

    return NextResponse.json({ message: "Deslogado com sucesso!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}