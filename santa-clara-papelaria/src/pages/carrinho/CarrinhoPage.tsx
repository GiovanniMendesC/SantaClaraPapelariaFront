import { useEffect, useState } from "react";
import { useAuth } from "../../AuthContext";
import { Button, Modal, notification, Select, Typography } from "antd";
import Login from "../registro/login/LoginPage";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import CarrinhoTable from "./CarrinhoTable";

const {Text} = Typography;

const Carrinho = () => {
    const [api, contextHolder] = notification.useNotification();
    const [isLoading, setIsLoading] = useState(false);
    const { isLoggedIn, loginModalOpen, setLoginModalOpen } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [idproduto, setIdProdutos] = useState<any[]>([]);
    const [produtosInfo, setProdutosInfo] = useState<any[]>([]);
    const [form, setForm] = useState({
        pagamento: 'pix',
        cupom: '',
      });

    useEffect(() => {
        // Controle de login
        if (!isLoggedIn) {
            setLoginModalOpen(true);
        } else {
            setLoginModalOpen(false);
        }
    }, [isLoggedIn, setLoginModalOpen]);

    const handleCancel = () => {
        setLoginModalOpen(false);
        if (!isLoggedIn) {
            navigate('/');
        }
    };

    useEffect(() => {
        if (isLoggedIn) {
            const produtosParam = searchParams.get('produtos');
            if (produtosParam) {
                const ids = produtosParam.split(',').map(id => parseInt(id));
                setIdProdutos(ids);
            }
        }
    }, [isLoggedIn, searchParams]);
    
    useEffect(() => {
        const fetchProdutosInfo = async () => {
            try {
                const infos = await Promise.all(
                    idproduto.map(async (id, index) => {
                        const response = await axios.get(
                            `http://127.0.0.1:8000/api/cadastro/produtos/buscar-por-id/?id=${id}`
                        );
                        return {
                            ...response.data,
                            id, // Adiciona o ID manualmente
                            uniqueKey: `${id}-${Date.now()}-${index}` // Chave única
                        };
                    })
                );
                setProdutosInfo(infos);
            } catch (error) {
                console.error('Erro ao buscar informações dos produtos:', error);
            }
        };

        if (idproduto.length > 0) {
            fetchProdutosInfo();
        }
    }, [idproduto]);

    const handlePurchase = () =>{
        setIsLoading(true);
        axios.post('http://127.0.0.1:8000/api/comercial/itens-pedido/criar_pedido_com_itens/', {
            idcliente: [localStorage.getItem('id')],
            idproduto: produtosInfo.map(produto => produto.id),
            forma_pagamento: form.pagamento,
            cupom: form.cupom
        })
        .then(response => {
            console.log('Pedido realizado com sucesso!', response.data);
            setIsLoading(false);
            navigate('/pedidos');
        })
        .catch(error => {
            setIsLoading(false);
            openNotification();
            console.error('Erro ao criar pedido:', error);
        });
    }

    const handleRemoveProduto = (produto: any) => {
        setProdutosInfo(prev => 
            prev.filter(p => p.uniqueKey !== produto.uniqueKey)
        );
    };

    const openNotification = () => {
        api.error({
          message: 'Erro ao criar pedido.',
          description:
            'Algo deu errado na realização do pedido. Entre em contato com o suporte.',
          duration: 3,
        });
    };

    return (
        <>
            {contextHolder}
            <div className="d-flex justify-content-between">
                <h1 className="fw-bold">Carrinho</h1>
            </div>
            <Modal
                open={loginModalOpen}
                onCancel={handleCancel}
                title='Login necessário'
                footer={null}
            >
                <Login />
            </Modal>

            {isLoggedIn && (
                <>
                    <div>
                        <h2 className="fw-semibold">Pedidos</h2>
                        <div>
                            <CarrinhoTable data={produtosInfo} onSelectProduto={handleRemoveProduto}/>
                        </div>
                        <h2 className="fw-semibold">Pagamento</h2>
                        <form onSubmit={(e) => { e.preventDefault(); handlePurchase(); }}>
                            <Text strong style={{fontSize: '15px'}}>Informe a Forma de Pagamento: </Text>
                            <Select
                                size="large"
                                placeholder="Forma de pagamento"
                                value={form.pagamento}
                                onChange={(value) => setForm({ ...form, pagamento: value })}
                                style={{ width: '100%', marginBottom: 16 }}
                            >
                                <Select.Option value="pix">À vista (PIX)</Select.Option>
                                <Select.Option value="caartao">Cartão (crédito/débito)</Select.Option>
                                <Select.Option value="boleto">Boleto</Select.Option>
                                <Select.Option value="berries">Berries</Select.Option>
                            </Select>
                            
                            <Text strong style={{fontSize: '15px'}}>Informe um Cupom: </Text>
                            <Select
                                size="large"
                                placeholder="Cupom"
                                value={form.cupom}
                                onChange={(value) => setForm({ ...form, cupom: value })}
                                style={{ width: '100%', marginBottom: 16 }}
                            >
                                <Select.Option value=""> </Select.Option>
                                <Select.Option value="flamengo">Flamengo</Select.Option>
                                <Select.Option value="onepiece">One Piece</Select.Option>
                            </Select>
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }} className="gap-4">
                                <Button className="fs-5" type="primary" danger onClick={() => navigate('/')}>
                                    Cancelar
                                </Button>
                                <Button className="fs-5" type="primary" htmlType="submit" loading={isLoading} disabled={produtosInfo.length == 0}>Confirmar</Button>
                            </div>
                        </form>
                    </div>
                </>
            )}
        </>
    );
}

export default Carrinho;
