import React, { useState } from 'react';
import { Button, message, Modal, Table } from 'antd';
import type { TableProps } from 'antd';
import axios from 'axios';
import DistribuidorAtualizar from './DisrtibuidorAtualizar';

interface DataType{
    id_distribuidor: number,
    nome: string,
    cnpj: string
}

interface DistribuidorTableProps {
    data: DataType[]; // Dados a serem exibidos na tabela
    onSelectProduto?: (produto: DataType) => void;
    onUpdate: () => void;
 }

 const DistribuidorTable: React.FC<DistribuidorTableProps> = ({ data, onSelectProduto, onUpdate }) => {
    const [distribuidorAtualizarModal, setDistribuidorAtualizarModal] = useState(false);
    const [distribuidor, setDistribuidor] = useState<DataType>();

    const handleDeletar = (id: number) =>{
      axios.delete(`http://127.0.0.1:8000/api/cadastro/distribuidores/${id}/remover/`)
      .then(()=>{
        console.log("produto deletado com sucesso!")
        onUpdate();
      })
      .catch(error =>
        message.info('Erro ao deletar produto', error)
      )
    }

    const handleAlterar = (record: DataType) =>{
        setDistribuidor(record);
        setDistribuidorAtualizarModal(true);
    }
  
    const tableColumns = [
      {
        title: 'ID',
        dataIndex: 'id_distribuidor',
        align: 'center'
      },
      {
        title: 'Nome',
        dataIndex: 'nome',
        render: (text: string) => <a>{text}</a>,
      },
      {
        title: 'CNPJ',
        dataIndex: 'cnpj',
        align: 'center',
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
            <Button type="primary" danger onClick={() => handleDeletar(record.id_distribuidor)}>
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
          rowKey="id_distribuidor"
        />

        <Modal
          open={distribuidorAtualizarModal}
          onCancel={()=>setDistribuidorAtualizarModal(false)}
          title='Alterar produto'
          footer={null}
        >
            <DistribuidorAtualizar distribuidor={distribuidor} onUpdate={onUpdate} onClose={()=>setDistribuidorAtualizarModal(false)}/>
        </Modal>
      </>

    );
  };
  

export default DistribuidorTable;
