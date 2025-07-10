import { Button, Card, Modal } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import DistribuidorTable from "../distribuidor/DistribuidorTable";
import DistribuidorNovo from "./DistribuidorNovo";

import { FunnelPlotOutlined, PlusOutlined, ShoppingCartOutlined } from '@ant-design/icons';

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
            <Card title={
                <div className="d-flex justify-content-between">
                    <h4 className="fw-bold">Distribuidor</h4>
                    <Button className="fs-5" type="primary" onClick={()=>setDistribuidorNovoModalIsOpen(true)}><PlusOutlined />Adicionar Distribuidor</Button>
                </div>
            } className="shadow-sm">
                <DistribuidorTable data={data} onUpdate={fetchData}/>
            </Card>
        </>
    );
}

export default Distribuidor;