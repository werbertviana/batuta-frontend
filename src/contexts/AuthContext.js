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

function buildActivityPayload({
  atividade,
  acertos,
  erros,
  puladas,
  totalQuestoes,
}) {
  return {
    atividade,
    acertos,
    erros,
    totalQuestoes,
    ...(puladas !== undefined ? { puladas } : {}),
  };
}

function extractUserFromResponse(data) {
  if (!data) return null;

  if (data.user) return data.user;
  if (data.updatedUser) return data.updatedUser;
  if (data.data?.user) return data.data.user;
  if (data.data?.updatedUser) return data.data.updatedUser;

  if (data.id || data.email || data.elo || data.gameStats) return data;

  return null;
}

function extractUserPatchFromResponse(data) {
  if (!data) return null;

  const patch = {};

  const reward = data?.reward ?? data?.data?.reward ?? null;
  const user = extractUserFromResponse(data);

  if (user) {
    return user;
  }

  if (data.elo) patch.elo = data.elo;
  if (data.xp !== undefined) patch.xp = data.xp;
  if (data.batutas !== undefined) patch.batutas = data.batutas;
  if (data.life !== undefined) patch.life = data.life;
  if (data.lifePoints !== undefined) patch.lifePoints = data.lifePoints;
  if (data.gameStats) patch.gameStats = data.gameStats;

  if (reward?.newElo) patch.elo = reward.newElo;
  if (reward?.elo) patch.elo = reward.elo;
  if (reward?.xp !== undefined) patch.xp = reward.xp;
  if (reward?.totalXp !== undefined) patch.xp = reward.totalXp;
  if (reward?.batutas !== undefined) patch.batutas = reward.batutas;
  if (reward?.totalBatutas !== undefined) patch.batutas = reward.totalBatutas;

  return Object.keys(patch).length > 0 ? patch : null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const API_BASE =
    Platform.OS === 'android'
      ? 'http://10.0.2.2:3000/api'
      : 'http://localhost:3000/api';

  const login = useCallback(userData => {
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const updateUser = useCallback(userData => {
    setUser(currentUser => ({
      ...(currentUser || {}),
      ...(userData || {}),
    }));
  }, []);

  const mergeUserFromResponse = useCallback((data, fallbackPatch = {}) => {
    const patchFromResponse = extractUserPatchFromResponse(data);

    const nextPatch = {
      ...(fallbackPatch || {}),
      ...(patchFromResponse || {}),
    };

    if (Object.keys(nextPatch).length === 0) {
      return null;
    }

    let nextUser = null;

    setUser(currentUser => {
      nextUser = {
        ...(currentUser || {}),
        ...nextPatch,
      };

      return nextUser;
    });

    return nextUser;
  }, []);

  const refreshUser = useCallback(async () => {
    if (!user?.id) {
      console.log('[AUTH] refreshUser: sem user logado');
      return { ok: false, reason: 'NO_USER' };
    }

    try {
      const response = await fetch(`${API_BASE}/users/${user.id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await safeParseJson(response);

      if (!response.ok) {
        console.log('[AUTH] refreshUser ERRO:', data);
        return { ok: false, status: response.status, data };
      }

      const updatedUser = mergeUserFromResponse(data);

      console.log('[AUTH] refreshUser OK:', updatedUser);

      return {
        ok: true,
        user: updatedUser,
        data,
      };
    } catch (err) {
      console.log('[AUTH] refreshUser EXCEPTION:', err);
      return { ok: false, error: String(err) };
    }
  }, [API_BASE, user?.id, mergeUserFromResponse]);

  const updateGameStats = useCallback(
    async partialGameStats => {
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

        const updatedUser =
          mergeUserFromResponse(data, { gameStats: nextStats }) || {
            ...user,
            gameStats: nextStats,
          };

        console.log('[AUTH] updateGameStats OK:', updatedUser?.gameStats);

        return { ok: true, user: updatedUser, data };
      } catch (err) {
        console.log('[AUTH] updateGameStats EXCEPTION:', err);
        return { ok: false, error: String(err) };
      } finally {
        setIsSyncing(false);
      }
    },
    [API_BASE, user, mergeUserFromResponse],
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
              }),
            ),
          },
        );

        const data = await safeParseJson(response);

        if (!response.ok) {
          console.log('[AUTH] previewActivity ERRO:', data);
          return { ok: false, status: response.status, data };
        }

        const reward = data?.reward ?? data?.data?.reward ?? null;

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
    [API_BASE, user?.id],
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
              }),
            ),
          },
        );

        const data = await safeParseJson(response);

        if (!response.ok) {
          console.log('[AUTH] completeActivity ERRO:', data);
          return { ok: false, status: response.status, data };
        }

        const reward = data?.reward ?? data?.data?.reward ?? null;
        const updatedUser = mergeUserFromResponse(data);

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
    [API_BASE, user?.id, mergeUserFromResponse],
  );

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isSyncing,
      login,
      logout,
      setUser,
      updateUser,
      refreshUser,
      updateGameStats,
      previewActivity,
      completeActivity,
    }),
    [
      user,
      isSyncing,
      login,
      logout,
      updateUser,
      refreshUser,
      updateGameStats,
      previewActivity,
      completeActivity,
    ],
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