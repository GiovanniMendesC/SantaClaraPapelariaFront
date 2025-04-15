import { Button, Card, Modal } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FornecimentoNovo from "./FornecimentoNovo";

const Fornecimento = () =>{
    const [fornecimentoModalOpen, setForncimentoModalOpen] = useState(false);
    const navigate = useNavigate();


    return (
        <>
            <Modal
                open={fornecimentoModalOpen}
                onCancel={()=> setForncimentoModalOpen(false)}
                title='Adicionar Fornecimento'
                footer={null}
            >
                <FornecimentoNovo onClose={() => setForncimentoModalOpen(false)}/>
            </Modal>

            <Card title='Fornecimento'>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button type="primary" onClick={()=>setForncimentoModalOpen(true)}>Adicionar Fornecimento</Button>
                </div>
            </Card>
        </>
    )
}

export default Fornecimento;