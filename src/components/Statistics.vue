<script setup lang="ts">
import { computed } from 'vue';
import { CheckCircle, Clock, Target, TrendingUp } from 'lucide-vue-next';
import { useTaskStore } from '@/stores/task';

const taskStore = useTaskStore();

const defaultStats = {
  date: '',
  completedTasks: 0,
  completedPomodoros: 0,
  totalFocusMinutes: 0,
};

const todayStats = computed(() => taskStore.todayStats || defaultStats);
const pendingCount = computed(() => taskStore.pendingTasks.length);
const completedCount = computed(() => taskStore.completedTasks.length);
const totalTasks = computed(() => pendingCount.value + completedCount.value);

const completionRate = computed(() => {
  const total = totalTasks.value;
  if (total === 0) return 0;
  return Math.round((completedCount.value / total) * 100);
});

const dailyGoal = 4;
const progressToGoal = computed(() => {
  const pomodoros = todayStats.value?.completedPomodoros || 0;
  return Math.min(100, Math.round((pomodoros / dailyGoal) * 100));
});
</script>

<template>
  <div class="bg-white rounded-2xl shadow-lg p-6 h-full">
    <h2 class="text-lg font-bold text-text-primary mb-6 flex items-center gap-2">
      <TrendingUp class="w-5 h-5 text-primary-500" />
      今日统计
    </h2>

    <div class="grid grid-cols-2 gap-4 mb-6">
      <div class="p-4 bg-primary-50 rounded-xl">
        <div class="flex items-center gap-2 text-primary-600 mb-2">
          <Target class="w-4 h-4" />
          <span class="text-xs font-medium">番茄钟</span>
        </div>
        <div class="text-2xl font-bold text-primary-700">
          {{ todayStats.completedPomodoros }}
          <span class="text-sm text-primary-400 font-normal">/{{ dailyGoal }}</span>
        </div>
        <div class="mt-2 h-1.5 bg-primary-100 rounded-full overflow-hidden">
          <div
            class="h-full bg-primary-500 rounded-full transition-all duration-500"
            :style="{ width: `${progressToGoal}%` }"
          />
        </div>
      </div>

      <div class="p-4 bg-green-50 rounded-xl">
        <div class="flex items-center gap-2 text-green-600 mb-2">
          <CheckCircle class="w-4 h-4" />
          <span class="text-xs font-medium">完成任务</span>
        </div>
        <div class="text-2xl font-bold text-green-700">
          {{ completedCount }}
          <span class="text-sm text-green-400 font-normal">/ 总计{{ totalTasks }}</span>
        </div>
        <div class="mt-2 h-1.5 bg-green-100 rounded-full overflow-hidden">
          <div
            class="h-full bg-green-500 rounded-full transition-all duration-500"
            :style="{ width: `${completionRate}%` }"
          />
        </div>
      </div>
    </div>

    <div class="space-y-4">
      <div class="flex items-center justify-between text-sm">
        <div class="flex items-center gap-2 text-text-secondary">
          <Clock class="w-4 h-4" />
          <span>专注时长</span>
        </div>
        <span class="font-semibold text-text-primary">
          {{ todayStats.totalFocusMinutes }} 分钟
        </span>
      </div>

      <div class="flex items-center justify-between text-sm">
        <div class="flex items-center gap-2 text-text-secondary">
          <Target class="w-4 h-4" />
          <span>待完成</span>
        </div>
        <span class="font-semibold text-primary-600">{{ pendingCount }} 项</span>
      </div>

      <div class="pt-4 border-t border-gray-100">
        <div class="text-center py-4">
          <div class="text-4xl font-bold text-primary-500 mb-1">
            {{ completionRate }}%
          </div>
          <p class="text-sm text-text-secondary">
            {{
              completionRate === 100
                ? '太棒了！全部完成！'
                : completionRate >= 70
                ? '效率很高，继续保持！'
                : completionRate >= 40
                ? '进展不错，加油！'
                : '开始行动吧！'
            }}
          </p>
        </div>
      </div>
    </div>

    <div class="mt-4 grid grid-cols-4 gap-2">
      <div
        v-for="i in 4"
        :key="i"
        class="aspect-square rounded-lg flex items-center justify-center transition-all duration-300"
        :class="
          i <= todayStats.completedPomodoros
            ? 'bg-primary-500 shadow-md shadow-primary-500/30'
            : 'bg-gray-100'
        "
      >
        <span
          v-if="i <= todayStats.completedPomodoros"
          class="text-white text-lg"
        >
          🍅
        </span>
      </div>
    </div>
    <p class="text-center text-xs text-text-tertiary mt-2">
      完成 4 个番茄钟后进入长休息
    </p>
  </div>
</template>
