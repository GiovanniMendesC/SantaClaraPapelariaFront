import React, { useState } from 'react';
import { Button, message, Modal, Table } from 'antd';
import type { TableProps } from 'antd';
import axios from 'axios';
import FornecedorAtualizar from './FornecedorAtualizar';

interface DataType{
    id_fornecedor: number,
    nome: string,
    cnpj: string
}

interface FornecedorTableProps {
    data: DataType[]; // Dados a serem exibidos na tabela
    onSelectProduto?: (produto: DataType) => void;
    onUpdate: () => void;
 }

 const FornecedorTable: React.FC<FornecedorTableProps> = ({ data, onSelectProduto, onUpdate }) => {
    const [fornecedorAtualizarModal, setFornecedorAtualizarModal] = useState(false);
    const [fornecedor, setFornecedor] = useState<DataType>();

    const handleDeletar = (id: number) =>{
      axios.delete(`http://127.0.0.1:8000/api/cadastro/fornecedores/${id}/remover/`)
      .then(()=>{
        console.log("produto deletado com sucesso!")
        onUpdate();
      })
      .catch(error =>
        message.info('Erro ao deletar produto', error)
      )
    }

    const handleAlterar = (record: DataType) =>{
        setFornecedor(record);
        setFornecedorAtualizarModal(true);
    }
  
    const tableColumns = [
      {
        title: 'ID',
        dataIndex: 'id_fornecedor',
        align: 'center',
        render: (text: string) => <span className='fs-6 fw-bold text-muted'>{text}</span>,
      },
      {
        title: 'Nome',
        dataIndex: 'nome',
        render: (text: string) => <span className='fs-6 fw-bold text-hover-primary'>{text}</span>,
      },
      {
        title: 'CNPJ',
        dataIndex: 'cnpj',
        align: 'center',
        render: (text: string) => <span className='fw-bold text-primary fs-6 badge text-bg-light shadow-sm'>{text}</span>,
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
            <Button type="primary" danger onClick={() => handleDeletar(record.id_fornecedor)}>
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
          rowKey="id_fornecedor"
        />

        <Modal
          open={fornecedorAtualizarModal}
          onCancel={()=>setFornecedorAtualizarModal(false)}
          title='Alterar produto'
          footer={null}
        >
            <FornecedorAtualizar fornecedor={fornecedor} onUpdate={onUpdate} onClose={()=>setFornecedorAtualizarModal(false)}/>
        </Modal>
      </>

    );
  };
  

export default FornecedorTable;
