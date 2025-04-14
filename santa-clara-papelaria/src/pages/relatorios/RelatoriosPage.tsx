import dayjs from 'dayjs';
import { useEffect, useState } from "react";
import { useAuth } from "../../AuthContext";
import { Button, Card, DatePicker, message, Modal } from "antd";
import Login from "../registro/login/LoginPage";
import { useNavigate } from "react-router-dom";
import {DownloadOutlined} from "@ant-design/icons"
import axios from "axios";

const Relatorios = () => {
  const { isLoggedIn, loginModalOpen, setLoginModalOpen } = useAuth();
  const [dates, setDates] = useState<{  initialDate: dayjs.Dayjs | null; finalDate: dayjs.Dayjs | null  }>({
    initialDate: null,
    finalDate: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Abre o modal se não estiver logado
    if (!isLoggedIn) {
      setLoginModalOpen(true);
    } else {
      setLoginModalOpen(false);
    }
  }, [isLoggedIn, setLoginModalOpen]);

  const handleChangeDate = (date: dayjs.Dayjs | null, type: 'initialDate' | 'finalDate') => {
    if (date) {
      setDates((prevDates) => ({
        ...prevDates,
        [type]: date,
      }));
    }
  };

  const request_url = (relatorio: string) =>{
    switch (relatorio){
        case 'faturamento':
            return 'http://127.0.0.1:8000/api/comercial/relatorio/faturamento_csv/'
        case 'estoque':
            return 'http://127.0.0.1:8000/api/comercial/relatorio/alerta_estoque_csv/'
        case 'vendas':
            return 'http://127.0.0.1:8000/api/comercial/relatorio/vendas_vendedor_csv/'
            default: return ''
    }
  }

  const handleDownload = async (request_url: string, reportType: string) => {
    try {
      // Faz a requisição para obter o arquivo
      if(dates.finalDate && dates.initialDate){
          const response = await axios.get(request_url, {
            params: {
              data_inicio: dates.initialDate.toISOString(),
              data_fim: dates.finalDate.toISOString(),
            },
            responseType: "blob",
          });
          const blob = new Blob([response.data], { type: response.headers["content-type"] });
          
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `${reportType}.csv`;
          link.click();
          window.URL.revokeObjectURL(url);
      }else if(reportType =='venda' || reportType == 'estoque'){
        const response = await axios.get(request_url, {
            responseType: "blob",
          });
          const blob = new Blob([response.data], { type: response.headers["content-type"] });
          
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `${reportType}.csv`;
          link.click(); 
          window.URL.revokeObjectURL(url);
      }

      // Cria um Blob com a resposta
    } catch (error) {
      message.error("Erro ao baixar o relatório.");
      console.error("Erro no download:", error);
    }
  };

  const handleCancel = () => {
    setLoginModalOpen(false);
    if (!isLoggedIn) {
      navigate('/');
    }
  };

  const isInvalid = () =>{
    if(dates.finalDate && dates.initialDate){
        return false;
    }
    return true;
  }

    return(
        <>
            <h1>Relatórios</h1>
            <Modal
                open={loginModalOpen}
                onCancel={handleCancel}
                title='Login necessário'
                footer={null}
            >
                <Login />
            </Modal>

            {isLoggedIn && localStorage.getItem('group') == 'V' && (
                <>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                            <Card title='Faturamento Total' style={{display: 'flex', flexDirection: 'column'}}>
                                <DatePicker placeholder='Data inicial' 
                                            style={{marginRight:'20px'}}
                                            value={dates.initialDate}
                                            onChange={(date) => handleChangeDate(date, 'initialDate')}>
                                </DatePicker>
                                <DatePicker placeholder='Data final' 
                                            style={{marginRight:'20px'}}
                                            value={dates.finalDate}
                                            onChange={(date) => handleChangeDate(date, 'finalDate')}>
                                </DatePicker>
                                <br/>
                                <br/>
                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button type="primary" onClick={()=>handleDownload(request_url('faturamento'), 'faturamento')} disabled={isInvalid()}><DownloadOutlined />Baixar</Button>
                                </div>
                            </Card>
                            <br/>
                            <Card title='Produtos com Pouco Estoque'>
                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button type="primary" onClick={()=>handleDownload(request_url('estoque'), 'estoque')}><DownloadOutlined />Baixar</Button>
                                </div>
                            </Card>
                            <br/>
                            <Card title='Vendas por Vendedor'>
                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button type="primary" onClick={()=>handleDownload(request_url('venda'), 'venda')}><DownloadOutlined />Baixar</Button>
                                </div>
                            </Card>
                            <br/>
                    </div>
                </>
            )}

        </>
    )
}

export default Relatorios;