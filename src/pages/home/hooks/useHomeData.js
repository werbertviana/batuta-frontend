// src/screens/home/hooks/useHomeData.js

import { useEffect, useState } from 'react';

import { getLessonsWithModules } from '../../../services/batutaApi';
import { getLifeGlobal, setLifeGlobal } from '../../../store/lifeStore';

export default function useHomeData(currentUser) {
  const [feeds, setFeeds] = useState([]);
  const [isLoadingFeeds, setIsLoadingFeeds] = useState(true);

  const [progressLevel, setProgressLevel] = useState(1);
  const [life, setLife] = useState(getLifeGlobal());
  const [batutaPoints, setBatutaPoints] = useState(0);
  const [xpPoints, setXpPoints] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const loadFeeds = async () => {
      try {
        setIsLoadingFeeds(true);

        const apiFeeds = await getLessonsWithModules();

        if (isMounted) {
          setFeeds(apiFeeds);
        }
      } catch (error) {
        console.log('[HOME] Erro ao carregar feeds da API:', error);

        if (isMounted) {
          setFeeds([]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingFeeds(false);
        }
      }
    };

    loadFeeds();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!currentUser?.gameStats) return;

    const backendLife = Math.max(
      0,
      Number(currentUser.gameStats.lifePoints ?? 3),
    );

    const backendXp = Math.max(
      0,
      Number(currentUser.gameStats.xpPoints ?? 0),
    );

    const backendBatutas = Math.max(
      0,
      Number(currentUser.gameStats.batutaPoints ?? 0),
    );

    const backendProgressLevel = Math.max(
      1,
      Number(currentUser.gameStats.progressLevel ?? 1),
    );

    setLifeGlobal(backendLife);
    setLife(backendLife);
    setXpPoints(backendXp);
    setBatutaPoints(backendBatutas);
    setProgressLevel(backendProgressLevel);
  }, [currentUser?.id, currentUser?.gameStats]);

  return {
    feeds,
    setFeeds,
    isLoadingFeeds,

    progressLevel,
    setProgressLevel,

    life,
    setLife,

    batutaPoints,
    setBatutaPoints,

    xpPoints,
    setXpPoints,
  };
}