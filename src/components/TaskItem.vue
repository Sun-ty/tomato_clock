<script setup lang="ts">
import { computed } from 'vue';
import { Check, Trash2, Play, Pause } from 'lucide-vue-next';
import type { Task } from '@/types';

const props = defineProps<{
  task: Task;
  isSelected?: boolean;
  isTimerRunning?: boolean;
  isTimerPaused?: boolean;
  isCurrentTask?: boolean;
}>();

const emit = defineEmits<{
  (e: 'toggle', id: string): void;
  (e: 'delete', id: string): void;
  (e: 'select', id: string): void;
  (e: 'start-timer', id: string): void;
  (e: 'pause-timer'): void;
  (e: 'resume-timer'): void;
}>();

const taskPomodoroLabel = computed(() => {
  return props.task.pomodoroCount > 0 ? `🍅 ${props.task.pomodoroCount}` : '';
});

const isPlaying = computed(() => {
  return props.isCurrentTask && props.isTimerRunning;
});

const isPaused = computed(() => {
  return props.isCurrentTask && props.isTimerPaused;
});

const playTooltip = computed(() => {
  if (isPlaying.value) return '暂停';
  if (isPaused.value) return '继续';
  return '开始番茄钟';
});

function handleToggle() {
  emit('toggle', props.task.id);
}

function handleDelete(e: Event) {
  e.stopPropagation();
  emit('delete', props.task.id);
}

function handleSelect() {
  emit('select', props.task.id);
}

function handleTimerAction(e: Event) {
  e.stopPropagation();
  if (isPlaying.value) {
    emit('pause-timer');
  } else if (isPaused.value) {
    emit('resume-timer');
  } else {
    emit('start-timer', props.task.id);
  }
}
</script>

<template>
  <div
    class="group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer"
    :class="[
      task.completed
        ? 'bg-surface-50 opacity-60'
        : 'bg-white hover:bg-primary-50 hover:shadow-md',
      isSelected ? 'bg-primary-50 shadow-md' : '',
    ]"
    @click="handleSelect"
  >
    <button
      v-if="!task.completed"
      class="flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200"
      :class="[
        task.completed
          ? 'bg-primary-500 border-primary-500'
          : 'border-gray-300 hover:border-primary-500',
      ]"
      @click.stop="handleToggle"
    >
      <Check
        v-if="task.completed"
        class="w-3 h-3 text-white"
        :stroke-width="3"
      />
    </button>

    <div class="flex-1 min-w-0">
      <p
        class="text-sm truncate transition-all duration-200"
        :class="[
          task.completed
            ? 'line-through text-text-tertiary'
            : 'text-text-primary font-medium',
        ]"
      >
        {{ task.content }}
      </p>
    </div>

    <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <span
        v-if="taskPomodoroLabel"
        class="text-xs text-primary-600 bg-primary-100 px-2 py-0.5 rounded-full"
      >
        {{ taskPomodoroLabel }}
      </span>

      <button
        v-if="!task.completed"
        class="p-1.5 rounded-lg text-primary-500 hover:bg-primary-100 transition-colors"
        :title="playTooltip"
        @click.stop="handleTimerAction"
      >
        <Pause v-if="isPlaying" class="w-4 h-4" />
        <Play v-else class="w-4 h-4" />
      </button>

      <button
        class="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
        @click="handleDelete"
      >
        <Trash2 class="w-4 h-4" />
      </button>
    </div>

    <div
      v-if="taskPomodoroLabel && !isSelected"
      class="opacity-100 md:opacity-0 group-hover:opacity-0 transition-opacity"
    >
      <span class="text-xs text-primary-600 bg-primary-100 px-2 py-0.5 rounded-full">
        {{ taskPomodoroLabel }}
      </span>
    </div>
  </div>
</template>
