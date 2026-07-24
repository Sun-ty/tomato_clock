<script setup lang="ts">
import { X } from 'lucide-vue-next';
import { useSettingsStore } from '@/stores/settings';
import { THEME_LIST } from '@/utils/constants';
import ThemeSwitcher from './ThemeSwitcher.vue';
import { computed } from 'vue';

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const settingsStore = useSettingsStore();

const settings = computed(() => settingsStore.settings);

function updatePomodoroDuration(minutes: number) {
  settingsStore.setPomodoroDuration(minutes);
}

function updateLongBreakDuration(minutes: number) {
  settingsStore.setLongBreakDuration(minutes);
}

function updatePomodorosBeforeBreak(count: number) {
  settingsStore.setPomodorosBeforeBreak(count);
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="true"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        class="absolute inset-0 bg-black/50 backdrop-blur-sm"
        @click="emit('close')"
      />

      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-auto animate-scale-in">
        <div class="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 p-6 flex items-center justify-between">
          <h2 class="text-xl font-bold text-text-primary">设置</h2>
          <button
            class="p-2 rounded-lg hover:bg-surface-100 transition-colors text-text-secondary"
            @click="emit('close')"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <div class="p-6 space-y-8">
          <div class="space-y-4">
            <h3 class="text-sm font-semibold text-text-secondary uppercase tracking-wider">
              番茄钟设置
            </h3>
            
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <label class="text-sm text-text-primary">专注时长</label>
                <div class="flex items-center gap-2">
                  <button
                    class="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-text-primary transition-colors"
                    :disabled="settings.pomodoroDuration <= 5"
                    :class="{ 'opacity-50 cursor-not-allowed': settings.pomodoroDuration <= 5 }"
                    @click="updatePomodoroDuration(settings.pomodoroDuration - 5)"
                  >
                    -
                  </button>
                  <span class="w-16 text-center font-semibold text-lg text-primary-600">
                    {{ settings.pomodoroDuration }} 分钟
                  </span>
                  <button
                    class="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-text-primary transition-colors"
                    :disabled="settings.pomodoroDuration >= 60"
                    :class="{ 'opacity-50 cursor-not-allowed': settings.pomodoroDuration >= 60 }"
                    @click="updatePomodoroDuration(settings.pomodoroDuration + 5)"
                  >
                    +
                  </button>
                </div>
              </div>

              <div class="flex items-center justify-between">
                <label class="text-sm text-text-primary">长休息时长</label>
                <div class="flex items-center gap-2">
                  <button
                    class="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-text-primary transition-colors"
                    :disabled="settings.longBreakDuration <= 5"
                    :class="{ 'opacity-50 cursor-not-allowed': settings.longBreakDuration <= 5 }"
                    @click="updateLongBreakDuration(settings.longBreakDuration - 5)"
                  >
                    -
                  </button>
                  <span class="w-16 text-center font-semibold text-lg text-primary-600">
                    {{ settings.longBreakDuration }} 分钟
                  </span>
                  <button
                    class="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-text-primary transition-colors"
                    :disabled="settings.longBreakDuration >= 30"
                    :class="{ 'opacity-50 cursor-not-allowed': settings.longBreakDuration >= 30 }"
                    @click="updateLongBreakDuration(settings.longBreakDuration + 5)"
                  >
                    +
                  </button>
                </div>
              </div>

              <div class="flex items-center justify-between">
                <label class="text-sm text-text-primary">番茄钟数后休息</label>
                <div class="flex items-center gap-2">
                  <button
                    class="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-text-primary transition-colors"
                    :disabled="settings.pomodorosBeforeLongBreak <= 1"
                    :class="{ 'opacity-50 cursor-not-allowed': settings.pomodorosBeforeLongBreak <= 1 }"
                    @click="updatePomodorosBeforeBreak(settings.pomodorosBeforeLongBreak - 1)"
                  >
                    -
                  </button>
                  <span class="w-8 text-center font-semibold text-lg text-primary-600">
                    {{ settings.pomodorosBeforeLongBreak }}
                  </span>
                  <button
                    class="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-text-primary transition-colors"
                    :disabled="settings.pomodorosBeforeLongBreak >= 10"
                    :class="{ 'opacity-50 cursor-not-allowed': settings.pomodorosBeforeLongBreak >= 10 }"
                    @click="updatePomodorosBeforeBreak(settings.pomodorosBeforeLongBreak + 1)"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <h3 class="text-sm font-semibold text-text-secondary uppercase tracking-wider">
              主题设置
            </h3>
            <ThemeSwitcher />
          </div>

          <div class="pt-4 border-t border-gray-100">
            <p class="text-xs text-text-tertiary text-center">
              所有设置将自动保存到本地
            </p>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
