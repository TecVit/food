import Image from "next/image";
import Logo from '@/assets/images/logoWhite.png';
import Link from "next/link";
import './style.css';

const Navbar = () => {
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
        <div className="btns">
          <Link className="btn-secondary" href="/entrar/cliente">Sou Cliente</Link>
          <Link className="btn-tertiary" href="/entrar/empresa">Sou Empresa</Link>
        </div>
      </div>
    </header>
  )
};

export default Navbar;