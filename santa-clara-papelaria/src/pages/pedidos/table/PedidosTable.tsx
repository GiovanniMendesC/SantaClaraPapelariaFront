import React, { useState } from 'react';
import { Button, Modal, Table } from 'antd';
import type { TableProps } from 'antd';

interface Produto {
    nome_produto: string;
    quantidade: number;
}

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

interface PedidosTableProps {
    data: DataType[]; // Dados a serem exibidos na tabela
    onSelectProduto?: (produto: DataType) => void
 }

const PedidosTable: React.FC<PedidosTableProps> = ({data, onSelectProduto}) => {
    const [selectedPedido, setSelectedPedido] = useState<DataType | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = (pedido: DataType) => {
        setSelectedPedido(pedido);
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const columns = (): TableProps<DataType>['columns'] => [
        {
            title: 'Cliente',
            dataIndex: 'nome_cliente',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Vendedor',
            dataIndex: 'nome_vendedor',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Status do Pagamento',
            dataIndex: 'status_pagamento',
            align: 'center',
        },
        {
            title: 'Forma de Pagamento',
            dataIndex: 'forma_pagamento',
            align: 'center',
        },
        {
            title: 'Ações',
            key: 'acoes',
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
            <Table<DataType>
                columns={columns()}
                dataSource={data}
                bordered
                title={() => ''}
                footer={() => ''}
                rowKey={"id_pedido"}
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

export default PedidosTable;
