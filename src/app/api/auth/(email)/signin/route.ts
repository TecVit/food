  import { NextResponse } from 'next/server';
  import { supabase } from '@/lib/supabase/Config';

  export async function POST(req: Request) {
    try {
      const { email, password, type } = await req.json();

      if (!type || type !== 'store' && type !== 'client') {
        return NextResponse.json({ status: 400, error: `Valor do campo "Type" inválido` }, { status: 400 });
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      if (data && data.user && type === 'store') {
        const { data: dataProfiles, error: roleError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user?.id)
        .single();

        if (error) {
          return NextResponse.json({ status: 400, error: "Houve um erro ao tentar buscar seu usuário" }, { status: 400 });
        }

        if (dataProfiles && dataProfiles.role === "store") {
          return NextResponse.json({ role: "store", ...data }, { status: 200 });        
        }
      }

      return NextResponse.json({ role: "client", ...data }, { status: 200 });     
    } catch (error) {
      return NextResponse.json({ error: 'Erro desconhecido' }, { status: 500 });
    }
  }