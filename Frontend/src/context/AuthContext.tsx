import {
  createContext,
  type PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from 'react';

import type { AuthSession } from '../types';

const AUTH_STORAGE_KEY = 'quiz-arena-auth';
export const DEMO_TOKEN = 'demo-local-session';

function readStoredSession(): AuthSession | null {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

type AuthContextValue = {
  session: AuthSession | null;
  isDemo: boolean;
  setAuthSession: (session: AuthSession) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<AuthSession | null>(() => readStoredSession());

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      isDemo: session?.token === DEMO_TOKEN,
      setAuthSession: (nextSession) => {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextSession));
        setSession(nextSession);
      },
      logout: () => {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        setSession(null);
      },
    }),
    [session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
