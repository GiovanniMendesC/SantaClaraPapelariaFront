import { Button, Input, message, Typography } from "antd"
import axios from "axios";
import { useState } from "react";

const {Text} = Typography;

interface DataType{
    nome: string,
    cnpj: string   
}

interface DistribuidorNovoProps{
    onUpdate: () => void;
    onClose: ()=> void;
}

const DistribuidorNovo = ({onUpdate, onClose}: DistribuidorNovoProps) =>{
    const [isLoading, setIsLoading] = useState(false);
    const [form, setForm] = useState<DataType>({
        nome: '',
        cnpj: ''
    });

    const handleChange = (field: keyof DataType, value: string | number) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleCriarDistribuidor = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await axios.post(`http://localhost:8000/api/cadastro/distribuidores/inserir/`, form);
            message.success("Distribuidor criado com sucesso!");
            setIsLoading(false);
            onUpdate();
            onClose();
        } catch (err) {
            message.error("Erro ao criar distribuidor.");
            setIsLoading(false);
        }
    };

    return (
        <>
            <form onSubmit={handleCriarDistribuidor} style={{ maxWidth: 400, margin: "0 auto", display: "flex", flexDirection: "column", gap: '8px' }}>
                <Text>Nome do distribuidor:</Text>
                <Input required placeholder="Nome do distribuidor" value={form.nome} onChange={(e) => handleChange("nome", e.target.value)}></Input>
                <Text>CNPJ:</Text>
                <Input required maxLength={18} placeholder="CNPJ" value={form.cnpj} onChange={(e) => handleChange("cnpj", e.target.value)}></Input>
                <br/>
                <Button htmlType="submit" type="primary" loading={isLoading}>
                    Confirmar
                </Button>
            </form> 
        </>
    )
}

export default DistribuidorNovo;