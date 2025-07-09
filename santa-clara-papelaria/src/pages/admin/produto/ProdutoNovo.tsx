import { Button, Input, message, notification, Select, Typography } from "antd";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import { useEffect, useState } from "react";


const { Option } = Select;
const { Text } = Typography;

interface Fornecedor {
    id_fornecedor: number,
    nome: string
}

interface Distribuidor {
    id_distribuidor: number,
    nome: string
}

interface FormData {
    nome: string,
    valor_produto: number,
    estoque: number,
    desc_produto: string,
    nome_fornecedor: string,
    nome_distribuidor: string
}

interface ProdutoNovoProps {
    onClose: () => void;
    onUpdate: () => void;
}
const ProdutoNovo = ({ onClose, onUpdate }: ProdutoNovoProps) =>{
    const [api, contextHolder] = notification.useNotification();
    const [isLoading, setIsLoading] = useState(false);
    const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
    const [distribuidores, setDistribuidores] = useState<Distribuidor[]>([]);
    const [form, setForm] = useState<FormData>({
        nome: '',
        valor_produto: 0,
        estoque: 0,
        desc_produto: '',
        nome_distribuidor: '',
        nome_fornecedor: ''
    });

    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
        try {
            const [resFornecedores, resDistribuidores] = await Promise.all([
                axios.get('http://localhost:8000/api/cadastro/fornecedores/listar-nomes/'),
                axios.get('http://localhost:8000/api/cadastro/distribuidores/listar-nomes/')
            ]);

            setFornecedores(resFornecedores.data.fornecedores || []);
            setDistribuidores(resDistribuidores.data.distribuidores || []);
        } catch (err) {
            message.error("Erro ao buscar dados.");
        }
    }
    
    const handleChange = (field: keyof FormData, value: string | number) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleCriarProduto = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await axios.post('http://localhost:8000/api/cadastro/produtos/inserir-com-fornecedor/', form);
            message.success("Produto criado com sucesso!");
            setIsLoading(false);
            onUpdate();
            onClose();
        } catch (err) {
            message.error("Erro ao criar produto.");
            setIsLoading(false);
            openNotification();
        }
    };

    const openNotification = () => {
        api.error({
          message: 'Erro ao criar produto.',
          description:
            'Produto já existente.',
          duration: 3,
        });
    };


    return (
        <>
            {contextHolder}
            <form onSubmit={handleCriarProduto} style={{ maxWidth: 400, margin: "0 auto", display: "flex", flexDirection: "column", gap: '8px' }}>
                <Text>Nome do produto:</Text>
                <Input required placeholder="Nome do produto" value={form.nome} onChange={(e) => handleChange("nome", e.target.value)}></Input>
                <Text>Valor do produto:</Text>
                <Input required placeholder="Valor do produto" type="number" value={form.valor_produto} onChange={(e) => handleChange("valor_produto", parseFloat(e.target.value))}></Input>
                <Text>Quantidade em estoque:</Text>
                <Input required placeholder="Quantidade em estoque" type="number" value={form.estoque} onChange={(e) => handleChange("estoque", parseInt(e.target.value))}></Input>
                <Text>Fornecedor:</Text>
                <Select
                    placeholder="Selecione o fornecedor"
                    onChange={(value) => handleChange("nome_fornecedor", value)}
                >
                    {fornecedores.map((f) => (
                        <Option key={f.id_fornecedor} value={f.nome}>
                            {f.nome}
                        </Option>
                    ))}
                </Select>

                <Text>Distribuidor:</Text>
                <Select
                    placeholder="Selecione o distribuidor"
                    onChange={(value) => handleChange("nome_distribuidor", value)}
                >
                    {distribuidores.map((d) => (
                        <Option key={d.id_distribuidor} value={d.nome}>
                            {d.nome}
                        </Option>
                    ))}
                </Select>
                <Text>Descrição:</Text>
                <TextArea  
                    value={form.desc_produto}
                    onChange={(e) => handleChange("desc_produto", e.target.value)}
                />
                <br/>
                <Button htmlType="submit" type="primary" loading={isLoading}>
                    Confirmar
                </Button>
            </form>
        </>
    );
}

export default ProdutoNovo;