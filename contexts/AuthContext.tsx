import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isConfigured: boolean;
  isDemo: boolean;
  signInWithGoogle: () => Promise<void>;
  loginDemo: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  
  const isConfigured = !!auth && !!googleProvider;

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!isDemo) {
        setUser(currentUser);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [isDemo]);

  const signInWithGoogle = async () => {
    if (!isConfigured) {
      alert("Configuração Necessária:\n\nPara fazer login real, configure o arquivo .env.");
      return;
    }
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error("Erro no login Google", error);
      alert(`Erro ao fazer login: ${error.message}`);
    }
  };

  const loginDemo = () => {
    setIsDemo(true);
    // Cria um usuário mock compatível com a interface do Firebase User
    const demoUser = {
      uid: 'demo-user-123',
      displayName: 'Usuário Demo',
      email: 'demo@teste.com',
      photoURL: null,
      emailVerified: true,
      isAnonymous: false,
      metadata: {},
      providerData: [],
      refreshToken: '',
      tenantId: null,
      delete: async () => {},
      getIdToken: async () => '',
      getIdTokenResult: async () => ({} as any),
      reload: async () => {},
      toJSON: () => ({})
    } as unknown as User;
    
    setUser(demoUser);
  };

  const logout = async () => {
    if (isDemo) {
      setIsDemo(false);
      setUser(null);
    } else if (auth) {
      await signOut(auth);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isConfigured, isDemo, signInWithGoogle, loginDemo, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
