import { Button, Checkbox, Input, message } from "antd";

import { UserOutlined, KeyOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Cadastro = () =>{
    const navigate = useNavigate();
    const [form, setForm] = useState({
        nome: '',
        telefone: '',
        senha: '',
        email: '',
        cliente_especial: false,
      });
      
      const handleChange = (field: string, value: string | boolean) => {
        setForm(prev => ({ ...prev, [field]: value }));
      };

      const handleCadastro = (event: React.FormEvent<HTMLFormElement>) =>{
        event.preventDefault();
            axios.post('http://127.0.0.1:8000/api/cadastro/clientes/cadastrar/', {
                nome: form.nome,
                telefone: form.telefone,
                senha: form.senha,
                email: form.email,
                cliente_especial: form.cliente_especial
            })
            .then((response) => {
              console.log('Cadastro realizado com sucesso:', response.data);
              message.success('Cadastro realizado com sucesso!')
                navigate('/login');
            })
            .catch((error) => {
              console.error('Erro ao cadastrar:', error);
            });
      }

      const isInvalid = () =>{
        if(form.email.length > 20 || form.telefone.length >= 15){
            return true;
        }
        return false;
      }
      
    return(
        <>
            <h1>Cadastro</h1>
            <div style={{display:'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center'}}>
                <h2>Preencha com suas informações</h2>
                <form onSubmit={handleCadastro} style={{ width: '60%', display: 'flex', flexDirection: 'column', gap: '20px', position:'relative', maxWidth: '30vw'}}>
                <Input
                size="large"
                placeholder="Nome"
                value={form.nome}
                onChange={(e) => handleChange('nome', e.target.value)}
                prefix={<UserOutlined />}
                required
                />
                <Input
                type="number"
                size="large"
                placeholder="Telefone"
                maxLength={15}
                value={form.telefone}
                onChange={(e) => handleChange('telefone', e.target.value)}
                prefix={<PhoneOutlined />}
                required
                />
                <Input.Password
                size="large"
                placeholder="Senha"
                value={form.senha}
                onChange={(e) => handleChange('senha', e.target.value)}
                prefix={<KeyOutlined />}
                required
                />
                <Input
                size="large"
                placeholder="Email"
                maxLength={20}
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                prefix={<MailOutlined />}
                required
                />
                <Checkbox
                    checked={form.cliente_especial}
                    onChange={(e) => handleChange('cliente_especial', e.target.checked)}
                    >
                    Usuário Especial
                </Checkbox>
                <div style={{display: 'flex', justifyContent: 'space-around'}}>
                    <Button type="primary" htmlType="submit" style={{position: 'relative', width: '100vw'}} disabled={isInvalid()}>
                        Confirmar
                    </Button>
                </div>
                </form>
            </div>
        </>
    )
}

export default Cadastro;