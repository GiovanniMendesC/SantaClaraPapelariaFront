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

const columns = (onSelectProduto?: (produto: DataType) => void): TableProps<DataType>['columns'] => [
    {
        title: 'Nome',
        dataIndex: 'nome',
        render: (text) => <a>{text}</a>,
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
    {
        title: 'Ações',
        key: 'acoes',
        render: (_, record) => (
        <Button type="primary" onClick={() => onSelectProduto?.(record)}>
            Adicionar
        </Button>
        ),
    }
];

const HomeTable: React.FC<HomeTableProps> = ({data, onSelectProduto}) => (
  <Table<DataType>
    columns={columns(onSelectProduto)}
    dataSource={data}
    bordered
    title={() => ''}
    footer={() => ''}
    rowKey={"cod_produto"}
  />
);

export default HomeTable;
