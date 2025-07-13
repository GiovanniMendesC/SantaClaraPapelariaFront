import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Input, notification, Typography } from 'antd';
import axios from 'axios';
import { useAuth } from '../../../AuthContext';

const { Text } = Typography;

const ContaUpdate: React.FC = () => {
  const [api, contextHolder] = notification.useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const {login} = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<{
    nome: string;
    email: string;
    senha: string;
    cidade: string;
  }>({
    nome: '',
    email: '',
    senha: '',
    cidade: ''
  });
  const [telefone, setTelefone] = useState('');

  const regexTelefone = /^\(?\d{2}\)?[\s-]?9\d{4}[-\s]?\d{4}$/;

  const telefoneValido = regexTelefone.test(telefone);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/cadastro/clientes/${id}/exibir/`)
    .then(response => { setForm(response.data)})
    .catch(error => console.log("erro ao buscar usuário:", error))
  }, [id]);

  const handleUpdate = (event: React.FormEvent) =>{
    event.preventDefault();
    setIsLoading(true);
    axios.put(`http://127.0.0.1:8000/api/cadastro/clientes/${id}/alterar/`,{
        nome: form?.nome,
        telefone: telefone,
        senha: form?.senha,
        email: form?.email,
        cidade: form?.cidade
    }).then(response => {
        if(response.status == 200){
            login(id || '', 'C', id || '', form.nome);
            navigate('/conta')

    }})
    .catch(error =>{
      console.log('erro ao atualizar dados', error);
      openNotification();
      setIsLoading(false);
    })

  }
  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const isInvalid = () => {
    return telefone.length > 15 || !telefoneValido;
  };

  const formatarTelefone = (valor: string) => {
    const numeros = valor.replace(/\D/g, ''); // remove tudo que não for número

    let resultado = '';

    if (numeros.length > 0) resultado += '(' + numeros.slice(0, 2);
    if (numeros.length >= 3) resultado += ') ' + numeros.slice(2, 3);
    if (numeros.length >= 4) resultado += numeros.slice(3, 7);
    if (numeros.length >= 8) resultado += '-' + numeros.slice(7, 11);

    return resultado;
  };

  const openNotification = () => {
    api.error({
      message: 'Erro ao atualizar dados.',
      description:
        'Algo deu errado. Entre em contato com o suporte.',
      duration: 3,
    });
  };

  return (
    <>
        {localStorage.getItem('group')=='C' && (
            <div>
                {contextHolder}
                <h1 className="fw-bold">Alterar Dados</h1>
                <Card title={`Informações da conta`}>
                    {form && (
                        <>
                            <form className="fs-5" onSubmit={handleUpdate}>
                                <div className='text-hover-primary'> <Text className="fs-6" strong>Nome: </Text>
                                    <Input 
                                      className='fw-semibold fs-5' 
                                      required placeholder='Novo nome' 
                                      onChange={(e) => handleChange('nome', e.target.value)} 
                                      value={form.nome}>
                                    </Input>
                                </div>
                                <br/> 
                                <div> <Text className="fs-6" strong>Telefone: </Text>
                                    <Input 
                                      className='fw-semibold fs-5' 
                                      required maxLength={15} 
                                      placeholder='Novo Telefone' 
                                      status={telefone && !telefoneValido ? 'error' : ''}
                                      onChange={(e) => setTelefone(formatarTelefone(e.target.value))} 
                                      value={telefone}>
                                    </Input>
                                </div>
                                <br/>
                                <div> <Text className="fs-6" strong>Email: </Text>
                                    <Input 
                                      className='fw-semibold fs-5'
                                      placeholder='Novo Email' 
                                      onChange={(e) => handleChange('email', e.target.value)} 
                                      value={form.email}>
                                    </Input>
                                </div>
                                <br/>
                                <div> <Text className="fs-6" strong>Senha: </Text>
                                    <Input 
                                      className='fw-semibold fs-5' 
                                      required placeholder='Nova Senha' 
                                      onChange={(e) => handleChange('senha', e.target.value)} 
                                      value={form.senha}>
                                    </Input>
                                </div>
                                <br/>
                                <div> <Text className="fs-6" strong>Cidade: </Text>
                                    <Input 
                                      className='fw-semibold fs-5' 
                                      required placeholder='Novo Endereço' 
                                      onChange={(e) => handleChange('cidade', e.target.value)} 
                                      value={form.cidade}>
                                    </Input>
                                </div>
                                <br/>
                                <div style={{ display: 'flex', justifyContent: 'flex-end' }} className='gap-4'>
                                  <Button className="fs-5" type="primary" danger onClick={() => navigate('/conta')}>
                                      Cancelar
                                  </Button>
                                  <Button className="fs-5" type="primary" htmlType="submit" disabled={isInvalid()} loading={isLoading}>Confirmar</Button>
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