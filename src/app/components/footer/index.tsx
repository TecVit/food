import Image from "next/image";
import Logo from '@/assets/images/logoBlack.png';
import Link from "next/link";
import './style.css';
import { Facebook, Instagram } from "lucide-react";

const Footer = () => {

  const instagram = "pedidofacil.store";

  return (
    <header className="container-footer">
      <div className="content-footer">
        <div className="top">
          <ul>
            <li>
              <Image quality={100} src={Logo} alt="Logo" width={200} height={50} />
              <p>Forneçemos a melhor divulgação de produtos de araraquara</p>
              <div className="icons">
                <Link target="_blank" href={`https://instagram.com/${instagram}`}>
                  <Instagram className="icon" />
                </Link>
                <Link target="_blank" href={`https://instagram.com/${instagram}`}>
                  <Facebook className="icon" />
                </Link>
              </div>
            </li>
            <div className="links">
              <li>
                <h1>Links</h1>
                <Link href="/#">Início</Link>
                <Link href="/lojas">Lojas</Link>
                <Link href="/produtos">Produtos</Link>
                <Link href="/descontos">Descontos</Link>
              </li>
              <li>
                <h1>Lojas</h1>
                <Link href="/loja/copao-jb">Copão JB</Link>
                <Link href="/loja/real-mania">Real Mania</Link>
              </li>
            </div>
          </ul>
        </div>

        <div className="bottom">
          <p>&copy; 2025 - PedidoFácil</p>
          <div className="links">
            <Link href="/#">Início</Link>
            <Link href="/produtos">Produtos</Link>
            <Link href="/lojas">Lojas</Link>
          </div>
        </div>

      </div>
    </header>
  )
};

export default Footer;