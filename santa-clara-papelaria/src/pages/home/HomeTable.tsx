import React from 'react';
import { Button, Table } from 'antd';
import type { TableProps } from 'antd';

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
        align: 'center'
      },
      {
        title: 'Nome',
        dataIndex: 'nome',
        render: (text: string) => <a>{text}</a>,
      },
      {
        title: 'Preço',
        className: 'column-money',
        dataIndex: 'valor_produto',
        align: 'center',
      },
      {
        title: 'Estoque',
        dataIndex: 'estoque',
        align: 'center',
      },
      {
        title: 'Descrição',
        dataIndex: 'desc_produto',
        align: 'left',
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
      />
    );
  };
  

export default HomeTable;
