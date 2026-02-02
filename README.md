# 🏢 智能电梯系统 - TypeScript OOP 思想演示

> 基于 Monorepo 架构的现代化电梯系统项目，深入展示面向对象编程（OOP）四大核心思想

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2-61dafb.svg)](https://reactjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📖 项目简介

本项目通过一个生动有趣的"智能大厦电梯系统"场景，完整展示了**面向对象编程（OOP）**的四大核心思想：

- 🔒 **封装（Encapsulation）** - 隐藏内部实现，提供公共接口
- 🎯 **抽象（Abstraction）** - 定义接口和抽象类，关注本质特征
- 🧬 **继承（Inheritance）** - 代码重用和层次结构
- 🎭 **多态（Polymorphism）** - 一个接口，多种实现

## 🏗️ 项目架构

采用 **Monorepo** 架构，使用 **pnpm workspace** 管理：

```
elevator-system/
├── packages/
│   ├── core/                    # 核心库 - 电梯系统逻辑
│   │   ├── src/
│   │   │   ├── models/         # 电梯模型（BaseElevator、PassengerElevator等）
│   │   │   ├── controllers/    # 控制器（ElevatorController）
│   │   │   ├── types/          # TypeScript 类型定义
│   │   │   └── index.ts        # 导出入口
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── page/                    # Web 演示应用
│       ├── src/
│       │   ├── components/     # React 组件
│       │   ├── App.tsx         # 主应用
│       │   └── main.tsx        # 入口文件
│       ├── package.json
│       └── vite.config.ts
│
├── package.json                 # 根配置
├── pnpm-workspace.yaml          # Workspace 配置
└── README.md
```

## 🚀 快速开始

### 前置要求

- [Node.js](https://nodejs.org/) >= 18
- [pnpm](https://pnpm.io/) >= 8

### 安装依赖

```bash
# 克隆项目
git clone <your-repo-url>
cd elevator-system

# 安装所有依赖
pnpm install

# 构建核心库
pnpm build:core
```

### 运行演示

#### 方式 1：Web 可视化演示（推荐）

```bash
# 启动 Web 演示应用
pnpm dev

# 浏览器访问 http://localhost:5173
```

#### 方式 2：构建生产版本

```bash
# 构建所有包
pnpm build

# 预览构建结果
pnpm preview
```

## 📦 核心功能

### 1. 多种电梯类型

| 电梯类型 | 图标 | 特点 | OOP 体现 |
|---------|------|------|---------|
| **普通客梯** | 🏢 | 速度适中，承载一般 | 基础继承 |
| **货运电梯** | 📦 | 速度慢，承重大 | 功能扩展 |
| **观光电梯** | 🎡 | 可欣赏风景，特殊照明 | 行为定制 |
| **VIP电梯** | 👑 | 速度快，权限控制 | 接口实现 |
| **智能电梯** | 🤖 | 智能调度，自主学习 | 策略模式 |

### 2. 智能控制系统

- ⚡ 实时电梯状态监控
- 🎯 智能调度算法
- 🚨 紧急停止功能
- 📊 优先级管理（普通/高/紧急）
- 🔄 快捷场景演示（早高峰/VIP直达/货物运输）

### 3. 可视化界面

- 🎨 实时动画展示电梯运行
- 📱 响应式设计，支持多设备
- 🌓 深色模式支持
- 🎭 流畅的门开关动画
- 📈 实时状态更新

## 💡 OOP 思想详解

### 封装（Encapsulation）

```typescript
// BaseElevator.ts - 内部状态被封装
export abstract class BaseElevator implements IElevator {
  protected config: ElevatorConfig;      // 受保护的配置
  protected status: ElevatorStatus;      // 受保护的状态
  
  // 公共接口
  public async moveTo(floor: number): Promise<void> {
    // 复杂逻辑对外隐藏
  }
}
```

**体现**：用户只需调用 `moveTo()`，无需了解内部如何控制电机、钢缆等细节。

### 抽象（Abstraction）

```typescript
// types/index.ts - 定义抽象接口
export interface IElevator {
  moveTo(floor: number): Promise<void>;
  openDoor(): Promise<void>;
  closeDoor(): Promise<void>;
  getStatus(): ElevatorStatus;
}

// BaseElevator.ts - 抽象基类
export abstract class BaseElevator implements IElevator {
  abstract getElevatorType(): string;  // 强制子类实现
}
```

**体现**：定义"电梯是什么"（接口），而不是"电梯怎么做"（实现）。

### 继承（Inheritance）

```typescript
// PassengerElevator.ts - 继承基类
export class PassengerElevator extends BaseElevator {
  constructor(id: string, maxFloor: number = 20) {
    super(config);  // 继承父类功能
  }
  
  // 实现抽象方法
  getElevatorType(): string {
    return '🏢 普通客梯';
  }
}
```

**体现**：所有电梯类型共享基类的 `moveTo()`、`openDoor()` 等方法，避免代码重复。

### 多态（Polymorphism）

```typescript
// ElevatorController.ts - 统一接口管理
export class ElevatorController {
  private elevators: Map<string, IElevator> = new Map();
  
  async callElevator(fromFloor: number, toFloor: number): Promise<void> {
    const elevator = this.selectBestElevator(fromFloor, toFloor);
    await elevator.moveTo(fromFloor);  // 运行时动态绑定
  }
}
```

**体现**：同样的 `moveTo()` 调用，VIP电梯会先检查权限，货梯会检查重量，实现不同行为。

## 🎯 设计模式

| 模式 | 应用场景 | 文件位置 |
|-----|---------|---------|
| **工厂模式** | 创建不同类型电梯 | `models/*.ts` |
| **策略模式** | 智能调度算法 | `SmartElevator.ts` |
| **观察者模式** | 状态监听更新 | `ElevatorShaft.tsx` |
| **模板方法** | 钩子函数 | `BaseElevator.ts` |
| **单例模式** | 控制器实例 | `ElevatorController.ts` |

## 🛠️ 技术栈

### 核心库（@elevator-system/core）

- **TypeScript** - 类型安全的 JavaScript
- **ES Modules** - 现代模块系统
- **OOP 设计** - 完整的面向对象实现

### Web 应用（@elevator-system/page）

- **React 19** - 最新的 React 版本
- **TypeScript** - 类型安全
- **Vite** - 极速构建工具
- **Tailwind CSS 4** - 原子化 CSS 框架
- **Ant Design 6** - 企业级 UI 组件库
- **Lucide React** - 现代图标库
- **Biome** - 快速的代码格式化和检查工具

## 📚 API 文档

### 创建电梯

```typescript
import { 
  PassengerElevator, 
  FreightElevator,
  VIPElevator 
} from '@elevator-system/core';

// 创建普通客梯
const passenger = new PassengerElevator('E1', 20);

// 创建货运电梯
const freight = new FreightElevator('F1', 15);

// 创建 VIP 电梯
const vip = new VIPElevator('V1', 30);
vip.addAuthorizedUser('user001', 3);
```

### 控制电梯

```typescript
import { ElevatorController } from '@elevator-system/core';

const controller = new ElevatorController();
controller.registerElevator('E1', passenger);

// 调用电梯（从1楼到10楼，普通优先级）
await controller.callElevator(1, 10, 0);

// 紧急停止所有电梯
controller.emergencyStopAll();

// 获取所有电梯状态
const statuses = controller.getAllStatus();
```

## 🎓 学习价值

这个项目非常适合：

✅ **学习 OOP** - 完整展示四大核心思想  
✅ **TypeScript 实践** - 类型系统、接口、泛型等高级特性  
✅ **设计模式** - 多种设计模式的实际应用  
✅ **Monorepo 架构** - 现代化项目管理方式  
✅ **React 开发** - 组件化、状态管理、动画  
✅ **前端工程化** - Vite、Tailwind CSS 等工具链

## 📝 代码质量

- ✨ TypeScript 严格模式
- 🎯 完整的类型定义
- 📖 详细的代码注释
- 🏗️ 清晰的项目结构
- 🔄 模块化设计

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

[MIT License](LICENSE)

## 👨‍💻 作者

Manus AI

## 🌟 Star History

如果这个项目对你有帮助，请给一个 ⭐️ Star！

---

**通过这个项目，希望你能更深入地理解 OOP 思想，掌握现代 TypeScript 开发技能！** 🚀
