import { useState, useEffect } from 'react';

export type FestivalMode = 'diwali' | 'wedding' | 'normal';

export interface FestivalInfo {
  mode: FestivalMode;
  title: string;
  subtitle: string;
  banner: string;
  accent: string;
  gold: string;
}

// Auto-detect based on current date
export function detectFestival(date = new Date()): FestivalInfo {
  const m = date.getMonth() + 1;
  const d = date.getDate();

  // Diwali window: Oct 10 – Nov 20
  if ((m === 10 && d >= 10) || (m === 11 && d <= 20)) {
    return {
      mode: 'diwali',
      title: 'Diwali Special',
      subtitle: 'Light up your celebrations',
      banner: '✨ Diwali Offer — Up to 20% Off on Gold & Diamond',
      accent: '#C75C2E',
      gold: '#B36B1E',
    };
  }

  // Wedding season: Nov 15 – Feb 28
  if ((m === 11 && d >= 15) || m === 12 || m === 1 || (m === 2 && d <= 28)) {
    return {
      mode: 'wedding',
      title: 'Wedding Season',
      subtitle: 'Bespoke bridal & couple sets',
      banner: '💍 Wedding Season — Exclusive Bridal Collections',
      accent: '#7A3C5C',
      gold: '#8C5C2D',
    };
  }

  return {
    mode: 'normal',
    title: 'Shekhar Raja Jewellers',
    subtitle: '',
    banner: '',
    accent: '#8C5C2D',
    gold: '#8C5C2D',
  };
}

// React hook — auto-updates if date crosses into new season
export function useFestival(): FestivalInfo {
  const [info, setInfo] = useState<FestivalInfo>(() => detectFestival());

  useEffect(() => {
    // Check once per day in case app stays open across midnight
    const id = setInterval(() => setInfo(detectFestival()), 1000 * 60 * 60 * 12);
    return () => clearInterval(id);
  }, []);

  return info;
}
