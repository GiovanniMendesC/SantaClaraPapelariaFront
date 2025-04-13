import React, { createContext, useContext, useState, ReactNode } from 'react';

// Definindo o tipo do contexto
interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  loginModalOpen: boolean;
  setLoginModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  login: (username: string) => void;
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
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!localStorage.getItem('username'));
  const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false);

  // Função de login
  const login = (username: string) => {
    localStorage.setItem('username', username);
    setIsLoggedIn(true);
    setLoginModalOpen(false);
  };

  // Função de logout
  const logout = () => {
    localStorage.removeItem('username');
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, loginModalOpen, setLoginModalOpen, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
