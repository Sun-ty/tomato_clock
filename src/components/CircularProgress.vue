<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
}>(), {
  progress: 0,
  size: 280,
  strokeWidth: 12,
  color: 'currentColor',
  trackColor: '#E5E7EB',
});

const diameter = computed(() => Number(props.size) || 280);
const stroke = computed(() => Number(props.strokeWidth) || 12);
const radius = computed(() => (diameter.value - stroke.value) / 2);
const circumference = computed(() => 2 * Math.PI * radius.value);
const offset = computed(() => {
  const p = Math.max(0, Math.min(1, Number(props.progress) || 0));
  return circumference.value * (1 - p);
});
</script>

<template>
  <div class="relative inline-flex items-center justify-center">
    <svg
      :width="diameter"
      :height="diameter"
      :viewBox="`0 0 ${diameter} ${diameter}`"
      class="transform -rotate-90"
    >
      <circle
        :cx="diameter / 2"
        :cy="diameter / 2"
        :r="radius"
        fill="none"
        :stroke="trackColor || '#E5E7EB'"
        :stroke-width="stroke"
      />
      <circle
        :cx="diameter / 2"
        :cy="diameter / 2"
        :r="radius"
        fill="none"
        :stroke="color || 'currentColor'"
        :stroke-width="stroke"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="offset"
        :stroke-linecap="'round'"
        class="transition-all duration-1000 ease-linear"
        :style="{ filter: 'drop-shadow(0 0 8px rgba(124, 58, 237, 0.3))' }"
      />
    </svg>
    <div class="absolute inset-0 flex items-center justify-center">
      <slot />
    </div>
  </div>
</template>
