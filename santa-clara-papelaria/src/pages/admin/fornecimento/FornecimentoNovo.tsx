import { Button, InputNumber, message, Select, Typography } from "antd"
import axios from "axios"
import { useEffect, useState } from "react"

const { Option } = Select;
const { Text } = Typography;

interface FormData {
    nome_produto: string,
    nome_fornecedor: string,
    nome_distribuidor: string,
    quantidade: number
}

interface Produto {
    cod_produto: number,
    nome: string
}

interface Fornecedor {
    id_fornecedor: number,
    nome: string
}

interface Distribuidor {
    id_distribuidor: number,
    nome: string
}

interface FornecimentoNovoProps {
    onClose: () => void;
}

const FornecimentoNovo = ({ onClose }: FornecimentoNovoProps) => {
    const [form, setForm] = useState<FormData>({
        nome_produto: "",
        nome_fornecedor: "",
        nome_distribuidor: "",
        quantidade: 0
    });
    const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [distribuidores, setDistribuidores] = useState<Distribuidor[]>([]);

    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
        try {
            const [resProdutos, resFornecedores, resDistribuidores] = await Promise.all([
                axios.get('http://localhost:8000/api/cadastro/produtos/listar-nomes/'),
                axios.get('http://localhost:8000/api/cadastro/fornecedores/listar-nomes/'),
                axios.get('http://localhost:8000/api/cadastro/distribuidores/listar-nomes/')
            ]);

            setProdutos(resProdutos.data.produtos || []);
            setFornecedores(resFornecedores.data.fornecedores || []);
            setDistribuidores(resDistribuidores.data.distribuidores || []);
        } catch (err) {
            message.error("Erro ao buscar dados.");
        }
    }

    const handleChange = (field: keyof FormData, value: string | number) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleCriarFornecimento = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/api/cadastro/produtos/registrar-entrada-estoque/', form);
            message.success("Fornecimento criado com sucesso!");
            onClose();
        } catch (err) {
            message.error("Erro ao criar fornecimento.");
        }
    };

    return (
        <>
            <form onSubmit={handleCriarFornecimento} style={{ maxWidth: 400, margin: "0 auto", display: "flex", flexDirection: "column", gap: '8px' }}>
                <Text>Produto:</Text>
                <Select
                    placeholder="Selecione o produto"
                    onChange={(value) => handleChange("nome_produto", value)}
                >
                    {produtos.map((p) => (
                        <Option key={p.cod_produto} value={p.nome}>
                            {p.nome}
                        </Option>
                    ))}
                </Select>

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

                <Text>Quantidade:</Text>
                <InputNumber
                    min={1}
                    style={{ width: "100%" }}
                    onChange={(value) => handleChange("quantidade", value || 0)}
                />

                <Button htmlType="submit" type="primary">
                    Confirmar
                </Button>
            </form>
        </>
    )
}

export default FornecimentoNovo;
