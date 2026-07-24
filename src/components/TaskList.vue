<script setup lang="ts">
import { ref, computed } from 'vue';
import { Plus } from 'lucide-vue-next';
import TaskItem from './TaskItem.vue';
import { useTaskStore } from '@/stores/task';
import { formatDate } from '@/utils/date';

const emit = defineEmits<{
  (e: 'select-task', id: string | null): void;
}>();

const taskStore = useTaskStore();
const newTaskContent = ref('');
const selectedTaskId = ref<string | null>(null);
const activeTab = ref<'pending' | 'completed'>('pending');

const today = computed(() => formatDate());
const pendingCount = computed(() => taskStore.pendingTasks.length);
const completedCount = computed(() => taskStore.completedTasks.length);

const currentTasks = computed(() => {
  return activeTab.value === 'pending' 
    ? taskStore.pendingTasks 
    : taskStore.completedTasks;
});

function switchTab(tab: 'pending' | 'completed') {
  activeTab.value = tab;
}

function addTask() {
  if (!newTaskContent.value.trim()) return;
  taskStore.addTask(newTaskContent.value);
  newTaskContent.value = '';
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    addTask();
  }
}

function toggleTask(id: string) {
  taskStore.toggleTaskStatus(id);
}

function deleteTask(id: string) {
  if (confirm('确定删除该任务吗？')) {
    taskStore.deleteTask(id);
    if (selectedTaskId.value === id) {
      selectedTaskId.value = null;
      emit('select-task', null);
    }
  }
}

function selectTask(id: string) {
  if (selectedTaskId.value === id) {
    selectedTaskId.value = null;
    emit('select-task', null);
  } else {
    selectedTaskId.value = id;
    emit('select-task', id);
  }
}

function clearSelection() {
  selectedTaskId.value = null;
  emit('select-task', null);
}
</script>

<template>
  <div class="bg-white rounded-2xl shadow-lg p-6 h-full flex flex-col">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-bold text-text-primary">今日任务</h2>
      <span class="text-sm text-text-secondary">{{ today }}</span>
    </div>

    <div class="flex gap-2 mb-4">
      <input
        v-model="newTaskContent"
        type="text"
        placeholder="添加新任务..."
        class="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm"
        @keydown="handleKeydown"
      />
      <button
        class="px-4 py-2.5 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors flex items-center gap-1.5 text-sm font-medium"
        @click="addTask"
      >
        <Plus class="w-4 h-4" />
        添加
      </button>
    </div>

    <div v-if="selectedTaskId" class="mb-3 p-3 bg-primary-50 rounded-xl flex items-center justify-between">
      <span class="text-sm text-primary-700 font-medium">
        已选择任务作为番茄钟目标
      </span>
      <button
        class="text-sm text-primary-600 hover:text-primary-800 transition-colors"
        @click="clearSelection"
      >
        取消选择
      </button>
    </div>

    <div class="flex gap-1 p-1 bg-gray-100 rounded-xl mb-4">
      <button
        class="flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2"
        :class="
          activeTab === 'pending'
            ? 'bg-white text-primary-600 shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
        "
        @click="switchTab('pending')"
      >
        <span>待完成</span>
        <span
          class="min-w-[20px] h-5 px-1.5 rounded-full text-[10px] flex items-center justify-center"
          :class="
            activeTab === 'pending'
              ? 'bg-primary-100 text-primary-700'
              : 'bg-gray-200 text-gray-600'
          "
        >
          {{ pendingCount }}
        </span>
      </button>
      <button
        class="flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2"
        :class="
          activeTab === 'completed'
            ? 'bg-white text-primary-600 shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
        "
        @click="switchTab('completed')"
      >
        <span>已完成</span>
        <span
          class="min-w-[20px] h-5 px-1.5 rounded-full text-[10px] flex items-center justify-center"
          :class="
            activeTab === 'completed'
              ? 'bg-primary-100 text-primary-700'
              : 'bg-gray-200 text-gray-600'
          "
        >
          {{ completedCount }}
        </span>
      </button>
    </div>

    <div class="flex-1 overflow-auto">
      <div v-if="currentTasks.length === 0" class="text-center py-8 text-text-tertiary text-sm">
        <p v-if="activeTab === 'pending'">暂无待完成任务</p>
        <p v-else>暂无已完成任务</p>
        <p class="mt-1 text-xs">
          {{ activeTab === 'pending' ? '添加一个任务开始专注吧！' : '完成任务后会出现在这里' }}
        </p>
      </div>
      <div v-else class="space-y-2">
        <TaskItem
          v-for="task in currentTasks"
          :key="task.id"
          :task="task"
          :is-selected="selectedTaskId === task.id"
          @toggle="toggleTask"
          @delete="deleteTask"
          @select="selectTask"
        />
      </div>
    </div>
  </div>
</template>
