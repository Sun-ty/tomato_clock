import type { Task, Settings, DailyStats, TimerState } from '@/types';
import { STORAGE_KEYS } from './constants';
import { DEFAULT_SETTINGS, DEFAULT_TIMER_STATE } from '@/types';

export function getTasks(): Task[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TASKS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveTasks(tasks: Task[]): void {
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
}

export function getSettings(): Settings {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: Settings): void {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

export function getStats(date: string): DailyStats | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.STATS);
    if (!data) return null;
    const statsMap: Record<string, DailyStats> = JSON.parse(data);
    return statsMap[date] || null;
  } catch {
    return null;
  }
}

export function getAllStats(): Record<string, DailyStats> {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.STATS);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

export function saveStats(stats: DailyStats): void {
  const allStats = getAllStats();
  allStats[stats.date] = stats;
  localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(allStats));
}

export function getTimerState(): TimerState {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TIMER_STATE);
    return data ? { ...DEFAULT_TIMER_STATE, ...JSON.parse(data) } : DEFAULT_TIMER_STATE;
  } catch {
    return DEFAULT_TIMER_STATE;
  }
}

export function saveTimerState(state: TimerState): void {
  localStorage.setItem(STORAGE_KEYS.TIMER_STATE, JSON.stringify(state));
}

export function clearTimerState(): void {
  localStorage.removeItem(STORAGE_KEYS.TIMER_STATE);
}

export function clearAll(): void {
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
}
