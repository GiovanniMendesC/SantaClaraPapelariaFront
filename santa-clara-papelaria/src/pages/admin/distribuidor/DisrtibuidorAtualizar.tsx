import { Button, Input, message, Typography } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

const {Text} = Typography;

interface DataType{
    id_distribuidor: number,
    nome: string,
    cnpj: string   
}

interface DistribuidorAtualizarProps{
    distribuidor: any;
    onUpdate: () => void;
    onClose: ()=> void;
}

const DistribuidorAtualizar = ({distribuidor, onUpdate, onClose}: DistribuidorAtualizarProps) =>{
    const [isLoading, setIsLoading] = useState(false);
    const [form, setForm] = useState<DataType>({
        nome: distribuidor?.nome,
        id_distribuidor: distribuidor?.id_distribuidor,
        cnpj: distribuidor?.cnpj
    });

    useEffect(() => {
        if (distribuidor) {
            setForm({
                nome: distribuidor.nome,
                id_distribuidor: distribuidor.id_distribuidor,
                cnpj: distribuidor.cnpj
            });
        }
    }, [distribuidor]);

    const handleChange = (field: keyof DataType, value: string | number) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleAlterarDistribuidor = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await axios.put(`http://localhost:8000/api/cadastro/distribuidores/${distribuidor.id_distribuidor}/alterar/`, form);
            message.success("Distribuidor alterado com sucesso!");
            setIsLoading(false);
            onUpdate();
            onClose();
        } catch (err) {
            message.error("Erro ao alterar distribuidor.");
            setIsLoading(false);
        }
    };

    return(
        <>
           <form onSubmit={handleAlterarDistribuidor} style={{ maxWidth: 400, margin: "0 auto", display: "flex", flexDirection: "column", gap: '8px' }}>
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
    );
}

export default DistribuidorAtualizar;