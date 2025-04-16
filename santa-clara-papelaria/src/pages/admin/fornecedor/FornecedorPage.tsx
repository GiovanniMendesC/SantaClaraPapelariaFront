import { Button, Card, Modal } from "antd";
import { useEffect, useState } from "react";
import FornecedorTable from "./FornecedorTable";
import axios from "axios";
import FornecedorNovo from "./FornecedorNovo";

interface DataType{
    id_fornecedor: number,
    nome: string,
    cnpj: string
}


const Fornecedor = () =>{
    const [data, setData] = useState<DataType[]>([])
    const [fornecedorNovoModalIsOpen, setFornecedorNovoModalIsOpen] = useState(false);

    useEffect(()=>{
        fetchData();
    }, [])
    
    const fetchData = () =>{
        axios.get('http://localhost:8000/api/cadastro/fornecedores/listar/')
        .then(response => setData(response.data.fornecedores))
        .catch(error => console.log('erro ao buscar fornecedores', error))
    }

    return (
        <>
            <Modal
                open={fornecedorNovoModalIsOpen}
                onCancel={()=>setFornecedorNovoModalIsOpen(false)}
                title='Adicionar Produto'
                footer={null}
            >
                <FornecedorNovo onClose={()=> setFornecedorNovoModalIsOpen(false)} onUpdate={fetchData}/>
            </Modal>
            <Card title='Fornecedores'>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button type="primary" onClick={()=>setFornecedorNovoModalIsOpen(true)}>Adicionar Fornecedor</Button>
                </div>
                <br/>
                <FornecedorTable data={data} onUpdate={fetchData}/>
            </Card>
        </>
    );
}

export default Fornecedor;