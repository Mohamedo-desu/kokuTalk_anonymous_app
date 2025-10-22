import { Confession } from '@/types/schema';
import { useFocusEffect } from '@react-navigation/native';
import { useQuery } from 'convex/react';
import { useEffect, useState } from 'react';
import { MMKV } from 'react-native-mmkv';
import { api } from '../../convex/_generated/api';

const storage = new MMKV();
const LAST_VISIT_KEY = 'last_confession_visit';

export const useNewConfessions = () => {
  const [newConfessionsCount, setNewConfessionsCount] = useState(0);
  const [showBanner, setShowBanner] = useState(false);
  const [lastVisit, setLastVisit] = useState<number | null>(null);

  const confessions = useQuery(api.confessions.getConfessions);

  useEffect(() => {
    const lastVisitStr = storage.getString(LAST_VISIT_KEY);
    if (lastVisitStr) {
      setLastVisit(parseInt(lastVisitStr, 10));
    }
  }, []);

  useEffect(() => {
    if (confessions && lastVisit) {
      const newCount = confessions.filter(
        (confession): confession is Confession =>
          confession !== null && confession.createdAt > lastVisit
      ).length;
      setNewConfessionsCount(newCount);
    }
  }, [confessions, lastVisit]);

  useFocusEffect(() => {
    const now = Date.now();
    storage.set(LAST_VISIT_KEY, now.toString());
    setLastVisit(now);
    setNewConfessionsCount(0);
  });

  const showNewConfessionsBanner = () => {
    if (newConfessionsCount > 0) {
      setShowBanner(true);
      setTimeout(() => {
        setShowBanner(false);
      }, 3000);
    }
  };

  return {
    newConfessionsCount,
    showBanner,
    showNewConfessionsBanner,
  };
};
