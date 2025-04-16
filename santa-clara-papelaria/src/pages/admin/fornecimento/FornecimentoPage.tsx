import { Button, Card, Modal } from "antd";
import { useEffect, useState } from "react";
import FornecimentoNovo from "./FornecimentoNovo";
import axios from "axios";
import FornecimentoTable from "./FornecimentoTable";

interface DataType{
    id_fornecimento: number,
    nome: string,
    cnpj: string
}

const Fornecimento = () =>{
    const [fornecimentoModalOpen, setForncimentoModalOpen] = useState(false);
    const [data, setData] = useState<DataType[]>([])

    useEffect(()=>{
        fetchData();
    }, [])

    const fetchData = () =>{
        axios.get('http://localhost:8000/api/comercial/fornecimentos/listar-simples/')
        .then(response => setData(response.data))
        .catch(error => console.log('Erro ao buscar fornecimentos', error))
    }

    return (
        <>
            <Modal
                open={fornecimentoModalOpen}
                onCancel={()=> setForncimentoModalOpen(false)}
                title='Adicionar Fornecimento'
                footer={null}
            >
                <FornecimentoNovo onClose={() => setForncimentoModalOpen(false)}/>
            </Modal>

            <Card title='Fornecimento'>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button type="primary" onClick={()=>setForncimentoModalOpen(true)}>Adicionar Fornecimento</Button>
                </div>
                <br/>
                <FornecimentoTable data={data}/>
            </Card>
        </>
    )
}

export default Fornecimento;