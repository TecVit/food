import Link from 'next/link';
import './style.css';

const Contact = () => {
  return (
    <header className="container-contact">
      <div className="content-contact">
        
        <h1>Precisa de Suporte?</h1>

        <Link href="https://wa.me/5516996410838?text=Preciso de suporte com minhas compras no PedidoFácil, por favor"  className='btn-secondary'>Fale com +55 (16) 99641-0838</Link>

      </div>
    </header>
  )
};

export default Contact;