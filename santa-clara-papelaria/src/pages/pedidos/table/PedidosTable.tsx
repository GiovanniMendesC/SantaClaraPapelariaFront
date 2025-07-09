import React, { useState } from 'react';
import { Button, Dropdown, Modal, notification, Space, Table } from 'antd';
import type { MenuProps, TableProps } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import axios from 'axios';

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
    onRefresh?: () => void;
 }


const PedidosTable: React.FC<PedidosTableProps> = ({data, onSelectProduto, onRefresh}) => {
    const [api, contextHolder] = notification.useNotification();
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

    const handlePayment = (pedido: DataType, status: string) => {
        axios.post('http://127.0.0.1:8000/api/comercial/pagamentos/atualizar_status/', {
            id_pedido: pedido.id_pedido,
            status: status,
            id_vendedor: localStorage.getItem('login')
        })
        .then(() => {
            console.log(`Pagamento ${status} com sucesso!`);
            onRefresh?.(); // << chama a função do componente pai
        })
        .catch((error) => {
            openNotification(error.response.data.erro)
            console.error('Erro ao atualizar pagamento:', error);
        });
    };

    const openNotification = (message: string) => {
        api.open({
          message: 'Erro ao confirmar pedido.',
          description: message,
          duration: 0,
        });
    };

    const columns = (): TableProps<DataType>['columns'] => [
        {
            title: 'ID',
            dataIndex: 'id_pedido',
            align: 'center'
        },
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
            render: (_, record) => {
                const status = record.status_pagamento;
                let color = '';
        
                if (status === 'confirmado') color = 'green';
                else if (status === 'pendente') color = 'goldenrod';
                else if (status === 'recusado') color = 'red';
        
                return (
                    <span style={{ color }}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                );
            },
        },
        {
            title: 'Forma de Pagamento',
            dataIndex: 'forma_pagamento',
            align: 'center',
        },
        {
            title: 'Produtos',
            key: 'prodtuos',
            align: 'center',
            render: (_, record) => (
              <Button type="primary" onClick={() => showModal(record)}>
                Ver Produtos
              </Button>
            ),
        },
        {
            title: 'Ação',
            key: 'acao',
            align: 'center',
            render: (_, record) => {
                const items: MenuProps['items'] = [
                    {
                      label: 'Confirmar Pagamento',
                      key: 'confirmado',
                    },
                    {
                      label: 'Recusar Pagamento',
                      key: 'recusado',
                    },
                  ];
          
              return (
                <Dropdown menu={{items, onClick: ({ key }) => handlePayment(record, key),}}>
                    <Button>
                        <Space>
                            Ação
                            <DownOutlined />
                        </Space>
                    </Button>
                </Dropdown>
              );
            },
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
            {contextHolder}
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
