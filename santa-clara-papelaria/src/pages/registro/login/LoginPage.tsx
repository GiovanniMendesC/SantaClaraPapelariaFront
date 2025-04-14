import { useAuth } from '../../../AuthContext';
import { Button, Input, message } from 'antd';
import { UserOutlined, KeyOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  const { login, isLoggedIn, setIsLoggedIn, setLoginModalOpen, logout } = useAuth();
  const [loginName, setLogin] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  useEffect(() => {
    // Verificar se o usuário está logado ao carregar a página
    const loginName = localStorage.getItem('login');
    if (loginName) {
      setLogin(loginName);
      const user = localStorage.getItem('username');
      if(user)
      setUsername(user);
      setIsLoggedIn(true); // Se houver dados no localStorage, o usuário está logado
    }
  }, [setIsLoggedIn]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let response = await axios.get(`http://127.0.0.1:8000/api/cadastro/vendedores/autenticar/`, {
        params: {
          codigo: loginName,
          senha: password,
        },
      });

      // Se não encontrar no vendedores, tentar autenticar no de clientes
      if (!response.data.matricula) {
        response = await axios.get(`http://127.0.0.1:8000/api/cadastro/clientes/autenticar`, {
          params: {
            telefone: loginName,
            senha: password,
          },
        });
      }

      if (response.data) {
        login(loginName, response.data.matricula?'V':'C', response.data.id_cliente, response.data.nome); // Usando a função de login do AuthContext
        setUsername(response.data.nome);
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
    <>
        <h1>Login</h1>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {isLoggedIn ? (
            <>
            <h2>Bem-vindo, {username}!</h2>
            <div style={{display:'flex', justifyContent: 'space-around'}}>
                <Button onClick={handleLogout} type="primary" danger>
                    Sair
                </Button>
                <Link to={`/${loginName}`} style={{ textDecoration: 'none', marginLeft: '50px'}}>
                    <Button type='primary'>Alterar dados</Button>
                </Link>
            </div>
            </>
        ) : (
            <>
            <h2>Informe seu Login</h2>
            <form onSubmit={handleLogin} style={{ width: '60%', display: 'flex', flexDirection: 'column', gap: '20px', position:'relative', maxWidth: '30vw'}}>
                <Input
                size="large"
                placeholder="Login (telefone ou matrícula)"
                prefix={<UserOutlined />}
                value={loginName}
                onChange={(e) => setLogin(e.target.value)}
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
                <div style={{display: 'flex', justifyContent: 'space-around'}}>
                    <Link to='/cadastro' style={{ textDecoration: 'none'}}>
                        <Button type='primary'>Cadastro</Button>
                    </Link>
                    <Button type="primary" htmlType="submit">
                        Confirmar
                    </Button>
                </div>
            </form>
            </>
        )}
        </div>
    </>
  );
};

export default Login;
