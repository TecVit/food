'use client';

import Navbar from "@/app/components/navbar";
import { setCookie } from "@/lib/cookies";
import { notifyError, notifyInfo, notifySuccess } from "@/lib/toastify";
import { BadgeCheck, Eye, EyeClosed, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import '../../auth.css';
import Footer from "@/app/components/footer";
import { FcGoogle } from "react-icons/fc";
import { supabase } from "@/lib/supabase/Config";
import { parse } from "querystring";

const EntrarCliente = () => {

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = parse(hash);

    const access_token = params["access_token"];
    const refresh_token = params["refresh_token"];
    const expires_in = params["expires_in"];

    if (access_token && refresh_token) {
      setCookie("access_token", access_token as string, 1 / 24);
      setCookie("refresh_token", refresh_token as string, 30);

      supabase.auth.setSession({
        access_token: access_token as string,
        refresh_token: refresh_token as string,
      });

      window.location.href = "/cliente/carrinho";
    }
  }, []);

  // Modais
  const [carregando, setCarregando] = useState(false);

  // Inputs
  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Functions
  const handleEntrar = async () => {
    if (carregando) {
      notifyInfo("Aviso", 'Aguarde a ultima requisição terminar');
      return;
    }
    setCarregando(true);
    try {
      if (!inputEmail || !inputPassword) {
        notifyError("Aviso", 'Por favor, preencha todos os campos obrigatórios.');
        return false;
      }
      if (inputPassword && inputPassword.length < 6) {
        notifyInfo("Aviso", 'A senha deve conter no mínimo 6 caracteres.');
        return false;
      }
      
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          type: "client",
          email: inputEmail, 
          password: inputPassword 
        }),
      });

      const data = await response.json();
      
      if (!data) return;

      if (data.error === "Email not confirmed") {
        notifyError("Aviso", 'Email não confirmado, por favor, verifique seu endereço eletrônico!');
        return;
      }

      if (response.status === 200) {
        const user = data.user;
        const session = data.session.access_token;
        
        setCookie('access_token', session.access_token);
        setCookie('refresh_token', session.refresh_token);
        setCookie('name', user.user_metadata.full_name);
        setCookie('email', user.email);
        setCookie('id', user.id);
        
        notifySuccess("Aviso", `Bem-Vindo Cliente, ${user.user_metadata.full_name}!`);
        setTimeout(() => {
          window.location.href = "/cliente";
        }, 3750);
      
      } else {
        notifyError("Aviso", 'Email ou Senha inválidos!');
      }

      return false;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setCarregando(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      const response = await fetch("/api/auth/google", {
        method: "POST",
      });
  
      const result = await response.json();
  
      if (response.ok && result.url) {
        window.location.href = result.url;
      } else {
        console.error("Erro ao autenticar:", result.error);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  }  

  return (
    <main className="container-auth">
      
      <Navbar />

      <section className="content-auth">
        <div className="form">
          <div className="content">
            <h1>Olá Cliente, Entre em sua conta</h1>
            <div style={{ margin: '0px 0px 15px 0px' }} className="tecvit-alert success">
              <BadgeCheck className='icon' />
              <div className="text">
                <h1>NOVIDADES</h1>
                <p>Ganhe 15% OFF no seu primeiro pedido em nosso site, basta finalizar seu cadastro e escolher seu produto. <Link href="/cadastrar/cliente">Clique Aqui</Link></p>
              </div>
            </div>
            <div className="input">
              <label>Email</label>
              <input value={inputEmail} onChange={(e) => setInputEmail(e.target.value)} placeholder='example@email.com' type="text" />
            </div>
            <div className="input">
              <label>Senha</label>
              <input value={inputPassword} onChange={(e) => setInputPassword(e.target.value)} placeholder='••••••••' type={showPassword ? 'text' : 'password'} />
              {showPassword ? (
                <Eye onClick={() => setShowPassword(false)} className='eye' />
              ) : (
                <EyeClosed onClick={() => setShowPassword(true)} className='eye' />
              )}
            </div>
            <Link href="/redefinir-senha">Esqueci minha senha</Link>
            <button onClick={handleEntrar} className='btn-tertiary'>
              {carregando ? (
                <div className="loader"></div>
              ) : (
                <>Entrar</>
              )}
            </button>
            <div className="ou">
              <div></div>
              <p>OU</p>
              <div></div>
            </div>
            <button onClick={loginWithGoogle} className='btn-quaternary'>
              {carregando ? (
                <div className="loader"></div>
              ) : (
                <>
                  <FcGoogle className="icon" />
                  Entrar com Google
                </>
              )}
            </button>
          </div>
        </div>

        <p>Não tem uma conta? <Link href="/cadastrar/cliente">Cadastrar</Link> </p>

      </section>
    
      <Footer />
    
    </main>
  )
};

export default EntrarCliente;