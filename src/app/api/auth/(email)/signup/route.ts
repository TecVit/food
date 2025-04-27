import { supabase } from "@/lib/supabase/Config";
import { NextRequest, NextResponse } from "next/server";

const SUBSCRIPTION_KEY = process.env.SUBSCRIPTION_KEY;

export async function POST(req: NextRequest) {
  try {
    const { email, password, full_name, type } = await req.json();
    // Type == Role | Client or Store

    if (!type || type !== 'store' && type !== 'client') {
      return NextResponse.json({ status: 400, error: `Valor do campo "Type" inválido` }, { status: 400 });
    }

    if (type === "store") {
      const subscriptionKey = req.headers.get("subscription-key");
      if (!subscriptionKey || subscriptionKey !== SUBSCRIPTION_KEY) {
        return NextResponse.json(
          { error: "Acesso negado: chave inválida" },
          { status: 403 }
        );
      }
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { 
          full_name,
          role: type
        },
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    const userId = data.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Erro ao obter ID do usuário" }, { status: 500 });
    }

    // Role => client | store
    const { error: profileError } = await supabase
    .from(type)
    .insert([{ id: userId, full_name, email: email }]);

    if (profileError) {
      console.error("Erro ao inserir perfil:", profileError);
      return NextResponse.json({ error: `Erro ao criar perfil do usuário: ${profileError}` }, { status: 500 });
    }

    return NextResponse.json({ user: data.user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}