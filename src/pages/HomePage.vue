<script setup lang="ts">
import { ref, onMounted, provide } from 'vue';
import { RotateCcw, Play } from 'lucide-vue-next';
import TaskList from '@/components/TaskList.vue';
import TimerPanel from '@/components/TimerPanel.vue';
import Statistics from '@/components/Statistics.vue';
import SettingsModal from '@/components/SettingsModal.vue';
import CelebrationEffect from '@/components/CelebrationEffect.vue';
import OrientationWarning from '@/components/OrientationWarning.vue';
import { useTaskStore } from '@/stores/task';
import { useTimer } from '@/composables/useTimer';
import { useOrientation } from '@/composables/useOrientation';
import { useTheme } from '@/composables/useTheme';

const taskStore = useTaskStore();
const timer = useTimer();
const { showOrientationWarning } = useOrientation();
const { currentTheme } = useTheme();

const showSettings = ref(false);
const timerPanelRef = ref<InstanceType<typeof TimerPanel> | null>(null);

onMounted(() => {
  taskStore.loadTasks();
});

function handleSelectTask(taskId: string | null) {
  if (timerPanelRef.value) {
    timerPanelRef.value.setSelectedTask(taskId);
  }
}

function openSettings() {
  showSettings.value = true;
}

function closeSettings() {
  showSettings.value = false;
}

function startPomodoro() {
  if (timerPanelRef.value) {
    const taskId = timerPanelRef.value.getSelectedTask();
    timer.startFocusTimer(taskId);
  } else {
    timer.startFocusTimer(null);
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-surface-50 to-primary-50 transition-colors duration-300">
    <OrientationWarning :show="showOrientationWarning" />

    <header class="px-6 py-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div
          class="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
          :style="{ background: `linear-gradient(135deg, ${currentTheme.colors.primary400} 0%, ${currentTheme.colors.primary600} 100%)` }"
        >
          <span class="text-xl">🍅</span>
        </div>
        <div>
          <h1 class="text-xl font-bold text-text-primary">番茄钟</h1>
          <p class="text-xs text-text-secondary">专注当下，高效生活</p>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <div class="text-right">
          <p class="text-sm font-medium text-text-primary">{{ taskStore.todayStats.completedPomodoros }} 🍅</p>
          <p class="text-xs text-text-tertiary">今日完成</p>
        </div>
      </div>
    </header>

    <main class="px-6 pb-6">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1440px] mx-auto">
        <div class="lg:col-span-3 order-2 lg:order-1">
          <TaskList @select-task="handleSelectTask" />
        </div>

        <div class="lg:col-span-6 order-1 lg:order-2">
          <TimerPanel
            ref="timerPanelRef"
            @open-settings="openSettings"
            @start-pomodoro="startPomodoro"
            @select-task="handleSelectTask"
          />
        </div>

        <div class="lg:col-span-3 order-3">
          <Statistics />
        </div>
      </div>
    </main>

    <footer class="text-center py-4 text-xs text-text-tertiary">
      番茄钟待办计时网站 · 专注效率工具
    </footer>

    <SettingsModal v-if="showSettings" @close="closeSettings" />

    <CelebrationEffect
      :show="timer.showCelebration.value"
      :type="timer.celebrationType.value"
    />
  </div>
</template>
