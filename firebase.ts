import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

// Configuração lendo do arquivo .env com verificação de segurança (optional chaining)
// Isso previne o erro "Cannot read properties of undefined (reading 'VITE_FIREBASE_API_KEY')"
const firebaseConfig = {
  apiKey: import.meta.env?.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env?.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env?.VITE_FIREBASE_APP_ID
};

// Inicialização segura
let app;
let auth: any = null;
let googleProvider: any = null;
let db: any = null;

const isValidApiKey = (key: string | undefined) => {
  // Chaves de API do Google Firebase geralmente começam com "AIza"
  return key && typeof key === 'string' && key.startsWith('AIza') && key !== "SUA_CHAVE_REAL_AQUI";
};

try {
  // Verifica se a chave parece válida antes de inicializar para evitar erros no console
  // Usa firebaseConfig.apiKey que agora é seguro (pode ser undefined)
  if (isValidApiKey(firebaseConfig.apiKey)) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    db = getFirestore(app);
  } else {
    console.log("Firebase: Modo offline (API Key não configurada ou inválida). Configure o .env para ativar o login.");
  }
} catch (error) {
  console.error("Erro ao inicializar Firebase:", error);
}

export { auth, googleProvider, db };

// Tipos para os dados salvos
export interface UserData {
  transactions: any[];
  categories: any;
  months: any[];
  lastUpdated: string;
}

// Serviço para salvar dados
export const saveUserData = async (uid: string, data: Omit<UserData, 'lastUpdated'>) => {
  if (!db) return;
  try {
    await setDoc(doc(db, "users", uid), {
      ...data,
      lastUpdated: new Date().toISOString()
    });
    console.log("Dados salvos na nuvem!");
  } catch (e) {
    console.error("Erro ao salvar dados: ", e);
  }
};

// Serviço para carregar dados
export const loadUserData = async (uid: string): Promise<UserData | null> => {
  if (!db) return null;
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as UserData;
    } else {
      console.log("Nenhum dado encontrado para este usuário!");
      return null;
    }
  } catch (e) {
    console.error("Erro ao carregar dados: ", e);
    return null;
  }
};
