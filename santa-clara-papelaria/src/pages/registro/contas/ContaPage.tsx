import { useEffect } from "react";
import { useAuth } from "../../../AuthContext";
import { Button, Card, Modal, Typography } from "antd";
import Login from "../login/LoginPage";
import { Link, useNavigate, useParams } from "react-router-dom";

const {Text} = Typography;

const Conta = () =>{
  const { isLoggedIn, loginModalOpen, setLoginModalOpen } = useAuth();
  const navigate = useNavigate();
  const {loginName} = useParams<{ loginName: string }>();

  useEffect(() => {
    // Abre o modal se não estiver logado
    if (!isLoggedIn) {
      setLoginModalOpen(true);
    } else {
      setLoginModalOpen(false);
    }
  }, [isLoggedIn, setLoginModalOpen, loginName]);

  const handleCancel = () => {
    setLoginModalOpen(false);
    if (!isLoggedIn) {
      navigate('/'); // ← Redireciona para a página /home
    }
  };

    return (
        <>
            <Modal
                open={loginModalOpen}
                onCancel={handleCancel}
                title='Login necessário'
                footer={null}
            >
                <Login />
            </Modal>
            <h1>Conta</h1>
            
            {isLoggedIn && (
                <>
                    <Card title='Informações da conta'>
                        <div>
                            <Text strong>Nome:</Text> {localStorage.getItem('username')}
                        </div>
                        <br/>
                        <div>
                            <Text strong>Login:</Text> {localStorage.getItem('login')}
                        </div>
                        <br/>
                        <br/>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            {localStorage.getItem('group') == 'C' && (
                                <Link to={`/conta/${localStorage.getItem('id')}`}>
                                    <Button type="primary">Alterar Dados</Button>
                                </Link>
                            )}
                        </div> 
                    </Card>
                </>
            )}

        </>
    );
}

export default Conta;