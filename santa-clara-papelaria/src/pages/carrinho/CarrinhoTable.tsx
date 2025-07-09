import React from 'react';
import { Button, Table } from 'antd';
import type { TableProps } from 'antd';

interface DataType {
    id: number,
    nome: string,
    valor_produto: number,
    uniqueKey: string; 
}

interface CarrinhoTableProps {
    data: DataType[]; // Dados a serem exibidos na tabela
    onSelectProduto?: (produto: DataType) => void;
}

const CarrinhoTable: React.FC<CarrinhoTableProps> = ({data, onSelectProduto}) => {


    const columns = (): TableProps<DataType>['columns'] => [
        {
            title: 'Produto',
            dataIndex: 'nome',
            render: (text) => <span className='fw-bold text-hover-primary fs-6'>{text}</span>,
        },
        {
            title: 'Preço',
            dataIndex: 'valor_produto',
            render: (text) => <span className='badge bg-primary fs-6'>{text}</span>,
        },
        {
            title: 'Ações',
            key: 'acoes',
            align: 'center',
            render: (_, record) => (
              <Button danger type="primary" onClick={() => onSelectProduto?.(record)}>
                Remover
              </Button>
            ),
        }
    ];
      
    return (
        <>
            <Table<DataType>
                columns={columns()}
                dataSource={data.map((item, index) => ({ ...item, key: `${item.id}-${index}` }))}
                bordered
                title={() => ''}
                footer={() => ''}
                rowKey='uniquekey'
            />
        </>
    );
}

export default CarrinhoTable;
