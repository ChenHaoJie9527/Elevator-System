# 更新日志

本文档记录项目的所有重要更改。

## [1.2.0] - 2026-02-02

### ✨ 新增

#### Ant Design 6 集成

- 🎨 **集成 Ant Design 6.2**
  - 替换 Base UI 为 Ant Design 企业级组件库
  - 使用 Button、Modal、Tabs、Select、Tooltip、Card、Space 组件
  - 中文国际化配置（zhCN）
  - 更好的组件生态和文档支持

### 🔄 变更

#### 组件库迁移

- 移除 Base UI 依赖
- 全面采用 Ant Design 组件
- 优化用户交互体验

## [1.1.0] - 2026-02-02

### ✨ 新增

#### Base UI 集成（已弃用）

- 🎨 **集成 Base UI 1.1.0**
  - 添加无样式组件库，提供优秀的可访问性支持
  - 使用 Button、Tabs、Tooltip、Dialog 组件
  - 完整的键盘导航和 ARIA 属性支持

#### 组件改进

- 🎯 **ControlPanel 组件重构**
  - 使用 Base UI Tabs 组件分类展示控制面板
  - 使用 Base UI Button 组件统一按钮样式
  - 新增"手动控制"和"场景演示"两个标签页
  - 改进场景演示卡片布局，添加图标和描述

- 🏗️ **ElevatorShaft 组件增强**
  - 使用 Base UI Tooltip 显示电梯详细信息
  - Tooltip 展示电梯配置（速度、载重、服务楼层）
  - 添加信息图标提示用户可以查看详情

- 📱 **App 组件优化**
  - 使用 Base UI Dialog 实现"关于系统"对话框
  - Dialog 展示项目简介、技术栈、OOP 思想详解
  - 添加"关于"按钮到页面头部

#### 样式改进

- 🎨 **全局样式更新**
  - 添加 Base UI Portal 所需的 `.root { isolation: isolate; }`
  - 添加 iOS 26+ Safari 兼容样式 `body { position: relative; }`
  - 新增自定义动画 `fade-in` 和 `zoom-in`
  - 添加 Tooltip 箭头方向样式

#### 配置优化

- ⚙️ **Biome 配置统一到根目录**
  - 从 `packages/page` 移除 Biome 配置
  - 在根目录统一管理所有包的代码规范
  - 配置检查范围为 `packages/` 目录
  - 添加 `.biomeignore` 排除不必要的检查

### 🔧 优化

- 📝 **文档更新**
  - 更新 `README.md` 添加 Base UI 和 Biome 说明
  - 创建 `BASE_UI_INTEGRATION.md` 详细说明 Base UI 使用
  - 添加可访问性特性说明
  - 更新技术栈列表

- 🎯 **代码质量**
  - 使用 Biome 自动修复代码风格问题
  - 添加 `import type` 优化类型导入
  - 移除未使用的构造函数和参数
  - 统一导入顺序和格式

### 📦 依赖更新

```json
{
  "dependencies": {
    "@base-ui/react": "^1.1.0"  // 新增
  },
  "devDependencies": {
    "@biomejs/biome": "2.3.13"  // 移至根目录
  }
}
```

### 🚀 性能

- ⚡ **开发体验提升**
  - Biome 统一配置，减少重复依赖
  - Base UI 按需加载，优化打包体积
  - 组件模块化，提高代码复用性

### 🐛 修复

- 🔨 修复 Biome 配置的 `ignore` 字段问题（使用 `.biomeignore` 文件）
- 🔨 修复未使用参数的警告（添加下划线前缀）
- 🔨 修复导入顺序问题（使用 Biome 自动排序）

## [1.0.0] - 2026-02-02

### ✨ 初始版本

#### 核心功能

- 🏗️ **Monorepo 架构**
  - `packages/core` - 核心电梯系统库
  - `packages/page` - Web 前端演示应用
  - 使用 pnpm workspace 管理

- 🛗 **电梯类型**
  - PassengerElevator - 客运电梯
  - FreightElevator - 货运电梯
  - ScenicElevator - 观光电梯
  - VIPElevator - VIP 电梯
  - SmartElevator - 智能电梯

- 🎮 **控制系统**
  - ElevatorController - 电梯控制器
  - 智能调度算法
  - 优先级管理
  - 紧急停止功能

#### OOP 思想展示

- 📚 **封装** - 内部状态隐藏
- 🎯 **抽象** - 接口定义
- 🔗 **继承** - 基类扩展
- 🔄 **多态** - 多种实现

#### 前端特性

- ⚛️ React 19 现代框架
- 📘 TypeScript 类型安全
- ⚡ Vite 快速构建
- 🎨 Tailwind CSS 4 原子化样式
- 🎭 Lucide React 图标库

#### 可视化

- 🎬 实时电梯动画
- 🚪 门开关动画
- 📊 状态实时更新
- 📱 响应式设计

---

## 版本说明

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)  
版本遵循 [语义化版本](https://semver.org/lang/zh-CN/)

### 版本类型说明

- **新增**：新功能
- **优化**：现有功能改进
- **修复**：错误修复
- **性能**：性能提升
- **文档**：文档更新
- **依赖**：依赖包更新
