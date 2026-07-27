# 番茄钟 — 专注效率工具

一个基于 Vue 3 + TypeScript + Vite 构建的番茄钟待办计时网站，帮助你在工作与学习中保持专注、合理休息。

访问地址：https://sun-ty.github.io/tomato_clock/
---

## 功能特性

### 🍅 番茄钟计时
- **专注模式**：默认 25 分钟倒计时，支持开始、暂停、继续、重置、提前结束
- **休息模式**：完成指定番茄钟后自动进入休息，默认 15 分钟，休息期间不可暂停但可立即完成
- **循环周期**：休息结束后，已完成番茄钟数重置，重新开始下一轮专注
- **智能文案**：倒计时圆环会根据状态提示「保持专注，加油！」「可以休息啦」「休息一下，放松身心」

### ✅ 今日任务管理
- 快速添加今日待办任务
- 标记任务完成 / 删除任务
- 点击任务可选中作为当前番茄钟目标
- 已完成的任务会自动归档到「已完成」列表
- 每个任务独立统计投入的番茄钟数量

### 📊 今日统计面板
- 今日完成番茄钟数与目标进度
- 今日完成任务数与总任务数
- 今日专注总时长
- **番茄钟分布饼图**：按任务名统计各任务所占番茄钟比例，未关联任务的番茄钟单独统计；鼠标悬浮可查看具体名称、数量与占比

### ⚙️ 可配置设置
- 专注时长：5 ~ 60 分钟，步进 5 分钟
- 长休息时长：5 ~ 30 分钟，步进 5 分钟
- 番茄钟数后休息：1 ~ 10 个
- 主题切换：番茄红、经典紫、薄荷绿、海洋蓝、日落橙，默认番茄红

### 💾 本地存储
- 所有任务、统计、设置、计时器状态均保存在浏览器 LocalStorage 中
- 刷新页面后数据与进行中的计时自动恢复
- 任务与统计数据按日期分组，每日独立统计

### 📱 其他体验
- 移动端竖屏访问时提示切换为横屏
- 完成番茄钟或进入休息时展示视觉庆祝动效
- 无音效干扰，所有提醒均为视觉反馈

---

## 技术栈

- **框架**：Vue 3（`<script setup>` 组合式 API）
- **语言**：TypeScript
- **构建工具**：Vite
- **状态管理**：Pinia
- **样式**：Tailwind CSS
- **图标**：lucide-vue-next

---

## 项目结构

```
src/
├── components/        # UI 组件
│   ├── TaskItem.vue      # 单个任务项
│   ├── TaskList.vue      # 任务列表
│   ├── TimerPanel.vue    # 计时器面板
│   ├── TimerControls.vue # 计时器控制按钮
│   ├── Statistics.vue    # 今日统计与饼图
│   ├── SettingsModal.vue # 设置弹窗
│   ├── ThemeSwitcher.vue # 主题切换
│   ├── CircularProgress.vue  # 圆形进度条
│   ├── CelebrationEffect.vue # 庆祝动效
│   └── OrientationWarning.vue # 横屏提示
├── composables/       # 可复用组合式逻辑
│   ├── useTimer.ts       # 计时器核心逻辑
│   ├── useTheme.ts       # 主题初始化
│   └── useOrientation.ts # 屏幕方向检测
├── stores/            # Pinia 状态管理
│   ├── timer.ts
│   ├── task.ts
│   └── settings.ts
├── pages/             # 页面
│   └── HomePage.vue
├── utils/             # 工具函数与常量
│   ├── storage.ts
│   ├── date.ts
│   └── constants.ts
├── types/             # TypeScript 类型定义
└── App.vue / main.ts
```

---

## 开始使用

### 安装依赖

```bash
npm install
```

### 本地开发

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 类型检查

```bash
npm run check
```

---

## 默认配置

| 配置项 | 默认值 |
| --- | --- |
| 专注时长 | 25 分钟 |
| 长休息时长 | 15 分钟 |
| 番茄钟数后休息 | 4 个 |
| 默认主题 | 番茄红 |

---

## 本地存储说明

应用在浏览器 LocalStorage 中保存以下键值：

- `tomato_clock_tasks`：任务列表
- `tomato_clock_daily_stats`：每日统计数据
- `tomato_clock_settings`：用户设置
- `tomato_clock_timer_state`：计时器运行状态

清除浏览器本地存储将重置所有数据。
