<script setup lang="ts">
import { computed, ref } from 'vue';
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

interface PieSlice {
  name: string;
  count: number;
  percent: number;
  color: string;
}

const chartColors = [
  '#ef4444',
  '#f97316',
  '#f59e0b',
  '#84cc16',
  '#10b981',
  '#06b6d4',
  '#3b82f6',
  '#6366f1',
  '#8b5cf6',
  '#d946ef',
];

const pieData = computed<PieSlice[]>(() => {
  const total = todayStats.value?.completedPomodoros || 0;
  if (total === 0) return [];

  const slices: PieSlice[] = [];

  // 有任务关联的番茄钟按任务名统计
  taskStore.todayTasks.forEach((task) => {
    if (task.pomodoroCount > 0) {
      slices.push({
        name: task.content,
        count: task.pomodoroCount,
        percent: (task.pomodoroCount / total) * 100,
        color: '',
      });
    }
  });

  // 非任务番茄钟单独统计
  const taskTotal = slices.reduce((sum, slice) => sum + slice.count, 0);
  const untracked = total - taskTotal;
  if (untracked > 0) {
    slices.push({
      name: '未关联任务',
      count: untracked,
      percent: (untracked / total) * 100,
      color: '',
    });
  }

  return slices.map((slice, index) => ({
    ...slice,
    color: chartColors[index % chartColors.length],
  }));
});

const hoveredSlice = ref<number | null>(null);

const piePaths = computed(() => {
  const data = pieData.value;
  if (data.length === 0) return [];

  const radius = 80;
  const centerX = 100;
  const centerY = 100;
  let startAngle = -Math.PI / 2;

  return data.map((slice) => {
    const angle = (slice.percent / 100) * Math.PI * 2;
    const endAngle = startAngle + angle;

    const x1 = centerX + radius * Math.cos(startAngle);
    const y1 = centerY + radius * Math.sin(startAngle);
    const x2 = centerX + radius * Math.cos(endAngle);
    const y2 = centerY + radius * Math.sin(endAngle);

    const largeArcFlag = angle > Math.PI ? 1 : 0;

    const path = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z',
    ].join(' ');

    startAngle = endAngle;
    return { path, color: slice.color };
  });
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

    </div>

    <!-- 番茄钟分布饼图 -->
    <div class="pt-4 border-t border-gray-100 mt-4">
      <h3 class="text-sm font-medium text-text-secondary mb-3 flex items-center gap-2">
        <Target class="w-4 h-4" />
        番茄钟分布
      </h3>

      <div
        v-if="todayStats.completedPomodoros === 0"
        class="text-center py-6 text-text-tertiary text-sm"
      >
        还没有完成番茄钟，开始专注吧！
      </div>

      <div v-else class="flex flex-col items-center">
        <div class="relative w-40 h-40 mb-4">
          <svg viewBox="0 0 200 200" class="w-full h-full">
            <circle cx="100" cy="100" r="80" fill="#f3f4f6" />
            <path
              v-for="(slice, index) in piePaths"
              :key="index"
              :d="slice.path"
              :fill="slice.color"
              stroke="white"
              stroke-width="2"
              class="transition-all duration-200 cursor-pointer hover:brightness-110"
              :style="{ transformOrigin: '100px 100px' }"
              @mouseenter="hoveredSlice = index"
              @mouseleave="hoveredSlice = null"
              :transform="hoveredSlice === index ? 'scale(1.06)' : 'scale(1)'"
            />
            <circle cx="100" cy="100" r="45" fill="white" />
            <text
              x="100"
              y="95"
              text-anchor="middle"
              class="text-[10px] fill-text-secondary pointer-events-none"
            >
              完成
            </text>
            <text
              x="100"
              y="115"
              text-anchor="middle"
              class="text-sm font-bold fill-text-primary pointer-events-none"
            >
              {{ todayStats.completedPomodoros }}
            </text>
          </svg>

          <div
            v-if="hoveredSlice !== null"
            class="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full px-3 py-2 bg-white rounded-lg shadow-lg border border-gray-100 text-xs whitespace-nowrap z-10"
          >
            <div class="flex items-center gap-2">
              <span
                class="w-2 h-2 rounded-full flex-shrink-0"
                :style="{ backgroundColor: pieData[hoveredSlice].color }"
              />
              <span class="font-medium text-text-primary">
                {{ pieData[hoveredSlice].name }}
              </span>
            </div>
            <div class="mt-1 text-text-secondary">
              {{ pieData[hoveredSlice].count }} 个番茄钟 ·
              {{ Math.round(pieData[hoveredSlice].percent) }}%
            </div>
          </div>
        </div>

        <div class="flex flex-wrap justify-center gap-x-4 gap-y-2 w-full">
          <div
            v-for="(slice, index) in pieData"
            :key="index"
            class="flex items-center gap-2 text-xs px-2 py-1 rounded-lg transition-colors cursor-pointer"
            :class="hoveredSlice === index ? 'bg-gray-100' : ''"
            @mouseenter="hoveredSlice = index"
            @mouseleave="hoveredSlice = null"
          >
            <span
              class="w-3 h-3 rounded-full flex-shrink-0"
              :style="{ backgroundColor: slice.color }"
            />
            <span class="text-text-secondary truncate max-w-[120px]">{{ slice.name }}</span>
            <span class="font-medium text-text-primary flex-shrink-0">
              {{ slice.count }}个
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
