<script setup lang="ts">
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-vue-next';

const props = defineProps<{
  isRunning: boolean;
  isPaused: boolean;
  isIdle: boolean;
  disabled?: boolean;
  skipDisabled?: boolean;
  pauseDisabled?: boolean;
}>();

const emit = defineEmits<{
  (e: 'start'): void;
  (e: 'pause'): void;
  (e: 'resume'): void;
  (e: 'reset'): void;
  (e: 'skip'): void;
}>();

function handleMainClick() {
  if (props.isIdle) {
    emit('start');
  } else if (props.isRunning) {
    if (props.pauseDisabled) return;
    emit('pause');
  } else if (props.isPaused) {
    emit('resume');
  }
}

function handleSkipClick() {
  if (props.skipDisabled) return;
  emit('skip');
}

function handleResetClick() {
  emit('reset');
}

function getMainButtonLabel() {
  if (props.isIdle) return '开始';
  if (props.isRunning) return props.pauseDisabled ? '休息中' : '暂停';
  if (props.isPaused) return '继续';
  return '开始';
}
</script>

<template>
  <div class="flex items-center justify-center gap-4">
    <button
      class="w-12 h-12 rounded-full bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 active:scale-95 transition-all duration-200 flex items-center justify-center text-gray-500 hover:text-gray-700 shadow-sm"
      title="重置"
      @click="handleResetClick"
    >
      <RotateCcw class="w-5 h-5" />
    </button>

    <button
      class="group relative px-10 py-4 rounded-full text-white font-medium transition-all duration-200 shadow-lg"
      :class="[
        'bg-primary-500 hover:bg-primary-600 hover:shadow-xl hover:shadow-primary-500/30',
        props.disabled || (props.isRunning && props.pauseDisabled)
          ? 'opacity-50 cursor-not-allowed'
          : 'cursor-pointer active:scale-95',
      ]"
      :disabled="props.disabled || (props.isRunning && props.pauseDisabled)"
      @click="handleMainClick"
    >
      <span class="flex items-center gap-2">
        <Play v-if="props.isIdle || props.isPaused" class="w-5 h-5" fill="currentColor" />
        <Pause v-else class="w-5 h-5" fill="currentColor" />
        {{ getMainButtonLabel() }}
      </span>
    </button>

    <button
      class="w-12 h-12 rounded-full bg-white border active:scale-95 transition-all duration-200 flex items-center justify-center shadow-sm"
      :class="[
        props.skipDisabled
          ? 'border-gray-200 text-gray-300 cursor-not-allowed opacity-60'
          : 'border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50 hover:border-gray-300',
      ]"
      :disabled="props.skipDisabled"
      title="立即完成"
      @click="handleSkipClick"
    >
      <SkipForward class="w-5 h-5" />
    </button>
  </div>
</template>
