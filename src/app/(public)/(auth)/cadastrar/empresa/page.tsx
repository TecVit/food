'use client';

import Navbar from "@/app/components/navbar";
import { setCookie } from "@/lib/cookies";
import { notifyError, notifyInfo, notifySuccess } from "@/lib/toastify";
import { Asterisk, Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import '../../auth.css';
import Footer from "@/app/components/footer";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";

const CadastrarCliente = () => {

  // Modais
  const [carregando, setCarregando] = useState(false);

  // Inputs
  const [inputNameStore, setInputNameStore] = useState('');
  const [inputEmail, setInputEmail] = useState('');
  const [inputCEP, setInputCEP] = useState<string>('');
  const [inputTelephone, setInputTelephone] = useState('');
  const [inputDescription, setInputDescription] = useState('');

  // Functions
  const handleSendMessage = async () => {
    if (carregando) {
      notifyInfo("Aviso", 'Aguarde a ultima requisição terminar');
      return;
    }
    setCarregando(true);
    try {
      if (!inputNameStore || !inputEmail || !inputCEP || !inputTelephone || !inputDescription) {
        notifyError("Aviso", 'Por favor, preencha todos os campos obrigatórios.');
        return false;
      }
      
      const nomeLoja = inputNameStore;
      const emailLoja = inputEmail;
      const cepLoja = inputCEP;
      const numeroLoja = inputTelephone;
      const descricaoLoja = inputDescription;
      
      const mensagem = `Olá, sou *${nomeLoja}*. Gostaria de obter acesso ao sistema PedidoFácil e começar a vender meus produtos de forma prática e eficiente.
    
Aqui estão os meus dados:
- E-mail: *${emailLoja}*
- CEP: *${cepLoja}*
- Número de contato: *${numeroLoja}*
- Descrição: *${descricaoLoja}*

Aguardo seu retorno para iniciarmos essa parceria!`;

      const linkWhatsApp = `https://wa.me/5516996410838?text=${encodeURIComponent(mensagem)}`;

      window.location.href = linkWhatsApp;
      
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
        <div style={{ maxWidth: '650px', padding: '0px 30px' }} className="form">
          <div style={{ width: '100%' }} className="content">
            <h1>Olá, Empresa! Junte-se ao <strong>PedidoFácil</strong></h1>
            <div className="inputs">
              <div className="input">
                <label>
                  Nome da Loja <span><Asterisk className="icon" /></span>
                </label>
                <input
                  name='nome'
                  value={inputNameStore}
                  onChange={(e) => setInputNameStore(e.target.value)}
                  placeholder='ex: Pão de Açucar'
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
                  CEP <span><Asterisk className="icon" /></span>
                </label>
                <input
                  name='cep'
                  value={inputCEP}
                  onChange={(e) => setInputCEP(e.target.value)}
                  placeholder='ex: 00000-000'
                  type="text"
                />
              </div>

              <div className="input">
                <label>
                  Telefone <span><Asterisk className="icon" /></span>
                </label>
                <input
                  name='telefone'
                  value={inputTelephone}
                  onChange={(e) => setInputTelephone(e.target.value)}
                  placeholder='ex: (16) 99988-7777'
                  type="text"
                />
              </div>

              <div className="input">
                <label>
                  Descrição da Loja <span><Asterisk className="icon" /></span>
                </label>
                <textarea
                  name='descrição'
                  value={inputDescription}
                  onChange={(e) => setInputDescription(e.target.value)}
                  placeholder='ex: "Somos uma loja de roupas femininas, especializada em vestidos para ocasiões especiais."'
                >
                </textarea>
              </div>
  
              <button onClick={handleSendMessage} className='btn-tertiary'>
                {carregando ? <div className="loader"></div> : <>Solicitar Acesso</>}
              </button>

            </div>
          </div>
        </div>

        <p>Já possui uma conta? <Link href="/entrar/empresa">Entrar Agora</Link> </p>

      </section>

      <Footer />

    </main>
  );  
};

export default CadastrarCliente;