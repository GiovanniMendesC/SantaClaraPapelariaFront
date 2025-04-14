import axios from "axios";
import {Button} from "antd";
import { useEffect, useState } from "react";
import HomeTable from "./HomeTable";
import { ShoppingCartOutlined } from '@ant-design/icons';
import { Link, useNavigate } from "react-router-dom";

interface DataType {
    cod_produto: number;
    nome: string;
    valor_produto: number;
    estoque: number;
    desc_produto: string;
  }

const Home = () => {
    const [data, setData] = useState<DataType[]>([]);
    const [produtosSelecionados, setProdutosSelecionados] = useState<DataType[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/cadastro/produtos/')
        .then(response => setData(response.data))
        .catch(error => console.error('Erro ao buscar dados:', error));
    }, []);

    const irParaCarrinho = () => {
        const ids = produtosSelecionados.map(p => p.cod_produto).join(',');
        navigate(`/carrinho?produtos=${ids}`);
    }

    return(
        <>
            <div>
                <h1>Produtos</h1>
            </div>
            {produtosSelecionados.length > 0 && (
                <div style={{display: 'flex'}}>
                    <div style={{marginLeft: 'auto', top: 20, right: 20 }}>
                        <Button 
                            size="large" 
                            type="primary" 
                            style={{ display: 'flex', alignItems: 'center' }}
                            onClick={irParaCarrinho} // aqui troca o Link pelo botão com onClick
                        >
                            <ShoppingCartOutlined style={{ fontSize: 24, marginRight: 8 }} />
                            Carrinho
                            <br/>
                            <span>{produtosSelecionados.length}</span>
                        </Button>
                    </div>
                    <br></br>
                </div>
            )}
            <HomeTable data={data} onSelectProduto={(produto) => setProdutosSelecionados(prev => [...prev, produto])}/>
        </>
    )
}

export default Home;