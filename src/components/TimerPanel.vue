<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { Settings, Play, AlertTriangle } from 'lucide-vue-next';
import CircularProgress from './CircularProgress.vue';
import TimerControls from './TimerControls.vue';
import { useTimer } from '@/composables/useTimer';
import { useTimerStore } from '@/stores/timer';
import { useTaskStore } from '@/stores/task';
import { useSettingsStore } from '@/stores/settings';

const emit = defineEmits<{
  (e: 'open-settings'): void;
  (e: 'start-pomodoro'): void;
  (e: 'select-task', id: string | null): void;
}>();

const timerStore = useTimerStore();

const {
  displayTime,
  currentModeLabel,
  progressPercent,
  completedPomodoros,
  isBreak,
  startFocusTimer,
  pauseTimer,
  resumeTimer,
  handleReset,
  handleSkip,
  setTaskForTimer,
} = useTimer();

const { isRunning, isPaused, isIdle } = storeToRefs(timerStore);

const settingsStore = useSettingsStore();

const selectedTaskId = ref<string | null>(null);
const showSkipConfirm = ref(false);

const progressRatio = computed(() => {
  return 1 - Number(progressPercent.value) / 100;
});

const taskStore = useTaskStore();

const selectedTaskName = computed(() => {
  if (!selectedTaskId.value) return '';
  const task = taskStore.tasks.find((t) => t.id === selectedTaskId.value);
  return task?.content || '';
});

const pomodorosBeforeBreak = computed(() => {
  return settingsStore.settings?.pomodorosBeforeLongBreak || 4;
});

const completedInCycle = computed(() => {
  const target = pomodorosBeforeBreak.value || 4;
  const completed = Number(completedPomodoros) || 0;
  return completed % target;
});

const nextBreakAt = computed(() => {
  const target = pomodorosBeforeBreak.value || 4;
  return target - completedInCycle.value;
});

function handleStart() {
  if (selectedTaskId.value) {
    startFocusTimer(selectedTaskId.value);
  } else {
    startFocusTimer(null);
  }
}

function handlePause() {
  pauseTimer();
}

function handleResume() {
  resumeTimer();
}

function handleResetClick() {
  handleReset();
}

function handleSkipClick() {
  if (timerStore.isIdle) return;
  showSkipConfirm.value = true;
}

function confirmSkip() {
  showSkipConfirm.value = false;
  const taskId = selectedTaskId.value;
  handleSkip();
  if (taskId) {
    selectedTaskId.value = null;
    emit('select-task', null);
  }
}

function cancelSkip() {
  showSkipConfirm.value = false;
}

watch(selectedTaskId, (newId) => {
  setTaskForTimer(newId);
});

defineExpose({
  setSelectedTask: (taskId: string | null) => {
    selectedTaskId.value = taskId;
  },
  getSelectedTask: () => selectedTaskId.value,
});
</script>

<template>
  <div class="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center h-full">
    <div class="w-full flex items-center justify-between mb-6">
      <div class="flex items-center gap-2">
        <div
          class="w-2.5 h-2.5 rounded-full transition-colors duration-300"
          :class="
            isRunning
              ? 'bg-green-500 animate-pulse'
              : isPaused
              ? 'bg-yellow-500'
              : 'bg-gray-300'
          "
        />
        <span class="text-sm font-medium text-text-secondary">
          {{ currentModeLabel }}
        </span>
      </div>
      <button
        class="p-2 rounded-lg hover:bg-surface-100 transition-colors text-text-secondary"
        @click="emit('open-settings')"
      >
        <Settings class="w-5 h-5" />
      </button>
    </div>

    <div class="flex-1 flex flex-col items-center justify-center">
      <CircularProgress
        :progress="progressRatio"
        :size="280"
        :stroke-width="10"
        :color="isBreak ? '#22c55e' : 'var(--color-primary-500)'"
        :track-color="isBreak ? '#dcfce7' : '#f3e8ff'"
      >
        <div class="text-center">
          <span
            class="text-7xl font-bold tabular-nums transition-colors duration-300"
            :class="isBreak ? 'text-green-600' : 'text-primary-600'"
          >
            {{ displayTime }}
          </span>
          <p class="mt-2 text-sm text-text-secondary">
            {{ isBreak ? '休息一下，放松身心' : '保持专注，加油！' }}
          </p>
        </div>
      </CircularProgress>

      <div class="mt-8 flex items-center gap-2">
        <span class="text-xs text-text-tertiary">已完成</span>
        <div class="flex gap-1">
          <span
            v-for="i in pomodorosBeforeBreak"
            :key="i"
            class="w-3 h-3 rounded-full transition-all duration-300"
            :class="
              i <= completedInCycle
                ? 'bg-primary-500'
                : 'bg-gray-200'
            "
          />
        </div>
        <span class="text-xs text-text-tertiary">
          距休息还有 {{ nextBreakAt }} 个
        </span>
      </div>
    </div>

    <div class="mt-8">
      <TimerControls
        :is-running="isRunning"
        :is-paused="isPaused"
        :is-idle="isIdle"
        :skip-disabled="isIdle"
        @start="handleStart"
        @pause="handlePause"
        @resume="handleResume"
        @reset="handleResetClick"
        @skip="handleSkipClick"
      />
    </div>

    <div
      v-if="selectedTaskId && isIdle"
      class="mt-6 text-center"
    >
      <div class="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-xl">
        <span class="text-sm text-primary-700 font-medium truncate max-w-[200px]">
          {{ selectedTaskName }}
        </span>
      </div>
    </div>

    <Teleport to="body">
      <div
        v-if="showSkipConfirm"
        class="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="cancelSkip" />
        <div class="relative bg-white rounded-2xl shadow-2xl p-6 w-80 mx-4 animate-scale-in">
          <div class="flex flex-col items-center text-center">
            <div class="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
              <AlertTriangle class="w-8 h-8 text-yellow-500" />
            </div>
            <h3 class="text-lg font-bold text-text-primary mb-2">提前结束计时</h3>
            <p class="text-sm text-text-secondary mb-6">
              确定要提前结束当前计时吗？已完成的时间将被记录。
            </p>
            <div class="flex gap-3 w-full">
              <button
                class="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-text-secondary hover:bg-gray-50 transition-colors font-medium"
                @click="cancelSkip"
              >
                取消
              </button>
              <button
                class="flex-1 px-4 py-2.5 rounded-xl bg-primary-500 text-white hover:bg-primary-600 transition-colors font-medium shadow-lg shadow-primary-500/30"
                @click="confirmSkip"
              >
                确定结束
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
