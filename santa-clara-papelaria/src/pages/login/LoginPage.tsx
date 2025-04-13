import axios from 'axios';
import { KeyOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Input, message } from 'antd';
import { useEffect, useState } from 'react';


const Login = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    // Verificar se o usuário está logado ao carregar a página
    useEffect(() => {
        const user = localStorage.getItem('username');
        if (user) {
            setIsLoggedIn(true); // Se houver dados no localStorage, o usuário está logado
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Tentar autenticar no endpoint de vendedores
            let response = await axios.get(`http://127.0.0.1:8000/api/cadastro/vendedores/autenticar/`, {
                params: {
                    codigo: username,  // string com o valor do username
                    senha: password   // string com o valor da senha
                }
            });

            // Se não encontrar no vendedores, tentar autenticar no de clientes
            if (!response.data.success) {
                response = await axios.get(`http://127.0.0.1:8000/api/cadastro/clientes/autenticar`, {
                    params: {
                        telefone: username,  // string com o valor do username
                        senha: password   // string com o valor da senha
                    }
                });
            }

            // Aqui você decide o que fazer com a resposta
            if (response.data) {  // Supondo que a API retorna { success: true }
                console.log("chegou aqui")
                localStorage.setItem('username', username);  // Salvar no localStorage
                setIsLoggedIn(true);
                message.success('Login bem-sucedido!');
            } else {
                message.error('Usuário ou senha incorretos');
            }
        } catch (error) {
            console.error(error);
            message.error('Erro ao tentar fazer login');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('username');  // Limpar o localStorage
        setIsLoggedIn(false);
    };

    return (
        <>  
            <h1>Login</h1>
            {isLoggedIn ? (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <h1>Bem-vindo!</h1>
                    <Button style={{padding: '20px'}} type='primary' onClick={handleLogout}>Sair</Button>
                </div>
            ) : (
                <form
                    onSubmit={handleSubmit}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <div style={{ position: 'relative', width: '30vw' }}>
                        <h2>Informe seu Login</h2>
                        <Input
                            size="large"
                            placeholder="Login"
                            prefix={<UserOutlined />}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div style={{ position: 'relative', width: '30vw', marginTop: 20 }}>
                        <h2>Informe sua Senha</h2>
                        <Input.Password
                            size="large"
                            placeholder="Senha"
                            prefix={<KeyOutlined />}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div style={{ position: 'relative', width: '30vw' }}>
                        <br/>
                        <Button
                            style={{ marginLeft: 'auto' }}
                            type="primary"
                            htmlType="submit"
                        >
                            Confirmar
                        </Button>
                    </div>
                </form>
            )}
        </>
    )
}

export default Login;