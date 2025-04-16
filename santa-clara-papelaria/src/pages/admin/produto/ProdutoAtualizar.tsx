import { Button, Input, message, Typography } from "antd";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import { useEffect, useState } from "react";

const {Text} = Typography;

interface ProdutoAtualizarProps {
    produto: any,
    onUpdate: () => void,
    onClose: () => void
}

interface FormData {
    nome: string,
    valor_produto: number,
    estoque: number,
    desc_produto: string 
}

const ProdutoAtualizar = ({produto, onUpdate, onClose}: ProdutoAtualizarProps) =>{
    const [isLoading, setIsLoading] = useState(false);
    const [form, setForm] = useState<FormData>({
        nome: produto?.nome,
        valor_produto: produto?.valor_produto,
        estoque: produto?.estoque,
        desc_produto: produto?.desc_produto
    });

    useEffect(() => {
        if (produto) {
            setForm({
                nome: produto.nome,
                valor_produto: produto.valor_produto,
                estoque: produto.estoque,
                desc_produto: produto.desc_produto
            });
        }
    }, [produto]);

    const handleChange = (field: keyof FormData, value: string | number) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleAlterarProduto = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await axios.patch(`http://localhost:8000/api/cadastro/produtos/${produto.cod_produto}/alterar/`, form);
            message.success("Produto alterado com sucesso!");
            setIsLoading(false);
            onUpdate();
            onClose();
        } catch (err) {
            message.error("Erro ao alterar produto.");
            setIsLoading(false);
        }
    };


    return (
        <>
            <form onSubmit={handleAlterarProduto} style={{ maxWidth: 400, margin: "0 auto", display: "flex", flexDirection: "column", gap: '8px' }}>
                <Text>Nome do produto:</Text>
                <Input required placeholder="Nome do produto" value={form.nome} onChange={(e) => handleChange("nome", e.target.value)}></Input>
                <Text>Valor do produto:</Text>
                <Input required placeholder="Valor do produto" type="number" value={form.valor_produto} onChange={(e) => handleChange("valor_produto", parseFloat(e.target.value))}></Input>
                <Text>Quantidade em estoque:</Text>
                <Input required placeholder="Quantidade em estoque" type="number" value={form.estoque} onChange={(e) => handleChange("estoque", parseInt(e.target.value))}></Input>
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

export default ProdutoAtualizar;