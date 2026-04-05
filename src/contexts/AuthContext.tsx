import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from "firebase/auth";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAdmin = async (userEmail: string | undefined) => {
    if (!userEmail) { setIsAdmin(false); return; }
    const { data } = await supabase
      .from("admin_emails")
      .select("id")
      .eq("email", userEmail)
      .maybeSingle();
    setIsAdmin(!!data);
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        if (session?.user) {
          setTimeout(() => checkAdmin(session.user.email), 0);
        } else {
          setIsAdmin(false);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) {
        checkAdmin(session.user.email);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    if (!isFirebaseConfigured()) {
      toast({
        title: "Sign-in unavailable",
        description: "Firebase is not configured. Add VITE_FIREBASE_* keys to your environment.",
        variant: "destructive",
      });
      return;
    }

    const auth = getFirebaseAuth();
    if (!auth) {
      toast({ title: "Sign-in failed", description: "Could not start Firebase Auth.", variant: "destructive" });
      return;
    }

    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    provider.addScope("email");
    provider.addScope("profile");

    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const idToken = credential?.idToken;
      if (!idToken) {
        await firebaseSignOut(auth);
        toast({ title: "Sign-in failed", description: "No Google ID token returned.", variant: "destructive" });
        return;
      }

      const { error } = await supabase.auth.signInWithIdToken({
        provider: "google",
        token: idToken,
      });

      await firebaseSignOut(auth);

      if (error) {
        toast({
          title: "Sign-in failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
    } catch (e) {
      const authInstance = getFirebaseAuth();
      if (authInstance) await firebaseSignOut(authInstance).catch(() => {});
      const message = e instanceof Error ? e.message : "Sign-in was cancelled or blocked.";
      if (!message.includes("auth/popup-closed-by-user") && !message.includes("auth/cancelled-popup-request")) {
        toast({ title: "Sign-in failed", description: message, variant: "destructive" });
      }
    }
  };

  const logout = async () => {
    const auth = getFirebaseAuth();
    if (auth) await firebaseSignOut(auth).catch(() => {});
    await supabase.auth.signOut();
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, isAdmin, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
