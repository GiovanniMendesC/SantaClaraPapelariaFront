import { Button, Input, message, Typography } from "antd";
import axios from "axios";
import { useState } from "react";

const {Text} = Typography;

interface DataType{
    id_fornecedor: number,
    nome: string,
    cnpj: string   
}

interface FornecedorAtualizarProps{
    fornecedor: any;
    onUpdate: () => void;
    onClose: ()=> void;
}

const FornecedorAtualizar = ({fornecedor, onUpdate, onClose}: FornecedorAtualizarProps) =>{
    const [isLoading, setIsLoading] = useState(false);
    const [form, setForm] = useState<DataType>({
        nome: fornecedor?.nome,
        id_fornecedor: fornecedor?.id_fornecedor,
        cnpj: fornecedor?.cnpj
    });

    const handleChange = (field: keyof DataType, value: string | number) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleAlterarFornecedor = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await axios.put(`http://localhost:8000/api/cadastro/fornecedores/${fornecedor.id_fornecedor}/alterar/`, form);
            message.success("Fornecedor alterado com sucesso!");
            setIsLoading(false);
            onUpdate();
            onClose();
        } catch (err) {
            message.error("Erro ao alterar fornecedor.");
            setIsLoading(false);
        }
    };

    return(
        <>
           <form onSubmit={handleAlterarFornecedor} style={{ maxWidth: 400, margin: "0 auto", display: "flex", flexDirection: "column", gap: '8px' }}>
                <Text>Nome do fornecedor:</Text>
                <Input required placeholder="Nome do fornecedor" value={form.nome} onChange={(e) => handleChange("nome", e.target.value)}></Input>
                <Text>CNPJ:</Text>
                <Input required maxLength={18} placeholder="CNPJ" value={form.cnpj} onChange={(e) => handleChange("cnpj", e.target.value)}></Input>
                <br/>
                <Button htmlType="submit" type="primary" loading={isLoading}>
                    Confirmar
                </Button>
            </form> 
        </>
    );
}

export default FornecedorAtualizar;