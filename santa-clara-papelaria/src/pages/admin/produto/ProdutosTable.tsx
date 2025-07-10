import React, { useState } from 'react';
import { Button, message, Modal, Table } from 'antd';
import type { TableProps } from 'antd';
import axios from 'axios';
import ProdutoAtualizar from './ProdutoAtualizar';

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
    const [produtoAtualizarModal, setProdutoAtualizarModal] = useState(false);
    const [produto, setProduto] = useState<DataType>();

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

    const handleAlterar = (record: DataType) =>{
      setProduto(record)
      setProdutoAtualizarModal(true);
    }
  
    const tableColumns = [
      {
        title: 'ID',
        dataIndex: 'cod_produto',
        align: 'center',
        render: (text: string) => <span className='fs-6 fw-bold text-muted'>{text}</span>,
      },
      {
        title: 'Nome',
        dataIndex: 'nome',
        render: (text: string) => <span className='fs-6 fw-bold text-hover-primary'>{text}</span>,
      },
      {
        title: 'Preço',
        className: 'column-money',
        dataIndex: 'valor_produto',
        align: 'center',
        render: (text: string) => <span className='badge text-bg-primary fs-6'>{text}</span>,
      },
      {
        title: 'Estoque',
        dataIndex: 'estoque',
        align: 'center',
        render: (text: string) => <span className='badge text-bg-secondary fs-6'>{text}</span>,
      },
      {
        title: 'Descrição',
        dataIndex: 'desc_produto',
        align: 'left',
        render: (text: string) => <span className='fs-6 fw-bold text-muted text-hover-primary'>{text}</span>,
      },
        {
            title: 'Alterar',
            key: 'alterar',
            align: 'center',
            render: (_: any, record: DataType) => (
            <Button type="primary" onClick={() => handleAlterar(record)}>
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
      <>
        <Table<DataType>
          columns={tableColumns}
          dataSource={data}
          bordered
          title={() => ''}
          footer={() => ''}
          rowKey="cod_produto"
        />

        <Modal
          open={produtoAtualizarModal}
          onCancel={()=>setProdutoAtualizarModal(false)}
          title='Alterar produto'
          footer={null}
        >
          <ProdutoAtualizar produto={produto} onUpdate={onUpdate} onClose={()=>setProdutoAtualizarModal(false)}/>
        </Modal>
      </>

    );
  };
  

export default ProdutosTable;
