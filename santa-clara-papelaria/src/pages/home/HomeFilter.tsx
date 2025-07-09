import { Modal, Input, InputNumber, Form, Button, Switch } from "antd";
import { useEffect } from "react";
import { useAuth } from "../../AuthContext";

interface Props {
  open: boolean;
  onClose: () => void;
  onApply: (filtros: any) => void;
  initialValues: any;
}

const HomeFilter = ({ open, onClose, onApply, initialValues }: Props) => {
  const [form] = Form.useForm();
  const {isLoggedIn} = useAuth();

  useEffect(() => {
    if (open) {
      form.setFieldsValue(initialValues);
    }
  }, [open, form, initialValues]);

  const handleOk = () => {
    const valores = form.getFieldsValue();
    onApply(valores);
    onClose();
  };

  const handleClear = () => {
    const valoresZerados = {
      nome: null,
      preco_min: null,
      preco_max: null,
      fornecido_em_mari: null,
      estoque_baixo: null
    };
    form.setFieldsValue(valoresZerados);
    onApply(valoresZerados);
    onClose();
  };

  return (
    <Modal
      title="Filtros"
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="limpar" danger type="primary" onClick={handleClear} className="fs-5">
          Limpar
        </Button>,
        <Button key="aplicar" type="primary" onClick={handleOk} className="fs-5">
          Aplicar
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item label="Nome do Produto" name="nome">
          <Input />
        </Form.Item>
        <Form.Item label="Preço mínimo" name="preco_min">
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label="Preço máximo" name="preco_max">
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label='Fornecido em Mari' name="fornecido_em_mari" valuePropName="checked">
          <Switch/>
        </Form.Item>
        {isLoggedIn && localStorage.getItem('group') == 'V' && (
            <Form.Item label='Estoque Baixo' name="estoque_baixo" valuePropName="checked">
                <Switch/>
            </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default HomeFilter;
