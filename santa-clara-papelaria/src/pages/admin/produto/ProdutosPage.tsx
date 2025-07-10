import { Button, Card, Modal } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import ProdutosTable from "./ProdutosTable";
import ProdutoNovo from "./ProdutoNovo";

import {  PlusOutlined } from '@ant-design/icons';

interface DataType {
    cod_produto: number;
    nome: string;
    valor_produto: number;
    estoque: number;
    desc_produto: string;
}

const Produto = () => {
    const [data, setData] = useState<DataType[]>([]);
    const [produtoNovoModalIsOpen, setProdutoNovoModalIsOpen] = useState(false);

    useEffect(() =>{
        fetchProdutos();
    },[])

    const fetchProdutos = () =>{
        axios.get('http://127.0.0.1:8000/api/cadastro/produtos/filtrar-vendedor/', {
            params: {
                nome: null,
                preco_min: null,
                preco_max: null,
                fornecido_em_mari: null,
                estoque_baixo: null
            }
        })
        .then(response => setData(response.data))
        .catch(error => console.error('Erro ao buscar dados:', error));
    }

    return (
        <>
            <Modal
                open={produtoNovoModalIsOpen}
                onCancel={()=>setProdutoNovoModalIsOpen(false)}
                title='Adicionar Produto'
                footer={null}
            >
                <ProdutoNovo onClose={()=> setProdutoNovoModalIsOpen(false)} onUpdate={fetchProdutos}/>
            </Modal>
            <Card title={
                <div className="d-flex justify-content-between">
                    <h4 className="fw-bold">Produtos</h4>
                    <Button className="fs-5" type="primary" onClick={()=>setProdutoNovoModalIsOpen(true)}><PlusOutlined />Adicionar Produto</Button>
                </div>
            } className="shadow-sm">
                <ProdutosTable data={data} onUpdate={fetchProdutos}/>
            </Card>
        </>
    );
}

export default Produto;