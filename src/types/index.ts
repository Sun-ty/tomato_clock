export interface Task {
  id: string;
  content: string;
  completed: boolean;
  date: string;
  pomodoroCount: number;
  createdAt: number;
  updatedAt: number;
}

export interface Settings {
  pomodoroDuration: number;
  longBreakDuration: number;
  theme: string;
  pomodorosBeforeLongBreak: number;
}

export interface DailyStats {
  date: string;
  completedTasks: number;
  completedPomodoros: number;
  totalFocusMinutes: number;
}

export type TimerMode = 'pomodoro' | 'break';
export type TimerStatus = 'idle' | 'running' | 'paused';

export interface TimerState {
  mode: TimerMode;
  status: TimerStatus;
  remainingTime: number;
  totalTime: number;
  currentTaskId: string | null;
  completedPomodoros: number;
}

export interface ThemeConfig {
  id: string;
  name: string;
  colors: {
    primary50: string;
    primary100: string;
    primary200: string;
    primary300: string;
    primary400: string;
    primary500: string;
    primary600: string;
    primary700: string;
    primary800: string;
    primary900: string;
    secondary500: string;
    secondary600: string;
    surface50: string;
    surface100: string;
    surface200: string;
    textPrimary: string;
    textSecondary: string;
    textTertiary: string;
  };
}

export const DEFAULT_SETTINGS: Settings = {
  pomodoroDuration: 25,
  longBreakDuration: 15,
  theme: 'tomato',
  pomodorosBeforeLongBreak: 4,
};

export const DEFAULT_TIMER_STATE: TimerState = {
  mode: 'pomodoro',
  status: 'idle',
  remainingTime: 25 * 60,
  totalTime: 25 * 60,
  currentTaskId: null,
  completedPomodoros: 0,
};
