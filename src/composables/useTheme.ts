import { ref, computed, watch, onMounted } from 'vue';
import { useSettingsStore } from '@/stores/settings';
import { THEME_LIST } from '@/utils/constants';

export function useTheme() {
  const settingsStore = useSettingsStore();
  const isDark = ref(false);

  const currentThemeId = computed(() => settingsStore.settings.theme);
  const currentTheme = computed(() => settingsStore.currentTheme);

  const themeColors = computed(() => currentTheme.value.colors);

  function initTheme() {
    settingsStore.loadSettings();
  }

  function switchTheme(themeId: string) {
    settingsStore.setTheme(themeId);
  }

  function toggleDarkMode() {
    isDark.value = !isDark.value;
    if (isDark.value) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  onMounted(() => {
    initTheme();
  });

  return {
    themes: THEME_LIST,
    currentThemeId,
    currentTheme,
    themeColors,
    isDark,
    switchTheme,
    toggleDarkMode,
    initTheme,
  };
}
