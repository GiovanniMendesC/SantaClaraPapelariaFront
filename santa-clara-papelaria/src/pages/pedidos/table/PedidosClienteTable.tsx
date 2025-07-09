import React, { useState } from 'react';
import { Button, Modal, Table } from 'antd';
import type { TableProps } from 'antd';

interface Produto {
  nome_produto: string;
  quantidade: number;
  valor_unitario: number;
  subtotal: number;
}

interface Pedido {
  id_pedido: number; // <- Corrigido aqui (era id_pedidos)
  produtos: Produto[];
  valor_total: number;
  forma_pagamento: string;
  status_pagamento: string;
}

interface PedidosClienteTableProps {
  data: Pedido[]; 
  onSelectProduto?: (pedido: Pedido) => void;
}

const PedidosClienteTable: React.FC<PedidosClienteTableProps> = ({ data }) => {
    const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
        const [isModalVisible, setIsModalVisible] = useState(false);
    
        const showModal = (pedido: Pedido) => {
            setSelectedPedido(pedido);
            setIsModalVisible(true);
        };
    
        const handleOk = () => {
            setIsModalVisible(false);
        };
    
        const handleCancel = () => {
            setIsModalVisible(false);
        };
    
        const columns = (): TableProps<Pedido>['columns'] => [
            {
              title: 'ID Pedido',
              dataIndex: 'id_pedido',
              render: (text) => <span className='fw-bold fs-6 text-muted'>{text}</span>,
            },
            {
              title: 'Valor Total',
              dataIndex: 'valor_total',
              align: 'center',
              render: (text) => <span className='fw-bold fs-6 text-hover-primary'>R${text}</span>,
            },
            {
              title: 'Status do Pagamento',
              dataIndex: 'status_pagamento',
              align: 'center',
              render: (text) => <span className={`fs-6 badge fw-semibold ${text == 'pendente'? ' text-bg-warning':' text-bg-success'}`}>{text}</span>,
            },
            {
              title: 'Forma de Pagamento',
              dataIndex: 'forma_pagamento',
              align: 'center',
              render: (text) => <span className='fs-6 fw-semibold'>{text}</span>,
            },
            {
                title: 'Produtos',
                key: 'acoes',
                align: 'center',
                render: (_, record) => (
                    <Button type="primary" onClick={() => showModal(record)}>
                    Ver Produtos
                    </Button>
                ),
            }
          ];

          const produtoColumns: TableProps<Produto>['columns'] = [
                  {
                    title: 'Produto',
                    dataIndex: 'nome_produto',
                  },
                  {
                    title: 'Quantidade',
                    dataIndex: 'quantidade',
                    align: 'center',
                  },
                ];
          
    return (
        <>
            <Table<Pedido>
                columns={columns()}
                dataSource={data}
                bordered
                title={() => ''}
                footer={() => ''}
                rowKey={'id_pedido'}
            />
            <Modal
                title="Produtos do Pedido"
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                <Button key="close" onClick={handleCancel}>
                    Fechar
                </Button>,
                ]}
            >
                {selectedPedido ? (
                <Table<Produto>
                    columns={produtoColumns}
                    dataSource={selectedPedido.produtos}
                    pagination={false}
                    rowKey={(record) => record.nome_produto}
                    size="small"
                />
                ) : (
                <p>Carregando produtos...</p>
                )}
            </Modal>

        </>
    );
} 

export default PedidosClienteTable;
