import React, { useState } from 'react';
import { Button, message, Table } from 'antd';
import type { TableProps } from 'antd';
import axios from 'axios';

interface DataType {
  cod_produto: number;
  nome: string;
  valor_produto: number;
  estoque: number;
  desc_produto: string;
}

interface ProdutosTableProps {
    data: DataType[]; // Dados a serem exibidos na tabela
    onSelectProduto?: (produto: DataType) => void;
    onUpdate: () => void;
 }

 const ProdutosTable: React.FC<ProdutosTableProps> = ({ data, onSelectProduto, onUpdate }) => {

    const handleDeletar = (cod_produto: number) =>{
      axios.delete(`http://127.0.0.1:8000/api/cadastro/produtos/${cod_produto}/remover/`)
      .then(()=>{
        console.log("produto deletado com sucesso!")
        onUpdate();
      })
      .catch(error =>
        message.info('Erro ao deletar produto', error)
      )
    }
  
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
        {
            title: 'Alterar',
            key: 'alterar',
            align: 'center',
            render: (_: any, record: DataType) => (
            <Button type="primary" onClick={() => onSelectProduto?.(record)}>
                Alterar
            </Button>
            ),
        },  
        {
            title: 'Excluir',
            key: 'excluir',
            align: 'center',
            render: (_: any, record: DataType) => (
            <Button type="primary" danger onClick={() => handleDeletar(record.cod_produto)}>
                Excluir
            </Button>
            ),
        },  
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
  

export default ProdutosTable;
