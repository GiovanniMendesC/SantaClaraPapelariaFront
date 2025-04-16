import { Button, Card, Modal } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import ProdutosTable from "./ProdutosTable";
import ProdutoNovo from "./ProdutoNovo";

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
            <Card title='Produtos'>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button type="primary" onClick={()=>setProdutoNovoModalIsOpen(true)}>Adicionar Produto</Button>
                </div>
                <br/>
                <ProdutosTable data={data} onUpdate={fetchProdutos}/>
            </Card>
        </>
    );
}

export default Produto;