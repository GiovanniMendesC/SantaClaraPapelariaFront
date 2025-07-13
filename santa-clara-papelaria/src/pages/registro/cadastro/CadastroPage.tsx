import { Button, Checkbox, Input, message, notification } from "antd";

import { UserOutlined, KeyOutlined, PhoneOutlined, MailOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Cadastro = () =>{
    const [api, contextHolder] = notification.useNotification();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [form, setForm] = useState({
        nome: '',
        telefone: '',
        senha: '',
        email: '',
        cidade: ''
      });
      
      const handleChange = (field: string, value: string | boolean) => {
        setForm(prev => ({ ...prev, [field]: value }));
      };

      const handleCadastro = (event: React.FormEvent<HTMLFormElement>) =>{
        event.preventDefault();
        setIsLoading(true);
            axios.post('http://127.0.0.1:8000/api/cadastro/clientes/cadastrar/', {
                nome: form.nome,
                telefone: form.telefone,
                senha: form.senha,
                email: form.email,
                cidade: form.cidade
            })
            .then((response) => {
              console.log('Cadastro realizado com sucesso:', response.data);
              message.success('Cadastro realizado com sucesso!')
                navigate('/login');
                setIsLoading(false);
              
            })
            .catch((error) => {
              console.error('Erro ao cadastrar:', error);
              openNotification();
              setIsLoading(false);
            });
      }

      const openNotification = () => {
        api.error({
          message: 'Erro ao cadastrar cliente.',
          description:
            'Número de telefone já cadastrado.',
          duration: 3,
        });
      };

      const regexTelefone = /^\(?\d{2}\)?[\s-]?9\d{4}[-\s]?\d{4}$/;

      const telefoneValido = regexTelefone.test(form.telefone);

      const formatarTelefone = (valor: string) => {
        const numeros = valor.replace(/\D/g, ''); // remove tudo que não for número

        let resultado = '';

        if (numeros.length > 0) resultado += '(' + numeros.slice(0, 2);
        if (numeros.length >= 3) resultado += ') ' + numeros.slice(2, 3);
        if (numeros.length >= 4) resultado += numeros.slice(3, 7);
        if (numeros.length >= 8) resultado += '-' + numeros.slice(7, 11);

        return resultado;
      };

      const isInvalid = () =>{
        if(form.telefone.length > 15 ||
        !form.nome.trim() ||
        !form.telefone.trim() ||
        !form.senha.trim() ||
        !form.email.trim() ||
        !form.cidade.trim())
        {
            return true;
        }
        return false;
      }
      
    return(
        <>
            {contextHolder}
            <h1 className="fw-bold mb-5">Cadastro</h1>
            <div style={{display:'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center'}}>
                <h2 className="mb-4">Preencha com suas informações</h2>
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
                  size="large"
                  placeholder="Telefone"
                  maxLength={15}
                  status={form.telefone && !telefoneValido ? 'error' : ''}
                  value={form.telefone}
                  onChange={(e) => handleChange('telefone', formatarTelefone(e.target.value))}
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
                  <Input
                  size="large"
                  placeholder="Cidade"
                  maxLength={30}
                  value={form.cidade}
                  onChange={(e) => handleChange('cidade', e.target.value)}
                  prefix={<EnvironmentOutlined />}
                  required
                  />
                  
                  <div style={{display: 'flex', justifyContent: 'space-around'}}>
                      <Button className="fs-5" type="primary" htmlType="submit" style={{position: 'relative', width: '100vw'}} disabled={isInvalid()} loading={isLoading}>
                          Confirmar
                      </Button>
                  </div>
                </form>
            </div>
        </>
    )
}

export default Cadastro;