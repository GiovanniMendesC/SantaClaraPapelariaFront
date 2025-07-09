import React from 'react';
import { Button, Table } from 'antd';
import type { TableProps } from 'antd';

import './HomePage.css';

interface DataType {
  cod_produto: number;
  nome: string;
  valor_produto: number;
  estoque: number;
  desc_produto: string;
}

interface HomeTableProps {
    data: DataType[]; // Dados a serem exibidos na tabela
    onSelectProduto?: (produto: DataType) => void
 }

 const HomeTable: React.FC<HomeTableProps> = ({ data, onSelectProduto }) => {
    const isSeller = localStorage.getItem('group') === 'V';
  
    const tableColumns = [
      {
        title: 'ID',
        dataIndex: 'cod_produto',
        align: 'center',
        render: (text: string) => <span className='fs-6 fw-bold text-muted'>{text ?? '-'}</span>,
      },
      {
        title: 'Nome',
        dataIndex: 'nome',
        render: (text: string) => <span className='text-hover-primary fs-6 fw-bold'>{text ?? '-'}</span>,
      },
      {
        title: 'Preço',
        className: 'column-money',
        dataIndex: 'valor_produto',
        align: 'center',
        render: (text: string) => <span className='badge text-bg-primary fs-6'>{text ?? '-'}</span>,
      },
      {
        title: 'Estoque',
        dataIndex: 'estoque',
        align: 'center',
        render: (text: string) => <span className='badge text-bg-secondary fs-6'>{text ?? '-'}</span>,
      },
      {
        title: 'Descrição',
        dataIndex: 'desc_produto',
        align: 'left',
        render: (text: string) => <span className='fs-6 text-muted fw-bold'>{text ?? '-'}</span>,
      },
      ...(!isSeller
        ? [
            {
              title: 'Ações',
              key: 'acoes',
              render: (_: any, record: DataType) => (
                <Button type="primary" onClick={() => onSelectProduto?.(record)}>
                  Adicionar
                </Button>
              ),
            },
          ]
        : []),
    ] as TableProps<DataType>['columns'];
  
    return (
      <Table<DataType>
        columns={tableColumns}
        dataSource={data}
        bordered
        title={() => ''}
        footer={() => ''}
        rowKey="cod_produto"
        className='overflow-auto'
      />
    );
  };
  

export default HomeTable;
