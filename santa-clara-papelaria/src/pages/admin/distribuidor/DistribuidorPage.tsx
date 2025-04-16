import { Button, Card, Modal } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import DistribuidorTable from "../distribuidor/DistribuidorTable";
import DistribuidorNovo from "./DistribuidorNovo";

interface DataType{
    id_distribuidor: number,
    nome: string,
    cnpj: string
}


const Distribuidor = () =>{
    const [data, setData] = useState<DataType[]>([])
    const [distribuidorNovoModalIsOpen, setDistribuidorNovoModalIsOpen] = useState(false);

    useEffect(()=>{
        fetchData();
    }, [])
    
    const fetchData = () =>{
        axios.get('http://localhost:8000/api/cadastro/distribuidores/listar/')
        .then(response => setData(response.data.distribuidores))
        .catch(error => console.log('erro ao buscar distribuidores', error))
    }

    return (
        <>
            <Modal
                open={distribuidorNovoModalIsOpen}
                onCancel={()=>setDistribuidorNovoModalIsOpen(false)}
                title='Adicionar Produto'
                footer={null}
            >
                <DistribuidorNovo onClose={()=> setDistribuidorNovoModalIsOpen(false)} onUpdate={fetchData}/>
            </Modal>
            <Card title='Distribuidores'>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button type="primary" onClick={()=>setDistribuidorNovoModalIsOpen(true)}>Adicionar Distribuidor</Button>
                </div>
                <br/>
                <DistribuidorTable data={data} onUpdate={fetchData}/>
            </Card>
        </>
    );
}

export default Distribuidor;