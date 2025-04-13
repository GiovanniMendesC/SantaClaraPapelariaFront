import React, { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ShopOutlined,
  UploadOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import { Link, Route, Routes } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import Home from "./pages/home/HomePage"
import Login from './pages/login/LoginPage';
import Pedidos from './pages/pedidos/PedidosPage';
import Carrinho from './pages/carrinho/CarrinhoPage';
import Cadastro from './pages/login/CadastroPage';

const { Header, Sider, Content } = Layout;

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
    

  return (
    <Layout style={{ minHeight: '100vh'}}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          style={{
            fontSize: '18px', // aumenta o texto
            lineHeight: '60px'
          }}
          items={[
            {
              key: '/',
              icon: <ShopOutlined style={{fontSize: '20px'}}/>,
              label: <Link to='/'>Home</Link>,
            },
            {
              key: '/login',
              icon: <UserOutlined style={{fontSize: '20px'}}/>,
              label: <Link to='/login'>Login</Link>,
            },
            {
              key: '/pedidos',
              icon: <UploadOutlined style={{fontSize: '20px'}}/>,
              label: <Link to='/pedidos'>Pedidos</Link>,
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/pedidos" element={<Pedidos/>} />
              <Route path="/carrinho" element={<Carrinho/>} />
              <Route path="/cadastro" element={<Cadastro/>} />
            </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
