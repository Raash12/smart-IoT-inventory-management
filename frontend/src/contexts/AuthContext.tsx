
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signup: (email: string, password: string, username: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  userData: UserData | null;
}

interface UserData {
  username: string;
  email: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  async function signup(email: string, password: string, username: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Store additional user info in Firestore
      await setDoc(doc(db, 'accounts', userCredential.user.uid), {
        username,
        email
      });
      toast({
        title: "Account created",
        description: "Your account has been successfully created",
      });
    } catch (error: any) {
      toast({
        title: "Error creating account",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  }

  async function login(email: string, password: string) {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  }

  async function logout() {
    try {
      await signOut(auth);
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error logging out",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          const docRef = doc(db, 'accounts', user.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setUserData(docSnap.data() as UserData);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userData,
    loading,
    signup,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
