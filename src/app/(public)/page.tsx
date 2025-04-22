'use client';

import { Box, Coffee, Search, ShoppingBag, Store } from "lucide-react";
import Navbar from "../components/navbar";
import './style.css';
import Image from "next/image";
import Seta from '../../assets/images/seta.png';
import Copao from '../../assets/images/copao.jpg';
import { useState } from "react";
import Footer from "../components/footer";
import StarRating from "../components/stars";


export default function Landing() {

  const productsList = [
    {
      id: 1,
      image: "https://images.tcdn.com.br/img/img_prod/1038791/copo_acai_personalizado_500_ml_c_50_un_1499_1_00b2227d68f8b47548cdb4d666ca6dcc.jpg",
      name: "Copão de Açai Tradicional - 700ml",
      description: "Cobertura de chocolate",
      price: 10,
      store: {
        name: "Copão JB",
        stars: 4.6,
      },
      rating: 3.4,
    },
    {
      id: 2,
      image: Copao.src,
      name: "Açaí Premium - 500ml",
      price: 15,
      store: {
        name: "Açaí do Zé",
        stars: 4.8,
      },
    },
    {
      id: 3,
      image: null,
      name: "Açaí com Frutas - 600ml",
      price: 12,
      store: {
        name: "Açaí Mania",
        stars: 4.5,
      },
    },
    {
      id: 4,
      image: null,
      name: "Açaí com Granola - 700ml",
      price: 18,
      store: {
        name: "Frutos do Açaí",
        stars: 4.2,
      },
    },
    {
      id: 5,
      image: null,
      name: "Açaí Energy - 800ml",
      price: 22,
      store: {
        name: "Açaí Power",
        stars: 4.7,
      },
    },
    {
      id: 6,
      image: null,
      name: "Açaí com Leite Condensado - 500ml",
      price: 13,
      store: {
        name: "Delícia de Açaí",
        stars: 4.9,
      },
    },
    {
      id: 7,
      image: null,
      name: "Açaí Vegan - 600ml",
      price: 14,
      store: {
        name: "Verde Açaí",
        stars: 4.3,
      },
    },
  ];

  type ProductType = {
    id: number;
    image: string | null;
    name: string;
    description?: string;
    price: number;
    store: {
      name: string,
      stars: number,
    };
    rating?: number;
  };

  const [mdSearch, setMdSearch] = useState<boolean>(false);
  const [inputSearch, setInputSearch] = useState<string>('');
  const [products, setProducts] = useState<ProductType[] | null>(null);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const seconds = 1;

  const normalizeText = (text: string) => {
    return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
  };
  
  const handleSearch = async (value: string) => {
    setInputSearch(value);
    if (timer) clearTimeout(timer);

    const newTimer = setTimeout(async () => {
      try {
        const search = normalizeText(value);
        const filteredProducts = productsList.filter(product => 
          normalizeText(product.name).includes(search)
        );
      
        const sortedProducts = filteredProducts.sort((a, b) => a.price - b.price);
    
        setProducts(sortedProducts);
      } catch (error) {
        console.error(error);
      }
    }, seconds * 1000);

    setTimer(newTimer);
  };
  

  return (
    <>
      <main className="container-landing">

        <Navbar />
        
        <section className="content-landing">
          <div className="text">
            <h1>Encontre o que você precisa</h1>
            <p>Forneçemos tudo o que você precisa, e todos os sabores possíveis e de melhor qualidade</p>
            <div className="search">
              <div style={{ borderRadius: inputSearch.length > 0 ? '10px 10px 0px 0px' : '10px' }} className="input">
                <Search className="icon" />
                <input onChange={(e) => handleSearch(e.target.value)} placeholder="Digite o nome do produto" type="search" />
              </div>
              {inputSearch.length > 0 && (
                <div className="result">
                  <ul>
                    {products && products.length > 0 ? (
                      products.map((product, i) => (
                        <li key={i}>
                          {product.image && (
                            <div className="image">
                              <Image quality={100} src={product.image} alt={`Imagem do produto "${product.name}"`} width={100} height={100} />
                            </div>
                          )}
                          <div className="text">
                            <h1>{product.name}</h1>
                            <p>Loja: <span>{product.store.name}</span>, Valor: <strong>{product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong> </p>
                          </div>
                        </li>
                      ))
                    ) : (
                      <li>
                        <div className="text">
                          <h1>Produto não encontrado</h1>
                          <p>Nenhum produto com o nome &quot;{inputSearch}&quot; foi encontrado!</p>
                        </div>
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Passo a Paso */}
        <section className="steps">
          <ul>
            <li>
              <Box strokeWidth={1.5} className="icon" />
              <div className="boll"></div>
              <h1>Escolha o Produto</h1>
              <p>Escolha qualquer produto que desejar em nosso site</p>
            </li>
            <li className="step-arrow">
              <Image quality={100} src={Seta} alt="Seta" />
            </li>
            <li>
              <ShoppingBag strokeWidth={1.5} className="icon" />
              <div className="boll"></div>
              <h1>Finalize o Carrinho</h1>
              <p>Revise seus itens e complete a compra com segurança</p>
            </li>
            <li className="step-arrow">
              <Image quality={100} src={Seta} alt="Seta" />
            </li>
            <li>
              <Store strokeWidth={1.5} className="icon" />
              <div className="boll"></div>
              <h1>Colete seu produto</h1>
              <p>Dirija-se ao local de retirada e pegue seu pedido</p>
            </li>
          </ul>
        </section>

        {/* Products */}
        <section className="content-products">
          <div className="products">
            <h1>Produtos Disponíveis</h1>
            <p>Descubra nossa variedade de produtos disponíveis, selecionados para atender suas necessidades com qualidade e praticidade</p>
            <ul>
              {productsList && productsList?.length > 0 ? (
                productsList.map((product, i) => (
                  <li key={i}>
                    <div className="image">
                      {product.image ? (
                        <Image quality={100} src={product.image} alt="Imagem do produto" width={300} height={300} />
                      ) : (
                        <Coffee className="icon" />
                      )}
                    </div>
                    <div className="description">
                      <div className="text">
                        <h1>{product.name}</h1>
                        <p>{product.description || "Produto sem descrição"}</p>
                      </div>
                      <div className="price">
                        <StarRating rating={product.rating || 5} />
                        <p>{product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <h2>Nenhum produto encontrado</h2>
              )}
            </ul>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
