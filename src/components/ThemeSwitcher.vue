<script setup lang="ts">
import { computed } from 'vue';
import { useTheme } from '@/composables/useTheme';

const { themes, currentThemeId, switchTheme } = useTheme();

const selectedThemeId = computed(() => currentThemeId.value);

function selectTheme(themeId: string) {
  switchTheme(themeId);
}
</script>

<template>
  <div class="grid grid-cols-5 gap-3">
    <button
      v-for="theme in themes"
      :key="theme.id"
      class="relative group flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200 border-2"
      :class="
        selectedThemeId === theme.id
          ? 'border-primary-500 bg-primary-50'
          : 'border-transparent hover:border-gray-200 hover:bg-gray-50'
      "
      @click="selectTheme(theme.id)"
    >
      <div
        class="w-12 h-12 rounded-xl shadow-inner transition-transform duration-200 group-hover:scale-105"
        :style="{
          background: `linear-gradient(135deg, ${theme.colors.primary400} 0%, ${theme.colors.primary600} 100%)`,
        }"
      />
      <span
        class="text-xs font-medium transition-colors"
        :class="
          selectedThemeId === theme.id ? 'text-primary-700' : 'text-text-secondary'
        "
      >
        {{ theme.name }}
      </span>
      <div
        v-if="selectedThemeId === theme.id"
        class="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center"
      >
        <svg class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
    </button>
  </div>
</template>
