import * as SecureStore from 'expo-secure-store';
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import type { AuthSession } from '@/src/types';

const STORAGE_KEY = 'quiz-arena-mobile-session';

type SessionContextValue = {
  session: AuthSession | null;
  loading: boolean;
  signIn: (nextSession: AuthSession) => Promise<void>;
  signOut: () => Promise<void>;
};

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export function SessionProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    SecureStore.getItemAsync(STORAGE_KEY)
      .then((value) => {
        if (value) {
          setSession(JSON.parse(value) as AuthSession);
        }
      })
      .catch(() => SecureStore.deleteItemAsync(STORAGE_KEY))
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo<SessionContextValue>(
    () => ({
      session,
      loading,
      signIn: async (nextSession) => {
        await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(nextSession));
        setSession(nextSession);
      },
      signOut: async () => {
        await SecureStore.deleteItemAsync(STORAGE_KEY);
        setSession(null);
      },
    }),
    [loading, session],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error('useSession must be used inside SessionProvider');
  }

  return context;
}
