import React from 'react';
import { Table } from 'antd';
import type { TableProps } from 'antd';

interface DataType{
    id_fornecimento: number,
    nome: string,
    cnpj: string
}

interface FornecimentoTableProps {
    data: DataType[];
 }

 const FornecimentoTable: React.FC<FornecimentoTableProps> = ({ data}) => {
  
    const tableColumns = [
      {
        title: 'ID',
        dataIndex: 'id_fornecimento',
        align: 'center',
        render: (text: string) => <span className='fs-6 fw-semibold text-muted'>{text}</span>,
      },
      {
        title: 'Fornecedor',
        dataIndex: 'fornecedor',
        render: (text: string) => <span className='fs-6 fw-bold text-hover-primary'>{text}</span>,
      },
      {
        title: 'Produto',
        dataIndex: 'produto',
        align: 'start',
        render: (text: string) => <span className='fs-6 fw-bold text-hover-primary text-muted'>{text}</span>,
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
          rowKey="id_fornecimento"
        />
      </>

    );
  };
  

export default FornecimentoTable;
