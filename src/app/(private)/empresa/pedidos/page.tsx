'use client';

import Navbar from "@/app/components/navbar";
import './style.css';
import { useState } from "react";
import Footer from "@/app/components/footer";

function dueDate(dataStr: string) {
  const [dia, mes, ano] = dataStr.split("/").map(Number);
  const data = new Date(ano, mes - 1, dia);
  data.setDate(data.getDate() + 7);
  const novoDia = String(data.getDate()).padStart(2, "0");
  const novoMes = String(data.getMonth() + 1).padStart(2, "0");
  const novoAno = data.getFullYear();
  return `${novoDia}/${novoMes}/${novoAno}`;
}

export default function Landing() {

  const ordersList = [
    {
      id: 2,
      status: 0,
      totalPrice: 69.88,
      date: "12/03/2025",
      shipping: "deliver",
      products: [
        {
          id: 101,
          image: null,
          name: "Camiseta Personalizada",
          description: "Camiseta de algodão com estampa exclusiva.",
          price: 49.99,
          store: {
            name: "Loja Exemplo",
            stars: 4,
          },
          rating: 4.5,
        },
        {
          id: 102,
          image: null,
          name: "Caneca de Café",
          description: "Caneca de cerâmica para café com design moderno.",
          price: 19.99,
          store: {
            name: "Loja Exemplo",
            stars: 5,
          },
          rating: 4.8,
        },
      ],
      client: {
        name: "João Silva",
        cpf: "123.456.789-00",
        telephone: "(11) 98765-4321",
        birth: "1990-05-15",
        location: "1324 Great Alfa - Jakarta, EUA",
      },
      store: {
        name: "Savegnago",
        email: "example@gmail.com",
        location: "5758 Great Street - Jakarta, Indonesia",
      },
    }
  ];
  
  // Status
  // 0 => Entregue / delivered
  // 1 => Pendente / pending
  // 2 => Cancelado / canceled

  const status = ["Entregue", "Pendente", "Cancelado"] as const;
  const statusColors = ["green", "orange", "red"] as const;

  type OrderType = {
    id: number;
    totalPrice: number,
    status: number, // 0, 1, 2
    shipping: string, // "deliver", "collect"
    date: string,
    products: ProductType[];
    client: {
      name: string,
      cpf: string,
      telephone: string,
      birth: string,
      location: string,
    };
    store: {
      name: string,
      location: string,
      email: string,
    };
  };

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
  const [orders, setOrders] = useState<OrderType[] | null>(ordersList);
  const [orderData, setOrderData] = useState<OrderType | null>(null);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const seconds = 1.5;

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
        const filteredOrders = ordersList.filter(product => 
          normalizeText(product.client.name).includes(search)
        );
    
        setOrders(filteredOrders);
      } catch (error) {
        console.error(error);
      }
    }, seconds * 1000);

    setTimer(newTimer);
  };

  // Selected Status
  const [selectedStatus, setSelectedStatus] = useState<number>(-1);

  const ordersFilter = orders
  ? orders.filter(prev => selectedStatus === -1 || prev?.status === selectedStatus)
  : [];

  return (
    <>
      <main className="container-store">

        <Navbar />
        
        <section className="content-store">
          <div className="text">
            {orderData ? (
              <h1>Pedido Nº {orderData.id} - <span className={statusColors[orderData.status]}>{status[orderData.status]}</span></h1>
            ) : (
              <h1>Todos os Pedidos Realizados</h1>
            )}
            {orderData ? (
              <p>{orderData.products.map((product) => product.name).join(', ')} - <strong>{orderData.totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong></p>
            ) : (
              <p>Acompanhe todos os pedidos realizados e veja o status de suas compras de forma rápida e fácil.</p>
            )}
            {orderData && (
              <button onClick={() => setOrderData(null)} className="btn-quaternary">Voltar para "Pedidos Realizados"</button>
            )}
          </div>
        </section>

        {/* Orders - List */}
        {!orderData && (
          <section className="content-orders">
            <div className="orders">

              <div className="config">
                <h1>Pedidos</h1>
                <div className="status">
                  <div onClick={() => setSelectedStatus(-1)} className={`statu ${selectedStatus === -1 ? 'selected' : ''}`}>
                    <p>Todos</p>
                  </div>
                  {status.map((value, i) => (
                    <div onClick={() => setSelectedStatus(i)} key={i} className={`statu ${selectedStatus === i ? 'selected' : ''}`}>
                      <p>{value}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="list-orders">
                {ordersFilter && ordersFilter.length > 0 ? (
                  ordersFilter.map((order, i) => (
                    <div onClick={() => setOrderData(order)} key={i} className="order">

                      <div className="price">
                        <div className={`status ${statusColors[order.status]}`}>
                          <p>{status[order.status]}</p>
                        </div>
                        <h2>{order.totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h2>
                      </div>

                      <div className="details">
                        <p>{order.products.map((product) => product.name).join(', ')}</p>
                        <h1>#{order.id}</h1>
                        <div className="store">
                          <a>{order.client.name}</a>
                          <a>{order.date}</a>
                        </div>
                      </div>

                    </div>
                  ))
                ) : (
                  <h2 className="not-found">Nenhum pedido encontrado</h2>
                )}
              </div>

            </div>
          </section>
        )}

        {/* Orders - Data */}
        {orderData && (
          <section className="content-order-data">
            <div className="order-data">

              <div className="order">

                <div className="row">
                  <div className="left">
                    <div className={`status ${statusColors[orderData.status]}`}>
                      <p>{status[orderData.status]}</p>
                    </div>
                  </div>
                  <div className="right">
                    <p>{orderData.client.name}</p>
                  </div>
                </div>

                <div className="row">
                  <div className="left">
                    <h1>#{orderData.id}</h1>
                  </div>
                  <div className="right">
                    <div className="date">
                      <h2>Data de Emissão</h2>
                      <p>{orderData.date}</p>
                    </div>
                    <div className="date">
                      <h2>Data de Vencimento</h2>
                      <p>{dueDate(orderData.date)}</p>
                    </div>
                  </div>
                </div>

                <div className="row-border"></div>

                <div className="row">
                  <div className="left">
                    <div className="send">
                      <h2>De</h2>
                      <h1>{orderData.store.name}</h1>
                      <p>{orderData.store.location}</p>
                      <p>{orderData.store.email}</p>
                    </div>
                  </div>
                  <div className="right">
                    <div className="send">
                      <h2>Para</h2>
                      <h1>{orderData.client.name}</h1>
                      <p>{orderData.client.location}</p>
                      <p>{orderData.client.telephone}</p>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </section>
        )}

      </main>

      <Footer />
    </>
  );
}
