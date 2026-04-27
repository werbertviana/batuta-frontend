import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from 'react';
import { Platform } from 'react-native';

const AuthContext = createContext(null);

async function safeParseJson(response) {
  try {
    return await response.json();
  } catch (_e) {
    return null;
  }
}

function buildActivityPayload({ atividade, acertos, erros, puladas, totalQuestoes }) {
  return {
    atividade,
    acertos,
    erros,
    totalQuestoes,
    ...(puladas !== undefined ? { puladas } : {}),
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const API_BASE =
    Platform.OS === 'android'
      ? 'http://10.0.2.2:3000/api'
      : 'http://localhost:3000/api';

  const login = useCallback((userData) => {
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const updateGameStats = useCallback(
    async (partialGameStats) => {
      if (!user?.id) {
        console.log('[AUTH] updateGameStats: sem user logado');
        return { ok: false, reason: 'NO_USER' };
      }

      try {
        setIsSyncing(true);

        const currentStats = user?.gameStats || {};
        const nextStats = {
          ...currentStats,
          ...partialGameStats,
        };

        const response = await fetch(`${API_BASE}/users/${user.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            gameStats: nextStats,
          }),
        });

        const data = await safeParseJson(response);

        if (!response.ok) {
          console.log('[AUTH] updateGameStats ERRO:', data);
          return { ok: false, status: response.status, data };
        }

        const updatedUser = data?.id ? data : { ...user, gameStats: nextStats };

        setUser(updatedUser);

        console.log('[AUTH] updateGameStats OK:', updatedUser?.gameStats);
        return { ok: true, user: updatedUser };
      } catch (err) {
        console.log('[AUTH] updateGameStats EXCEPTION:', err);
        return { ok: false, error: String(err) };
      } finally {
        setIsSyncing(false);
      }
    },
    [API_BASE, user]
  );

  const previewActivity = useCallback(
    async ({ atividade, acertos, erros, puladas, totalQuestoes }) => {
      if (!user?.id) {
        console.log('[AUTH] previewActivity: sem user logado');
        return { ok: false, reason: 'NO_USER' };
      }

      try {
        setIsSyncing(true);

        const response = await fetch(
          `${API_BASE}/users/${user.id}/preview-activity`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(
              buildActivityPayload({
                atividade,
                acertos,
                erros,
                puladas,
                totalQuestoes,
              })
            ),
          }
        );

        const data = await safeParseJson(response);

        if (!response.ok) {
          console.log('[AUTH] previewActivity ERRO:', data);
          return { ok: false, status: response.status, data };
        }

        const reward = data?.reward ?? null;

        console.log('[AUTH] previewActivity OK:', {
          reward,
        });

        return {
          ok: true,
          reward,
          data,
        };
      } catch (err) {
        console.log('[AUTH] previewActivity EXCEPTION:', err);
        return { ok: false, error: String(err) };
      } finally {
        setIsSyncing(false);
      }
    },
    [API_BASE, user?.id]
  );

  const completeActivity = useCallback(
    async ({ atividade, acertos, erros, puladas, totalQuestoes }) => {
      if (!user?.id) {
        console.log('[AUTH] completeActivity: sem user logado');
        return { ok: false, reason: 'NO_USER' };
      }

      try {
        setIsSyncing(true);

        const response = await fetch(
          `${API_BASE}/users/${user.id}/complete-activity`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(
              buildActivityPayload({
                atividade,
                acertos,
                erros,
                puladas,
                totalQuestoes,
              })
            ),
          }
        );

        const data = await safeParseJson(response);

        if (!response.ok) {
          console.log('[AUTH] completeActivity ERRO:', data);
          return { ok: false, status: response.status, data };
        }

        const updatedUser = data?.user ?? null;
        const reward = data?.reward ?? null;

        if (updatedUser) {
          setUser(updatedUser);
        }

        console.log('[AUTH] completeActivity OK:', {
          user: updatedUser,
          reward,
        });

        return {
          ok: true,
          user: updatedUser,
          reward,
          data,
        };
      } catch (err) {
        console.log('[AUTH] completeActivity EXCEPTION:', err);
        return { ok: false, error: String(err) };
      } finally {
        setIsSyncing(false);
      }
    },
    [API_BASE, user?.id]
  );

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isSyncing,
      login,
      logout,
      updateGameStats,
      previewActivity,
      completeActivity,
    }),
    [
      user,
      isSyncing,
      login,
      logout,
      updateGameStats,
      previewActivity,
      completeActivity,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}