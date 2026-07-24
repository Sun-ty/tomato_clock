import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import type { Settings, ThemeConfig } from '@/types';
import * as storage from '@/utils/storage';
import { THEME_LIST } from '@/utils/constants';

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref<Settings>(storage.getSettings());

  const currentTheme = ref<ThemeConfig>(
    THEME_LIST.find((t) => t.id === settings.value.theme) || THEME_LIST[0]
  );

  function applyTheme(themeId: string) {
    const theme = THEME_LIST.find((t) => t.id === themeId);
    if (theme) {
      currentTheme.value = theme;
      const root = document.documentElement;
      const colors = theme.colors;
      
      root.style.setProperty('--color-primary-50', colors.primary50);
      root.style.setProperty('--color-primary-100', colors.primary100);
      root.style.setProperty('--color-primary-200', colors.primary200);
      root.style.setProperty('--color-primary-300', colors.primary300);
      root.style.setProperty('--color-primary-400', colors.primary400);
      root.style.setProperty('--color-primary-500', colors.primary500);
      root.style.setProperty('--color-primary-600', colors.primary600);
      root.style.setProperty('--color-primary-700', colors.primary700);
      root.style.setProperty('--color-primary-800', colors.primary800);
      root.style.setProperty('--color-primary-900', colors.primary900);
      root.style.setProperty('--color-secondary-500', colors.secondary500);
      root.style.setProperty('--color-secondary-600', colors.secondary600);
      root.style.setProperty('--color-surface-50', colors.surface50);
      root.style.setProperty('--color-surface-100', colors.surface100);
      root.style.setProperty('--color-surface-200', colors.surface200);
      root.style.setProperty('--color-text-primary', colors.textPrimary);
      root.style.setProperty('--color-text-secondary', colors.textSecondary);
      root.style.setProperty('--color-text-tertiary', colors.textTertiary);
    }
  }

  // Apply theme on store initialization
  applyTheme(settings.value.theme);

  function loadSettings() {
    settings.value = storage.getSettings();
    applyTheme(settings.value.theme);
  }

  function updateSettings(updates: Partial<Settings>) {
    settings.value = { ...settings.value, ...updates };
    storage.saveSettings(settings.value);
  }

  function setPomodoroDuration(minutes: number) {
    updateSettings({ pomodoroDuration: minutes });
  }

  function setLongBreakDuration(minutes: number) {
    updateSettings({ longBreakDuration: minutes });
  }

  function setPomodorosBeforeBreak(count: number) {
    updateSettings({ pomodorosBeforeLongBreak: count });
  }

  function setTheme(themeId: string) {
    updateSettings({ theme: themeId });
    applyTheme(themeId);
  }

  return {
    settings,
    currentTheme,
    loadSettings,
    updateSettings,
    setPomodoroDuration,
    setLongBreakDuration,
    setPomodorosBeforeBreak,
    setTheme,
    applyTheme,
  };
});
