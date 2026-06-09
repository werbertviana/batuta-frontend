import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from 'react';
import { Platform } from 'react-native';
import { GoogleSignin } from '../services/googleAuth';

const AuthContext = createContext(null);

const DEFAULT_TUTORIALS_SEEN = {
  intro: false,
  content: false,
  activity: false,
  rewards: false,
  profile: false,
  elos: false,
};

const DEFAULT_STREAK = {
  currentStreak: 0,
  bestStreak: 0,
  lastPracticeAt: null,
};

async function safeParseJson(response) {
  try {
    return await response.json();
  } catch (_e) {
    return null;
  }
}

function normalizeTutorialsSeen(tutorialsSeen) {
  return {
    ...DEFAULT_TUTORIALS_SEEN,
    ...(tutorialsSeen || {}),
  };
}

function normalizeStreak(streak) {
  return {
    ...DEFAULT_STREAK,
    ...(streak || {}),
  };
}

function normalizeUser(userData) {
  if (!userData) return null;

  return {
    ...userData,
    tutorialsSeen: normalizeTutorialsSeen(userData.tutorialsSeen),
    streak: normalizeStreak(userData.streak),
  };
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

  if (data.user) return normalizeUser(data.user);
  if (data.updatedUser) return normalizeUser(data.updatedUser);
  if (data.data?.user) return normalizeUser(data.data.user);
  if (data.data?.updatedUser) return normalizeUser(data.data.updatedUser);

  if (data.id || data.email || data.elo || data.gameStats || data.tutorialsSeen) {
    return normalizeUser(data);
  }

  return null;
}

function extractStreakFromResponse(data) {
  return data?.streak || data?.data?.streak || null;
}

function extractUserPatchFromResponse(data) {
  if (!data) return null;

  const patch = {};
  const reward = data?.reward ?? data?.data?.reward ?? null;
  const user = extractUserFromResponse(data);
  const streak = extractStreakFromResponse(data);

  if (user) return user;

  if (data.elo) patch.elo = data.elo;
  if (data.xp !== undefined) patch.xp = data.xp;
  if (data.batutas !== undefined) patch.batutas = data.batutas;
  if (data.life !== undefined) patch.life = data.life;
  if (data.lifePoints !== undefined) patch.lifePoints = data.lifePoints;
  if (data.gameStats) patch.gameStats = data.gameStats;

  if (streak) {
    patch.streak = normalizeStreak(streak);
  }

  if (data.tutorialsSeen) {
    patch.tutorialsSeen = normalizeTutorialsSeen(data.tutorialsSeen);
  }

  if (reward?.newElo) patch.elo = reward.newElo;
  if (reward?.elo) patch.elo = reward.elo;
  if (reward?.xp !== undefined) patch.xp = reward.xp;
  if (reward?.totalXp !== undefined) patch.xp = reward.totalXp;
  if (reward?.batutas !== undefined) patch.batutas = reward.batutas;
  if (reward?.totalBatutas !== undefined) patch.batutas = reward.totalBatutas;

  return Object.keys(patch).length > 0 ? patch : null;
}

function getBackendErrorMessage(
  data,
  fallback = 'Erro ao fazer login com Google.',
) {
  const backendMessage =
    data?.error?.message ||
    data?.message ||
    data?.error ||
    fallback;

  const backendCode =
    data?.error?.code ||
    data?.code;

  return backendCode ? `${backendMessage} (${backendCode})` : backendMessage;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const API_BASE =
    Platform.OS === 'android'
      ? 'http://10.0.2.2:3000/api'
      : 'http://localhost:3000/api';

  const login = useCallback(userData => {
    setUser(normalizeUser(userData));
  }, []);

  const loginWithGoogle = useCallback(async () => {
    try {
      setIsSyncing(true);

      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      try {
        await GoogleSignin.signOut();
      } catch (_err) {}

      const googleUser = await GoogleSignin.signIn();

      const idToken =
        googleUser?.data?.idToken ||
        googleUser?.idToken ||
        googleUser?.serverAuthCode;

      if (!idToken) {
        return {
          ok: false,
          reason: 'NO_GOOGLE_ID_TOKEN',
          message: 'Não foi possível obter o token do Google.',
          data: googleUser,
        };
      }

      const response = await fetch(`${API_BASE}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      const data = await safeParseJson(response);

      if (!response.ok) {
        return {
          ok: false,
          status: response.status,
          data,
          message: getBackendErrorMessage(data),
        };
      }

      const loggedUser = extractUserFromResponse(data);

      if (!loggedUser) {
        return {
          ok: false,
          reason: 'NO_USER_IN_RESPONSE',
          data,
          message:
            'Login realizado, mas os dados do usuário não foram retornados.',
        };
      }

      setUser(loggedUser);

      return {
        ok: true,
        user: loggedUser,
        data,
      };
    } catch (err) {
      return {
        ok: false,
        error: String(err),
        message: String(err),
      };
    } finally {
      setIsSyncing(false);
    }
  }, [API_BASE]);

  const logout = useCallback(async () => {
    try {
      await GoogleSignin.signOut();
    } catch (_err) {}

    setUser(null);
  }, []);

  const updateUser = useCallback(userData => {
    setUser(currentUser =>
      normalizeUser({
        ...(currentUser || {}),
        ...(userData || {}),
        ...(userData?.streak
          ? { streak: normalizeStreak(userData.streak) }
          : {}),
      }),
    );
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
      nextUser = normalizeUser({
        ...(currentUser || {}),
        ...nextPatch,
        streak: normalizeStreak({
          ...(currentUser?.streak || {}),
          ...(nextPatch?.streak || {}),
        }),
      });

      return nextUser;
    });

    return nextUser;
  }, []);

  const refreshUser = useCallback(async () => {
    if (!user?.id) {
      return { ok: false, reason: 'NO_USER' };
    }

    try {
      const response = await fetch(`${API_BASE}/users/${user.id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await safeParseJson(response);

      if (!response.ok) {
        return { ok: false, status: response.status, data };
      }

      const updatedUser = mergeUserFromResponse(data);

      return {
        ok: true,
        user: updatedUser,
        data,
      };
    } catch (err) {
      return { ok: false, error: String(err) };
    }
  }, [API_BASE, user?.id, mergeUserFromResponse]);

  const hasSeenTutorial = useCallback(
    tutorialKey => {
      if (!tutorialKey) return false;

      return Boolean(
        normalizeTutorialsSeen(user?.tutorialsSeen)?.[tutorialKey],
      );
    },
    [user?.tutorialsSeen],
  );

  const markTutorialAsSeen = useCallback(
    async tutorialKey => {
      if (!user?.id) {
        return { ok: false, reason: 'NO_USER' };
      }

      if (!tutorialKey) {
        return { ok: false, reason: 'NO_TUTORIAL_KEY' };
      }

      try {
        setIsSyncing(true);

        const response = await fetch(
          `${API_BASE}/users/${user.id}/tutorials/${tutorialKey}`,
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
          },
        );

        const data = await safeParseJson(response);

        if (!response.ok) {
          return { ok: false, status: response.status, data };
        }

        const nextTutorialsSeen = {
          ...normalizeTutorialsSeen(user.tutorialsSeen),
          [tutorialKey]: true,
        };

        const updatedUser = mergeUserFromResponse(data, {
          tutorialsSeen: nextTutorialsSeen,
        });

        return {
          ok: true,
          user: updatedUser,
          data,
        };
      } catch (err) {
        return { ok: false, error: String(err) };
      } finally {
        setIsSyncing(false);
      }
    },
    [API_BASE, user?.id, user?.tutorialsSeen, mergeUserFromResponse],
  );

  const updateGameStats = useCallback(
    async partialGameStats => {
      if (!user?.id) {
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
          return { ok: false, status: response.status, data };
        }

        const updatedUser =
          mergeUserFromResponse(data, { gameStats: nextStats }) || {
            ...user,
            gameStats: nextStats,
          };

        return { ok: true, user: updatedUser, data };
      } catch (err) {
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
          return { ok: false, status: response.status, data };
        }

        const reward = data?.reward ?? data?.data?.reward ?? null;

        return {
          ok: true,
          reward,
          data,
        };
      } catch (err) {
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
          return { ok: false, status: response.status, data };
        }

        const reward = data?.reward ?? data?.data?.reward ?? null;
        const streak = extractStreakFromResponse(data);
        const updatedUser = mergeUserFromResponse(data, {
          ...(streak ? { streak: normalizeStreak(streak) } : {}),
        });

        return {
          ok: true,
          user: updatedUser,
          reward,
          streak: updatedUser?.streak || normalizeStreak(streak),
          data,
        };
      } catch (err) {
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
      loginWithGoogle,
      logout,
      setUser,
      updateUser,
      refreshUser,
      hasSeenTutorial,
      markTutorialAsSeen,
      updateGameStats,
      previewActivity,
      completeActivity,
    }),
    [
      user,
      isSyncing,
      login,
      loginWithGoogle,
      logout,
      updateUser,
      refreshUser,
      hasSeenTutorial,
      markTutorialAsSeen,
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