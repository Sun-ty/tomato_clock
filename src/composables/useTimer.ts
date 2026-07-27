import { onMounted, onUnmounted, ref, computed, toRef } from 'vue';
import { useTimerStore } from '@/stores/timer';
import { useSettingsStore } from '@/stores/settings';
import { useTaskStore } from '@/stores/task';
import type { TimerMode } from '@/types';

export function useTimer() {
  const timerStore = useTimerStore();
  const settingsStore = useSettingsStore();
  const taskStore = useTaskStore();
  
  const showCelebration = ref(false);
  const celebrationType = ref<'pomodoro-complete' | 'break-start'>('pomodoro-complete');
  const completedPomodoros = toRef(timerStore, 'completedPomodoros');

  const displayTime = computed(() => {
    const secs = timerStore.remainingTime;
    const mins = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  });

  const currentModeLabel = computed(() => {
    return timerStore.isPomodoro ? '专注时间' : '休息时间';
  });

  const progressPercent = computed(() => {
    return Math.round(timerStore.progress * 100);
  });

  function startFocusTimer(taskId?: string | null) {
    const duration = settingsStore.settings.pomodoroDuration * 60;
    timerStore.setMode('pomodoro', settingsStore.settings.pomodoroDuration);
    timerStore.setDuration(settingsStore.settings.pomodoroDuration);
    timerStore.startTimer(taskId ?? null);
  }

  function startBreakTimer() {
    const duration = settingsStore.settings.longBreakDuration;
    timerStore.setMode('break', duration);
    timerStore.setDuration(duration);
    timerStore.startTimer(null);
  }

  function handleTimerComplete() {
    if (timerStore.isPomodoro) {
      handlePomodoroComplete();
    } else {
      handleBreakComplete();
    }
  }

  function handlePomodoroComplete() {
    const taskId = timerStore.currentTaskId;
    
    if (taskId) {
      taskStore.incrementTaskPomodoro(taskId);
      taskStore.completeTask(taskId);
    }
    
    taskStore.incrementPomodoros();
    taskStore.addFocusMinutes(settingsStore.settings.pomodoroDuration);
    
    celebrationType.value = 'pomodoro-complete';
    showCelebration.value = true;
    
    timerStore.completeTimer();
    
    const pomodorosBeforeBreak = settingsStore.settings.pomodorosBeforeLongBreak;
    
    if (completedPomodoros.value % pomodorosBeforeBreak === 0) {
      setTimeout(() => {
        showCelebration.value = false;
        startBreakTimer();
      }, 2000);
    } else {
      setTimeout(() => {
        showCelebration.value = false;
      }, 2000);
    }
  }

  function handleBreakComplete() {
    celebrationType.value = 'break-start';
    showCelebration.value = true;

    timerStore.completeTimer();

    setTimeout(() => {
      showCelebration.value = false;
      const resetCount =
        completedPomodoros.value % settingsStore.settings.pomodorosBeforeLongBreak;
      timerStore.setCompletedPomodoros(resetCount);
      timerStore.setMode('pomodoro', settingsStore.settings.pomodoroDuration);
      timerStore.setDuration(settingsStore.settings.pomodoroDuration);
    }, 2000);
  }

  function handleSkip() {
    if (timerStore.isIdle) return;
    
    if (timerStore.isPomodoro) {
      const taskId = timerStore.currentTaskId;
      const elapsedSeconds = timerStore.totalTime - timerStore.remainingTime;
      
      if (elapsedSeconds <= 0) {
        timerStore.skipTimer();
        return;
      }
      
      const elapsedMinutes = Math.max(1, Math.round(elapsedSeconds / 60));
      
      if (taskId) {
        taskStore.incrementTaskPomodoro(taskId);
        taskStore.completeTask(taskId);
      }
      
      taskStore.incrementPomodoros();
      taskStore.addFocusMinutes(elapsedMinutes);
      
      celebrationType.value = 'pomodoro-complete';
      showCelebration.value = true;
      
      timerStore.skipTimer();
      
      const pomodorosBeforeBreak = settingsStore.settings.pomodorosBeforeLongBreak;
      
      if (completedPomodoros.value % pomodorosBeforeBreak === 0) {
        setTimeout(() => {
          showCelebration.value = false;
          startBreakTimer();
        }, 2000);
      } else {
        setTimeout(() => {
          showCelebration.value = false;
        }, 2000);
      }
    } else {
      timerStore.skipTimer();
      showCelebration.value = false;
      const resetCount =
        completedPomodoros.value % settingsStore.settings.pomodorosBeforeLongBreak;
      timerStore.setCompletedPomodoros(resetCount);
      timerStore.setMode('pomodoro', settingsStore.settings.pomodoroDuration);
      timerStore.setDuration(settingsStore.settings.pomodoroDuration);
    }
  }

  function handleReset() {
    timerStore.resetTimer();
    showCelebration.value = false;
  }

  function setTaskForTimer(taskId: string | null) {
    timerStore.setTaskId(taskId);
  }

  onMounted(() => {
    timerStore.restoreRunningTimer();
  });

  onUnmounted(() => {
    timerStore.clearInterval();
  });

  return {
    displayTime,
    currentModeLabel,
    progressPercent,
    showCelebration,
    celebrationType,
    startFocusTimer,
    startBreakTimer,
    handleTimerComplete,
    handleSkip,
    handleReset,
    setTaskForTimer,
    mode: toRef(timerStore, 'mode'),
    status: toRef(timerStore, 'status'),
    isRunning: timerStore.isRunning,
    isPaused: timerStore.isPaused,
    isIdle: timerStore.isIdle,
    isPomodoro: timerStore.isPomodoro,
    isBreak: timerStore.isBreak,
    currentTaskId: toRef(timerStore, 'currentTaskId'),
    completedPomodoros: toRef(timerStore, 'completedPomodoros'),
    progress: timerStore.progress,
    pauseTimer: timerStore.pauseTimer,
    resumeTimer: timerStore.resumeTimer,
  };
}
