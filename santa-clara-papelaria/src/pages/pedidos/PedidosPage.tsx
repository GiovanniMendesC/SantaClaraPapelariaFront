import { Modal } from 'antd';
import Login from "../registro/login/LoginPage";
import { useEffect, useState } from "react";
import { useAuth } from '../../AuthContext';
import { useNavigate } from 'react-router-dom';
import PedidosTable from './table/PedidosTable';
import axios from 'axios';
import PedidosClienteTable from './table/PedidosClienteTable';

interface DataType {
    id_pedido: number;
    nome_cliente: string;
    nome_vendedor: string;
    produtos: {
      nome_produto: string;
      quantidade: number;
    }[];
    status_pagamento: string;
}

interface ClientDataType {
    id_pedido: number,
    produtos: {
        nome_produto: string,
        quantidade: number,
        valor_unitario: number,
        subtotal: number
    }[],
    valor_total: number,
    forma_pagamento: string,
    status_pagamento: string,

}

const Pedidos = () => {
  const [data, setData] = useState<DataType[]>([]);
  const [dataCliente, setDataCliente] = useState<ClientDataType[]>([]);
  const { isLoggedIn, loginModalOpen, setLoginModalOpen } = useAuth();
  const navigate = useNavigate(); 

  useEffect(() => {
    if (!isLoggedIn) {
      setLoginModalOpen(true);
    } else {
      setLoginModalOpen(false);
      fetchPedidos();
    }
  }, [isLoggedIn]);
  
  const fetchPedidos = () => {
    const group = localStorage.getItem('group');
    if (group === 'V') {
      axios.get('http://127.0.0.1:8000/api/cadastro/pedidos/resumo-pedidos/')
        .then(response => setData(response.data))
        .catch(error => console.error('Erro ao buscar dados:', error));
    } else if (group === 'C') {
      axios.get('http://127.0.0.1:8000/api/cadastro/clientes/resumo-por-cliente/', {
        params: { telefone: localStorage.getItem('login') }
      })
        .then(response => setDataCliente(response.data))
        .catch(error => console.error('Erro ao buscar dados:', error));
    }
  };
  

  const handleCancel = () => {
    setLoginModalOpen(false);
    if (!isLoggedIn) {
      navigate('/'); // ← Redireciona para a página /home
    }
  };


  return (
    <>
      <Modal
        open={loginModalOpen}
        onCancel={handleCancel}
        title='Login necessário'
        footer={null}
      >
        <Login />
      </Modal>

      {/* Seu conteúdo da página */}
      <h1>Pedidos</h1>
      {isLoggedIn && localStorage.getItem('group') == 'V' && (
        <>
            <PedidosTable data={data} onRefresh={fetchPedidos} />
        </>
      )}
      {isLoggedIn && localStorage.getItem('group') == 'C' && (
        <PedidosClienteTable data={dataCliente}/>
      )}
    </>
  );
}

export default Pedidos;
