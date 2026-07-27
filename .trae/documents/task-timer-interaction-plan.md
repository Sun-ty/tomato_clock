# 任务列表番茄钟快捷操作改造计划

## 背景
当前任务列表（[TaskList.vue](file:///d:/AI-Project/tomatoClock/src/components/TaskList.vue)）中每个任务项的播放按钮复用了"选择任务"逻辑，点击后只是选中/取消选中任务，无法直接开始或暂停番茄钟。用户希望改造待完成任务的播放按钮为快捷开始/暂停入口，同时简化已完成任务的操作。

## 目标
1. **待完成任务**：点击播放按钮自动选中该任务并立即开始番茄钟；计时器运行中再次点击则暂停，暂停时点击则继续。
2. **已完成任务**：仅保留删除按钮，隐藏勾选框和播放按钮。
3. **已完成任务点击**：仍保持可选中状态。

## 关键文件
- [src/components/TaskItem.vue](file:///d:/AI-Project/tomatoClock/src/components/TaskItem.vue)
- [src/components/TaskList.vue](file:///d:/AI-Project/tomatoClock/src/components/TaskList.vue)
- [src/pages/HomePage.vue](file:///d:/AI-Project/tomatoClock/src/pages/HomePage.vue)
- [src/composables/useTimer.ts](file:///d:/AI-Project/tomatoClock/src/composables/useTimer.ts)（只读确认接口）

## 实现方案

### 1. TaskItem.vue 改造
新增 props：
- `isTimerRunning?: boolean` — 计时器是否运行中
- `isTimerPaused?: boolean` — 计时器是否暂停
- `isCurrentTask?: boolean` — 该任务是否为当前计时器绑定的任务

新增 emits：
- `(e: 'start-timer', id: string): void` — 开始番茄钟
- `(e: 'pause-timer'): void` — 暂停计时
- `(e: 'resume-timer'): void` — 继续计时

渲染逻辑：
- **已完成任务**（`task.completed === true`）：
  - 隐藏左侧勾选框
  - 隐藏播放按钮
  - 保留番茄数徽章和删除按钮
  - 整行仍可点击选中
- **待完成任务**：
  - 左侧勾选框保留
  - 播放按钮根据状态显示不同图标和 tooltip：
    - `isCurrentTask && isTimerRunning` → 显示 Pause 图标，tooltip "暂停"
    - `isCurrentTask && isTimerPaused` → 显示 Play 图标，tooltip "继续"
    - 其他情况 → 显示 Play 图标，tooltip "开始番茄钟"
  - 点击播放按钮时阻止事件冒泡，根据状态 emit 对应事件

### 2. TaskList.vue 改造
- 引入 `useTimerStore` 读取计时器运行状态（`isRunning` / `isPaused`）和当前任务 ID（`currentTaskId`）。
- 将状态透传给每个 `TaskItem`。
- 监听 `start-timer`、`pause-timer`、`resume-timer` 事件并向上 emit。
- 已完成任务仍保留 `select` 事件响应，用于用户要求的"仍可选中"。

### 3. HomePage.vue 改造
新增事件处理：
- `handleStartTimer(taskId: string)`：
  - 调用 `handleSelectTask(taskId)` 确保任务被选中
  - 调用 `timer.startFocusTimer(taskId)` 开始番茄钟
- `handlePauseTimer()`：调用 `timer.pauseTimer()`
- `handleResumeTimer()`：调用 `timer.resumeTimer()`

并将这些处理绑定到 `TaskList` 组件的事件上。

## 验证步骤
1. 运行 `npm run build` 确保 TypeScript 类型检查通过。
2. 启动开发服务器 `npm run dev`。
3. 打开页面后：
   - 添加一个待完成任务，点击其右侧播放按钮，应看到任务被选中且番茄钟开始倒计时，按钮变为暂停图标。
   - 再次点击同一任务的暂停图标，计时器暂停，按钮变为播放图标。
   - 切换到"已完成" tab，添加一个任务并手动勾选完成，确认该行只显示删除按钮，无勾选框和播放按钮。
   - 点击已完成任务项，确认仍可被选中（若 TimerPanel 中有选中显示则可见）。

## 影响范围
仅涉及任务列表交互和番茄钟快捷控制，不影响统计、主题、设置等其他模块。
