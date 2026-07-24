<script setup lang="ts">
import { Smartphone } from 'lucide-vue-next';
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
  >
    <div class="text-center text-white animate-fade-in">
      <div class="mb-6">
        <Smartphone class="mx-auto w-24 h-24 animate-pulse" :style="{ transform: 'rotate(90deg)' }" />
      </div>
      <h2 class="text-2xl font-bold mb-4">请旋转设备</h2>
      <p class="text-lg text-white/70 mb-2">为了获得更好的使用体验</p>
      <p class="text-base text-white/50">建议在横屏模式下使用本应用</p>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'OrientationWarning',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
