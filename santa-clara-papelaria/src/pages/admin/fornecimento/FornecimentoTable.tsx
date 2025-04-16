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
        align: 'center'
      },
      {
        title: 'Fornecedor',
        dataIndex: 'fornecedor',
        render: (text: string) => <a>{text}</a>,
      },
      {
        title: 'Produto',
        dataIndex: 'produto',
        align: 'center',
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
