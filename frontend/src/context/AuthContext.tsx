import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

type AuthContextValue = {
    session: Session | null;
    user: User | null;
    loading: boolean;
    signInWithEmail: (email: string, password: string) => Promise<void>;
    signInWithGoogle: (idToken: string, accessToke: string) => Promise<void>;
    signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const init = async () => {
            const {
                data: { session },
                error,
            } = await supabase.auth.getSession();

            if (!isMounted) return;

            if (error) {
                console.warn("getSession error", error.message);
            }

            setSession(session ?? null);
            setUser(session?.user ?? null);
            setLoading(false);
        };

        init();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!isMounted) return;
            setSession(session ?? null);
            setUser(session?.user ?? null);
        });

        return () => {
            isMounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const signInWithEmail = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) {
            console.warn("signIn error", error.message);
            throw error;
        }
    };

    const signInWithGoogle = async (idToken: string, _accessToken: string) => {
        const { error } = await supabase.auth.signInWithIdToken({
          provider: "google",
          token: idToken,
        });
        if (error) {
            console.warn("Google signIn error", error.message);
            throw error;
        }
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.warn("signOut error", error.message);
            throw error;
        }
    };

    return (
        <AuthContext.Provider
            value={{ session, user, loading, signInWithEmail, signInWithGoogle, signOut }
            }
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used inside an AuthProvider");
    }
    return ctx;
}
