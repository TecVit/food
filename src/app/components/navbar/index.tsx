'use client';

import Image from "next/image";
import Logo from '@/assets/images/logoWhite.png';
import Link from "next/link";
import './style.css';
import { BiMenu } from "react-icons/bi";
import { useState } from "react";
import { CgClose } from "react-icons/cg";

const Navbar = () => {

  const [mdNavbar, setMdNavbar] = useState<boolean>(false);

  return (
    <header className="container-navbar">
      <div className="content-navbar">
        <Image src={Logo} alt="Logo" />
        <nav className="links">
          <Link href="/#">Início</Link>
          <Link href="/produtos">Produtos</Link>
          <Link href="/lojas">Lojas</Link>
          <Link href="/descontos">Descontos</Link>
        </nav>
        {mdNavbar && (
          <nav className="links-mobile">
            <Link href="/#">Início</Link>
            <Link href="/produtos">Produtos</Link>
            <Link href="/lojas">Lojas</Link>
            <Link href="/descontos">Descontos</Link>
            <div className="btns-mobile">
              <Link className="btn-secondary" href="/entrar/cliente">Sou Cliente</Link>
              <Link className="btn-tertiary" href="/entrar/empresa">Sou Empresa</Link>
            </div>
          </nav>
        )}
        <div className="btns">
          <button onClick={() => setMdNavbar(!mdNavbar)} className="btn-navbar">
            {mdNavbar ? (
              <CgClose className="icon" />
            ) : (
              <BiMenu className="icon" />
            )}
          </button>
          <Link className="btn-secondary" href="/entrar/cliente">Sou Cliente</Link>
          <Link className="btn-tertiary" href="/entrar/empresa">Sou Empresa</Link>
        </div>
      </div>
    </header>
  )
};

export default Navbar;