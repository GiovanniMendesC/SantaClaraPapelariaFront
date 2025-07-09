import axios from "axios";
import {Button} from "antd";
import { useEffect, useState } from "react";
import HomeTable from "./HomeTable";
import { FunnelPlotOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import "./HomePage.css";
import HomeFilter from "./HomeFilter";

interface DataType {
    cod_produto: number;
    nome: string;
    valor_produto: number;
    estoque: number;
    desc_produto: string;
  }

interface FiltroType {
    nome: string | null,
    preco_min: number | null,
    preco_max: number | null,
    fornecido_em_mari: boolean | null,
    estoque_baixo: boolean | null
}
const Home = () => {
    const [data, setData] = useState<DataType[]>([]);
    const [produtosSelecionados, setProdutosSelecionados] = useState<DataType[]>([]);
    const [filtroModalAberto, setFiltroModalAberto] = useState(false);
    const [filtro, setFiltro] = useState<FiltroType>({
        nome: null,
        preco_min: null,
        preco_max: null,
        fornecido_em_mari: null,
        estoque_baixo: null
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchProdutos();    
    }, [filtro]);
    
    const fetchProdutos = () =>{
        axios.get('http://127.0.0.1:8000/api/cadastro/produtos/filtrar-vendedor/', {
            params: {
                nome: filtro.nome,
                preco_min: filtro.preco_min,
                preco_max: filtro.preco_max,
                fornecido_em_mari: filtro.fornecido_em_mari,
                estoque_baixo: filtro.estoque_baixo
            }
        })
        .then(response => setData(response.data))
        .catch(error => console.error('Erro ao buscar dados:', error));
    }

    const irParaCarrinho = () => {
        const ids = produtosSelecionados.map(p => p.cod_produto).join(',');
        navigate(`/carrinho?produtos=${ids}`);
    }

    const hasFilter = () =>{
        return Object.values(filtro).some(v => v !== null && v !== '' && v !== false && v !== 0);
    }

    return(
        <>
            <div className="d-flex flex-row w-100 justify-content-between align-items-center mb-5">
                <h1 className="fw-bold">Produtos</h1>
                <div className="d-flex flex-row gap-4">
                    {produtosSelecionados.length > 0 && (
                        <div style={{display: 'flex'}}>
                            <div style={{marginLeft: 'auto', top: 20, right: 20 }}>
                                <Button 
                                    size="large" 
                                    type="primary" 
                                    style={{ display: 'flex', alignItems: 'center' }}
                                    onClick={irParaCarrinho} // aqui troca o Link pelo botão com onClick
                                    className="fs-5"
                                >
                                    <ShoppingCartOutlined className="fs-3" />
                                    Carrinho
                                    <br/>
                                    <span>{produtosSelecionados.length}</span>
                                </Button>
                            </div>
                            <br></br>
                        </div>
                    )}
                <div style={{display: 'flex'}}>
                        <div style={{marginLeft: 'auto', top: 20, right: 20 }}>
                            <Button 
                                size="large" 
                                type="primary" 
                                style={{ display: 'flex', alignItems: 'center' }}
                                onClick={() => setFiltroModalAberto(true)}
                                className="fs-5"
                                >
                                <FunnelPlotOutlined 
                                    className={`fs-3 ${hasFilter() ? 'blinking' : ''}`}
                                />
                                Filtros
                                <br/>
                            </Button>
                            <HomeFilter
                                open={filtroModalAberto}
                                onClose={() => setFiltroModalAberto(false)}
                                onApply={(filtros) => setFiltro(filtros)}
                                initialValues={filtro}
                            />
                        </div>
                </div>
                </div>
            </div>

            <HomeTable data={data} onSelectProduto={(produto) => setProdutosSelecionados(prev => [...prev, produto])}/>
        </>
    )
}

export default Home;