import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Task, DailyStats } from '@/types';
import * as storage from '@/utils/storage';
import { formatDate, generateId } from '@/utils/date';

export const useTaskStore = defineStore('task', () => {
  const tasks = ref<Task[]>([]);
  const stats = ref<Record<string, DailyStats>>({});

  const today = formatDate();

  const todayTasks = computed(() => {
    return tasks.value.filter((task) => task.date === today);
  });

  const pendingTasks = computed(() => {
    return todayTasks.value.filter((task) => !task.completed);
  });

  const completedTasks = computed(() => {
    return todayTasks.value.filter((task) => task.completed);
  });

  const todayStats = computed(() => {
    return stats.value[today] || {
      date: today,
      completedTasks: 0,
      completedPomodoros: 0,
      totalFocusMinutes: 0,
    };
  });

  function loadTasks() {
    tasks.value = storage.getTasks();
    stats.value = storage.getAllStats();
  }

  function addTask(content: string) {
    const now = Date.now();
    const newTask: Task = {
      id: generateId(),
      content: content.trim(),
      completed: false,
      date: today,
      pomodoroCount: 0,
      createdAt: now,
      updatedAt: now,
    };
    tasks.value.push(newTask);
    storage.saveTasks(tasks.value);
    return newTask;
  }

  function updateTask(id: string, updates: Partial<Task>) {
    const index = tasks.value.findIndex((t) => t.id === id);
    if (index !== -1) {
      tasks.value[index] = {
        ...tasks.value[index],
        ...updates,
        updatedAt: Date.now(),
      };
      storage.saveTasks(tasks.value);
    }
  }

  function deleteTask(id: string) {
    tasks.value = tasks.value.filter((t) => t.id !== id);
    storage.saveTasks(tasks.value);
  }

  function toggleTaskStatus(id: string) {
    const task = tasks.value.find((t) => t.id === id);
    if (task) {
      const newStatus = !task.completed;
      updateTask(id, { completed: newStatus });
      updateStats({
        completedTasks: newStatus ? todayStats.value.completedTasks + 1 : Math.max(0, todayStats.value.completedTasks - 1),
      });
    }
  }

  function incrementTaskPomodoro(id: string) {
    const task = tasks.value.find((t) => t.id === id);
    if (task) {
      updateTask(id, { pomodoroCount: task.pomodoroCount + 1 });
    }
  }

  function completeTask(id: string) {
    const task = tasks.value.find((t) => t.id === id);
    if (task && !task.completed) {
      updateTask(id, { completed: true });
      updateStats({
        completedTasks: todayStats.value.completedTasks + 1,
      });
    }
  }

  function updateStats(updates: Partial<DailyStats>) {
    const current = todayStats.value;
    stats.value[today] = {
      ...current,
      ...updates,
      date: today,
    };
    storage.saveStats(stats.value[today]);
  }

  function incrementPomodoros() {
    updateStats({
      completedPomodoros: todayStats.value.completedPomodoros + 1,
    });
  }

  function addFocusMinutes(minutes: number) {
    updateStats({
      totalFocusMinutes: todayStats.value.totalFocusMinutes + minutes,
    });
  }

  return {
    tasks,
    stats,
    todayTasks,
    pendingTasks,
    completedTasks,
    todayStats,
    loadTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    incrementTaskPomodoro,
    completeTask,
    updateStats,
    incrementPomodoros,
    addFocusMinutes,
  };
});
