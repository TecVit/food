import { supabase } from "@/lib/supabase/Config";
import { NextRequest, NextResponse } from "next/server";

const SUBSCRIPTION_KEY = process.env.SUBSCRIPTION_KEY;

export async function POST(req: NextRequest) {
  try {
    const { type } = await req.json();

    if (!type || type !== 'store' && type !== 'client') {
      return NextResponse.json({ status: 400, error: `Valor do campo "Type" inválido` }, { status: 400 });
    }

    if (type === "store") {
      const subscriptionKey = req.headers.get("subscription-key");
      if (!subscriptionKey || subscriptionKey !== SUBSCRIPTION_KEY) {
        return NextResponse.json(
          { error: "Acesso negado: Chave inválida" },
          { status: 403 }
        );
      }
    }

    const path = type === 'client' ? 'entrar/cliente' : type === 'store' ? 'entrar/empresa' : '';

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_URL}/${path}`,
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ url: data.url }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}