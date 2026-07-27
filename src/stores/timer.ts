import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import type { TimerState, TimerMode, TimerStatus } from '@/types';
import * as storage from '@/utils/storage';

export const useTimerStore = defineStore('timer', () => {
  const mode = ref<TimerMode>('pomodoro');
  const status = ref<TimerStatus>('idle');
  const remainingTime = ref(25 * 60);
  const totalTime = ref(25 * 60);
  const currentTaskId = ref<string | null>(null);
  const completedPomodoros = ref(0);
  const intervalId = ref<number | null>(null);

  const progress = computed(() => {
    if (totalTime.value === 0) return 0;
    return 1 - remainingTime.value / totalTime.value;
  });

  const isRunning = computed(() => status.value === 'running');
  const isPaused = computed(() => status.value === 'paused');
  const isIdle = computed(() => status.value === 'idle');
  const isPomodoro = computed(() => mode.value === 'pomodoro');
  const isBreak = computed(() => mode.value === 'break');

  function startTimer(taskId?: string | null) {
    clearInterval();
    
    if (taskId !== undefined) {
      currentTaskId.value = taskId;
    }
    
    status.value = 'running';
    intervalId.value = window.setInterval(() => {
      if (status.value !== 'running') return;
      if (remainingTime.value > 0) {
        remainingTime.value--;
      } else {
        completeTimer();
      }
    }, 1000);
    
    saveState();
  }

  function pauseTimer() {
    if (status.value === 'running') {
      status.value = 'paused';
      clearInterval();
      saveState();
    }
  }

  function resumeTimer() {
    if (status.value === 'paused') {
      clearInterval();
      status.value = 'running';
      intervalId.value = window.setInterval(() => {
        if (status.value !== 'running') return;
        if (remainingTime.value > 0) {
          remainingTime.value--;
        } else {
          completeTimer();
        }
      }, 1000);
      saveState();
    }
  }

  function resetTimer() {
    clearInterval();
    status.value = 'idle';
    remainingTime.value = totalTime.value;
    currentTaskId.value = null;
    saveState();
  }

  function completeTimer() {
    clearInterval();
    status.value = 'idle';
    
    if (mode.value === 'pomodoro') {
      completedPomodoros.value++;
    }
    
    remainingTime.value = totalTime.value;
    saveState();
  }

  function skipTimer() {
    completeTimer();
  }

  function setMode(newMode: TimerMode, durationMinutes: number) {
    clearInterval();
    mode.value = newMode;
    totalTime.value = durationMinutes * 60;
    remainingTime.value = durationMinutes * 60;
    status.value = 'idle';
    saveState();
  }

  function setDuration(minutes: number) {
    totalTime.value = minutes * 60;
    if (status.value === 'idle') {
      remainingTime.value = minutes * 60;
    }
    saveState();
  }

  function setTaskId(taskId: string | null) {
    currentTaskId.value = taskId;
    saveState();
  }

  function setCompletedPomodoros(count: number) {
    completedPomodoros.value = count;
    saveState();
  }

  function clearInterval() {
    if (intervalId.value !== null) {
      window.clearInterval(intervalId.value);
      intervalId.value = null;
    }
  }

  function saveState() {
    const state: TimerState = {
      mode: mode.value,
      status: status.value,
      remainingTime: remainingTime.value,
      totalTime: totalTime.value,
      currentTaskId: currentTaskId.value,
      completedPomodoros: completedPomodoros.value,
    };
    storage.saveTimerState(state);
  }

  function loadState() {
    const saved = storage.getTimerState();
    mode.value = saved.mode;
    status.value = 'idle';
    remainingTime.value = saved.remainingTime;
    totalTime.value = saved.totalTime;
    currentTaskId.value = saved.currentTaskId;
    completedPomodoros.value = saved.completedPomodoros;
  }

  function restoreRunningTimer() {
    const saved = storage.getTimerState();
    mode.value = saved.mode;
    totalTime.value = saved.totalTime;
    remainingTime.value = saved.remainingTime;
    currentTaskId.value = saved.currentTaskId;
    completedPomodoros.value = saved.completedPomodoros;

    if (saved.status === 'running' && saved.remainingTime > 0) {
      status.value = 'running';
      intervalId.value = window.setInterval(() => {
        if (status.value !== 'running') return;
        if (remainingTime.value > 0) {
          remainingTime.value--;
        } else {
          completeTimer();
        }
      }, 1000);
    }
  }

  function clearState() {
    clearInterval();
    mode.value = 'pomodoro';
    status.value = 'idle';
    remainingTime.value = 25 * 60;
    totalTime.value = 25 * 60;
    currentTaskId.value = null;
    completedPomodoros.value = 0;
    storage.clearTimerState();
  }

  watch([mode, status, remainingTime, currentTaskId, completedPomodoros], () => {
    saveState();
  });

  return {
    mode,
    status,
    remainingTime,
    totalTime,
    currentTaskId,
    completedPomodoros,
    progress,
    isRunning,
    isPaused,
    isIdle,
    isPomodoro,
    isBreak,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    completeTimer,
    skipTimer,
    setMode,
    setDuration,
    setTaskId,
    setCompletedPomodoros,
    loadState,
    restoreRunningTimer,
    clearInterval,
    clearState,
  };
});
