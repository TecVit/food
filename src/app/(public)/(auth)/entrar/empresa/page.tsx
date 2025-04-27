'use client';

import Navbar from "@/app/components/navbar";
import { setCookie } from "@/lib/cookies";
import { notifyError, notifyInfo, notifySuccess } from "@/lib/toastify";
import { BadgeCheck, Eye, EyeClosed, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import '../../auth.css';
import Footer from "@/app/components/footer";
import { FcGoogle } from "react-icons/fc";

const EntrarEmpresa = () => {
  
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
          email: inputEmail, 
          password: inputPassword,
          type: "store",
        }),
      });

      const data = await response.json();
      
      if (!data) return;

      if (response.status === 200) {
        const user = data.user;
        const session = data.session.access_token;
        
        setCookie('access_token', session.access_token);
        setCookie('refresh_token', session.refresh_token);
        setCookie('name', user.user_metadata.full_name);
        setCookie('role', user.user_metadata.role);
        setCookie('email', user.email);
        setCookie('id', user.id);
        
        notifySuccess("Aviso", `Bem-Vindo Loja, ${user.user_metadata.full_name}!`);
        setTimeout(() => {
          window.location.href = "/empresa";
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

  return (
    <main className="container-auth">
      
      <Navbar />

      <section className="content-auth">
        <div className="form">
          <div className="content">
            <h1>Olá, Empresa! Entre em sua conta</h1>
            <div style={{ margin: '0px 0px 15px 0px' }} className="tecvit-alert success">
              <BadgeCheck className='icon' />
              <div className="text">
                <h1>NOVIDADES</h1>
                <p>Ganhe 2 mês de mensalidade gratuita completando seu cadastrado até o dia <strong>20 de Maio de 2025</strong>. <Link href="/cadastrar/empresa">Garantir Agora</Link></p>
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
          </div>
        </div>

        <p>Não tem uma conta? <Link href="/cadastrar/empresa">Cadastrar</Link> </p>

      </section>
    
      <Footer />
    
    </main>
  )
};

export default EntrarEmpresa;