import axios from 'axios';
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Definindo o tipo do contexto
interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  loginModalOpen: boolean;
  setLoginModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  login: (login: string, group: string, id: string, username: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personalizado para acessar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

// Componente Provider que envolve a aplicação e fornece os valores do contexto
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<{
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
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!localStorage.getItem('username'));
  const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false);

  // Função de login
  const login = async (login: string, group: string, id: string, username: string) => {
    if(group == 'V'){
        localStorage.setItem('login', login);
        localStorage.setItem('group', group);
        localStorage.setItem('username', username);
            
        setIsLoggedIn(true);
        setLoginModalOpen(false);
    }else if(group == 'C'){
        const response = await axios.get(`http://127.0.0.1:8000/api/cadastro/clientes/${id}/exibir/`);
        setData(response.data);

        if(data){
            localStorage.setItem('login', response.data.telefone);
            localStorage.setItem('group', group);
            localStorage.setItem('id', id);
            localStorage.setItem('username', response.data.nome);
                    
            setIsLoggedIn(true);
            setLoginModalOpen(false);
        }
    }
  };

  // Função de logout
  const logout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('group');
    localStorage.removeItem('login');
    localStorage.removeItem('id');
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, loginModalOpen, setLoginModalOpen, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
