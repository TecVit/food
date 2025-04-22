'use client';

import Navbar from "@/app/components/navbar";
import { setCookie } from "@/lib/cookies";
import { notifyError, notifyInfo, notifySuccess } from "@/lib/toastify";
import { Asterisk, Eye, EyeClosed } from "lucide-react";
import { useEffect, useState } from "react";
import '../../auth.css';
import Footer from "@/app/components/footer";
import { FcGoogle } from "react-icons/fc";
import { supabase } from "@/lib/supabase/Config";
import { parse } from "querystring";
import Link from "next/link";

const CadastrarCliente = () => {

  // Modais
  const [carregando, setCarregando] = useState(false);

  // Inputs
  const [inputFullName, setInputFullName] = useState('');
  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState<string>('');
  const [inputConfirmPassword, setInputConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Functions
  const handleCadastrar = async () => {
    if (carregando) {
      notifyInfo("Aviso", 'Aguarde a ultima requisição terminar');
      return;
    }
    setCarregando(true);
    try {
      if (!inputFullName || !inputEmail || !inputPassword) {
        notifyError("Aviso", 'Por favor, preencha todos os campos obrigatórios.');
        return false;
      }
      if (inputPassword && inputPassword.length < 6) {
        notifyInfo("Aviso", 'A senha deve conter no mínimo 6 caracteres.');
        return false;
      }
      if (inputPassword !== inputConfirmPassword) {
        notifyError("Aviso", 'As senhas devem ser iguais!');
        return false;
      }
      
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          type: "client",
          full_name: inputFullName,
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

      if (response.status === 200 || response.status === 201) {
        const user = data.user;
        
        setCookie('name', user.user_metadata.full_name);
        setCookie('email', user.email);
        setCookie('id', user.id);
        
        notifySuccess("Aviso", `Cadastro realizado com sucesso. Verifique seu endereço eletrônico e confirme seu email "${user.email}"`);
        setTimeout(() => {
          window.location.href = "/entrar/cliente";
        }, 3750);
      
      } else {
        notifyError("Aviso", 'Nome, Email ou Senha inválidos!');
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          type: "client",
          email: inputEmail, 
          password: inputPassword 
        }),
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
        <div style={{ maxWidth: '650px', padding: '0px 30px' }} className="form">
          <div style={{ width: '100%' }} className="content">
            <h1>Olá Cliente, Cadastre uma conta</h1>
            <div className="inputs">
              <div className="input">
                <label>
                  Nome Completo <span><Asterisk className="icon" /></span>
                </label>
                <input
                  name='nome'
                  value={inputFullName}
                  onChange={(e) => setInputFullName(e.target.value)}
                  placeholder='ex: Vitor Silva'
                  type="text"
                />
              </div>

              <div style={{ minWidth: '100%' }} className="input">
                <label>
                  Email <span><Asterisk className="icon" /></span>
                </label>
                <input
                  name='email'
                  value={inputEmail}
                  onChange={(e) => setInputEmail(e.target.value)}
                  placeholder='ex: example@email.com'
                  type="text"
                />
              </div>
  
              <div className="input">
                <label>
                  Senha <span><Asterisk className="icon" /></span>
                </label>
                <input
                  name='senha'
                  value={inputPassword}
                  onChange={(e) => setInputPassword(e.target.value)}
                  placeholder='••••••••'
                  type={showPassword ? 'text' : 'password'}
                />
                {showPassword ? (
                  <Eye onClick={() => setShowPassword(false)} className='eye' />
                ) : (
                  <EyeClosed onClick={() => setShowPassword(true)} className='eye' />
                )}
              </div>
  
              <div className="input">
                <label>
                  Confirmar Senha <span><Asterisk className="icon" /></span>
                </label>
                <input
                  name='senha'
                  value={inputConfirmPassword}
                  onChange={(e) => setInputConfirmPassword(e.target.value)}
                  placeholder='••••••••'
                  type={showConfirmPassword ? 'text' : 'password'}
                />
                {showConfirmPassword ? (
                  <Eye onClick={() => setShowConfirmPassword(false)} className='eye' />
                ) : (
                  <EyeClosed onClick={() => setShowConfirmPassword(true)} className='eye' />
                )}
              </div>
  
              <button onClick={handleCadastrar} className='btn-tertiary'>
                {carregando ? <div className="loader"></div> : <>Cadastrar</>}
              </button>

              <div style={{ margin: '15px 0px 0px 0px' }} className="ou">
                <div></div>
                <p>OU</p>
                <div></div>
              </div>
            
              <button style={{ margin: '15px 0px -10px 0px' }} onClick={loginWithGoogle} className='btn-quaternary'>
                {carregando ? (
                  <div className="loader"></div>
                ) : (
                  <>
                    <FcGoogle className="icon" />
                    Cadastrar com Google
                  </>
                )}
              </button>

            </div>
          </div>
        </div>

        <p>Já possui uma conta? <Link href="/entrar/cliente">Entrar Agora</Link> </p>

      </section>

      <Footer />

    </main>
  );  
};

export default CadastrarCliente;