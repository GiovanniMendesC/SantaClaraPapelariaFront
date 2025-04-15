import { useEffect } from "react";
import Fornecimento from "./fornecimento/FornecimentoPage"
import { useAuth } from "../../AuthContext";
import { useNavigate } from "react-router-dom";
import { Modal } from "antd";
import Login from "../registro/login/LoginPage";
import Produto from "./produto/ProdutoPage";
import Fornecedor from "./fornecedor/FornecedorPage";
import Distribuidor from "./distribuidor/DistribuidorPage";

const Admin = () =>{
    const { isLoggedIn, loginModalOpen, setLoginModalOpen } = useAuth();
    const navigate = useNavigate();
    
    useEffect(() => {
        // Abre o modal se não estiver logado
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

    return (
        <>
            <h1>Administração</h1>
            <Modal
                open={loginModalOpen}
                onCancel={handleCancel}
                title='Login necessário'
                footer={null}
            >
                <Login />
            </Modal>
            
            <Fornecimento/>
            <br/>
            <Produto/>
            <br/>
            <Fornecedor/>
            <br/>
            <Distribuidor/>
            <br/>

        </>
    )
}

export default Admin;