import { Modal } from 'antd';
import Login from "../login/LoginPage";
import { useEffect } from "react";
import { useAuth } from '../../AuthContext';

const Pedidos = () => {
  const { isLoggedIn, loginModalOpen, setLoginModalOpen } = useAuth();

  useEffect(() => {
    // Abre o modal se não estiver logado
    if (!isLoggedIn) {
      setLoginModalOpen(true);
    } else {
      setLoginModalOpen(false);  // Fecha o modal se já estiver logado
    }
  }, [isLoggedIn, setLoginModalOpen]);

  return (
    <>
      <Modal
        open={loginModalOpen}
        onCancel={() => setLoginModalOpen(false)}
        title='Login necessário'
        footer={null}
      >
        <Login />
      </Modal>

      {/* Seu conteúdo da página */}
      <div>Hello World</div>
    </>
  );
}

export default Pedidos;
