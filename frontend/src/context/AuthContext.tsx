// frontend/src/context/AuthContext.tsx
'use client';

import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';

// Define la interfaz para la información del usuario
interface UserInfo {
  token: string;
  username: string; // Asume que tu backend devuelve el username
  email: string; // Asume que tu backend devuelve el email
  _id: string; // Asume que tu backend devuelve el _id
  // Agrega cualquier otro campo que tu backend devuelva sobre el usuario
}

// Define la interfaz para el estado del contexto de autenticación
interface AuthContextType {
  user: UserInfo | null;
  loading: boolean;
  login: (userInfo: UserInfo) => void;
  logout: () => void;
}

// Crea el contexto con un valor predeterminado nulo
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Proveedor de autenticación
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true); // Para saber si ya se cargó el estado inicial
  const router = useRouter();

  // Carga la información del usuario desde localStorage al iniciar la aplicación
  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      try {
        const userInfo = JSON.parse(storedUser) as UserInfo;
        setUser(userInfo);
      } catch (e) {
        console.error('Failed to parse user info from localStorage', e);
        localStorage.removeItem('userInfo'); // Limpia datos corruptos
      }
    }
    setLoading(false); // La carga inicial ha terminado
  }, []);

  // Función de login
  const login = (userInfo: UserInfo) => {
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    setUser(userInfo);
  };

  // Función de logout
  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    router.push('/login'); // Redirige al usuario a la página de login después de cerrar sesión
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};