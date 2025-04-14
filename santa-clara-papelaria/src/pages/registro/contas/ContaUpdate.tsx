import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Checkbox, Input, Typography } from 'antd';
import axios from 'axios';
import { useAuth } from '../../../AuthContext';

const { Text } = Typography;

const ContaUpdate: React.FC = () => {
  const {login} = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<{
    nome: string;
    telefone: string;
    email: string;
    senha: string;
    cliente_especial: boolean;
  }>({
    nome: '',
    telefone: '',
    email: '',
    senha: '',
    cliente_especial: false
  });

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/cadastro/clientes/${id}/exibir/`)
    .then(response => { setForm(response.data)})
    .catch(error => console.log("erro ao buscar usuário:", error))
  }, [id]);

  const handleUpdate = (event: React.FormEvent) =>{
    event.preventDefault();

    axios.put(`http://127.0.0.1:8000/api/cadastro/clientes/${id}/alterar/`,{
        nome: form?.nome,
        telefone: form?.telefone,
        senha: form?.senha,
        email: form?.email,
        cliente_especial: form?.cliente_especial
    }).then(response => {
        if(response.status == 200){
            login(form.telefone, 'C', id || '', form.nome);
            navigate('/conta')

    }})

  }
  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const isInvalid = () => {
    return form.email.length > 20 || form.telefone.length > 15;
  };

  return (
    <>
        {localStorage.getItem('group')=='C' && (
            <div>
                <h1>Alterar Dados</h1>
                <Card title={`Informações da conta`}>
                    {form && (
                        <>
                            <form onSubmit={handleUpdate}>
                                <div> <Text strong>Nome: </Text>
                                    <Input required placeholder='Novo nome' onChange={(e) => handleChange('nome', e.target.value)} value={form.nome}></Input>
                                </div>
                                <br/> 
                                <div> <Text strong>Telefone: </Text>
                                    <Input required maxLength={15} placeholder='Novo Telefone' onChange={(e) => handleChange('telefone', e.target.value)} value={form.telefone}></Input>
                                </div>
                                <br/>
                                <div> <Text strong>Email: </Text>
                                    <Input required maxLength={20} placeholder='Novo Email' onChange={(e) => handleChange('email', e.target.value)} value={form.email}></Input>
                                </div>
                                <br/>
                                <div> <Text strong>Senha: </Text>
                                    <Input required placeholder='Nova Senha' onChange={(e) => handleChange('senha', e.target.value)} value={form.senha}></Input>
                                </div>
                                <br/>
                                <Checkbox checked={form.cliente_especial} onChange={(e) => handleChange('cliente_especial', e.target.value)}>Cliente Especial</Checkbox>
                                <br/>
                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button type="primary" htmlType="submit" disabled={isInvalid()}>Confirmar</Button>
                                </div>
                            </form>
                        </>
                    )}
                </Card>
            </div>
        )}
    </>
  );
};

export default ContaUpdate;