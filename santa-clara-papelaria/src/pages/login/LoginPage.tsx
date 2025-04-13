import { useAuth } from '../../AuthContext';
import { Button, Input, message } from 'antd';
import { UserOutlined, KeyOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useState, useEffect } from 'react';

const Login = () => {
  const { login, isLoggedIn, setIsLoggedIn, setLoginModalOpen, logout } = useAuth();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  useEffect(() => {
    // Verificar se o usuário está logado ao carregar a página
    const user = localStorage.getItem('username');
    if (user) {
      setIsLoggedIn(true); // Se houver dados no localStorage, o usuário está logado
    }
  }, [setIsLoggedIn]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let response = await axios.get(`http://127.0.0.1:8000/api/cadastro/vendedores/autenticar/`, {
        params: {
          codigo: username,
          senha: password,
        },
      });

      // Se não encontrar no vendedores, tentar autenticar no de clientes
      if (!response.data.matricula) {
        response = await axios.get(`http://127.0.0.1:8000/api/cadastro/clientes/autenticar`, {
          params: {
            telefone: username,
            senha: password,
          },
        });
      }

      if (response.data) {
        login(username); // Usando a função de login do AuthContext
        message.info('Login bem-sucedido!');
      } else {
        message.error('Usuário ou senha incorretos');
      }
    } catch (error) {
      console.error(error);
      message.error('Erro ao tentar fazer login');
    }
  };

  const handleLogout = () => {
    logout();  // Usando a função de logout do AuthContext
    setLoginModalOpen(false); // Fecha o modal de login após o logout
    message.success('Logout bem-sucedido!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {isLoggedIn ? (
        <>
          <h2>Bem-vindo, {username}!</h2>
          <Button onClick={handleLogout} type="primary" danger>
            Sair
          </Button>
        </>
      ) : (
        <>
          <h2>Informe seu Login</h2>
          <form onSubmit={handleLogin} style={{ width: '300px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Input
              size="large"
              placeholder="Login"
              prefix={<UserOutlined />}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <Input.Password
              size="large"
              placeholder="Senha"
              prefix={<KeyOutlined />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="primary" htmlType="submit">
              Confirmar
            </Button>
          </form>
        </>
      )}
    </div>
  );
};

export default Login;
