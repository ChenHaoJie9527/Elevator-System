# 项目结构说明

## 目录结构

```
elevator-system/                          # 项目根目录
│
├── packages/                             # Monorepo 包目录
│   │
│   ├── core/                            # 核心库 (@elevator-system/core)
│   │   ├── src/
│   │   │   ├── types/                   # TypeScript 类型定义
│   │   │   │   └── index.ts            # 导出所有类型（ElevatorState, IElevator等）
│   │   │   │
│   │   │   ├── models/                  # 电梯模型
│   │   │   │   ├── BaseElevator.ts     # 抽象基类 - OOP核心
│   │   │   │   ├── PassengerElevator.ts # 普通客梯
│   │   │   │   ├── FreightElevator.ts   # 货运电梯
│   │   │   │   ├── ScenicElevator.ts    # 观光电梯
│   │   │   │   ├── VIPElevator.ts       # VIP电梯（带访问控制）
│   │   │   │   ├── SmartElevator.ts     # 智能电梯（带学习功能）
│   │   │   │   └── index.ts            # 导出所有模型
│   │   │   │
│   │   │   ├── controllers/             # 控制器
│   │   │   │   ├── ElevatorController.ts # 电梯调度控制器 - 多态应用
│   │   │   │   └── index.ts            # 导出控制器
│   │   │   │
│   │   │   └── index.ts                # 核心库主入口
│   │   │
│   │   ├── dist/                        # 构建输出目录
│   │   ├── package.json                 # 核心库配置
│   │   ├── tsconfig.json               # TypeScript 配置
│   │   └── README.md                   # 核心库文档
│   │
│   └── page/                            # Web 演示应用 (@elevator-system/page)
│       ├── src/
│       │   ├── components/              # React 组件
│       │   │   ├── ElevatorShaft.tsx   # 电梯井道可视化组件
│       │   │   └── ControlPanel.tsx    # 控制面板组件
│       │   │
│       │   ├── App.tsx                 # 主应用组件
│       │   ├── main.tsx                # React 入口文件
│       │   └── index.css               # 全局样式（Tailwind）
│       │
│       ├── public/                      # 静态资源
│       ├── dist/                        # 构建输出
│       ├── index.html                  # HTML 模板
│       ├── package.json                # 应用配置
│       ├── vite.config.ts              # Vite 配置
│       ├── tsconfig.json               # TypeScript 配置
│       ├── tsconfig.app.json           # App TypeScript 配置
│       ├── tsconfig.node.json          # Node TypeScript 配置
│       ├── tailwind.config.js          # Tailwind CSS 配置
│       └── postcss.config.js           # PostCSS 配置
│
├── node_modules/                        # 依赖包（所有包共享）
├── .claude/                             # Claude 技能配置
├── package.json                         # 根配置文件
├── pnpm-workspace.yaml                  # pnpm workspace 配置
├── pnpm-lock.yaml                      # 锁定文件
├── .gitignore                          # Git 忽略配置
├── README.md                           # 项目主文档
└── PROJECT_STRUCTURE.md                # 本文件

```

## 文件说明

### 根目录文件

| 文件 | 说明 |
|-----|------|
| `package.json` | 根配置，定义 workspace 脚本 |
| `pnpm-workspace.yaml` | 定义 monorepo 包结构 |
| `README.md` | 项目主要文档 |
| `.gitignore` | Git 忽略规则 |

### packages/core（核心库）

#### types/index.ts

- 定义所有 TypeScript 类型
- `ElevatorType` - 电梯类型枚举
- `ElevatorState` - 电梯状态枚举
- `DoorState` - 门状态枚举
- `IElevator` - 电梯接口（抽象）
- `IElevatorController` - 控制器接口
- `ElevatorConfig` - 配置类型
- `ElevatorStatus` - 状态类型

#### models/BaseElevator.ts

**核心抽象基类**，展示 OOP 的封装和抽象：

- `protected` 成员：封装内部状态
- `abstract` 方法：强制子类实现
- 钩子方法：`beforeMove()`, `onMoving()`, `afterMove()`
- 模板方法：`moveTo()` 定义算法骨架

#### models/具体电梯类

- **PassengerElevator** - 最基础的继承示例
- **FreightElevator** - 展示功能扩展（checkItemSize）
- **ScenicElevator** - 展示行为定制（toggleLighting）
- **VIPElevator** - 展示接口实现（IAccessControl）
- **SmartElevator** - 展示智能算法（predictNextFloor）

#### controllers/ElevatorController.ts

**展示多态的核心**：

- 通过 `IElevator` 接口统一管理不同类型电梯
- `selectBestElevator()` - 智能调度算法
- `emergencyStopAll()` - 批量操作展示

### packages/page（Web 应用）

#### components/ElevatorShaft.tsx

**电梯井道可视化组件**：

- 实时显示电梯位置和状态
- 动画展示门开关
- 使用 Tailwind CSS 实现样式
- 通过 `useEffect` 轮询状态更新

#### components/ControlPanel.tsx

**控制面板组件**：

- 楼层选择器
- 优先级设置
- 快捷场景演示
- 紧急停止按钮

#### App.tsx

**主应用组件**：

- 初始化所有电梯实例
- 创建控制器
- 组织页面布局
- 展示项目信息

## OOP 思想体现

### 1. 封装（Encapsulation）

**位置**: `packages/core/src/models/BaseElevator.ts`

```typescript
protected config: ElevatorConfig;
protected status: ElevatorStatus;

public async moveTo(floor: number): Promise<void> {
  // 内部复杂逻辑对外隐藏
}
```

### 2. 抽象（Abstraction）

**位置**: `packages/core/src/types/index.ts` + `BaseElevator.ts`

```typescript
export interface IElevator {
  moveTo(floor: number): Promise<void>;
  // ...
}

export abstract class BaseElevator implements IElevator {
  abstract getElevatorType(): string;
}
```

### 3. 继承（Inheritance）

**位置**: `packages/core/src/models/*.ts`

```typescript
export class PassengerElevator extends BaseElevator {
  // 继承所有基类功能
}
```

### 4. 多态（Polymorphism）

**位置**: `packages/core/src/controllers/ElevatorController.ts`

```typescript
private elevators: Map<string, IElevator>;

async callElevator(from: number, to: number) {
  const elevator = this.selectBestElevator(from, to);
  await elevator.moveTo(from); // 运行时动态绑定
}
```

## 技术栈总结

### 核心库（Core）

- TypeScript 5.9
- ES Modules
- 纯 OOP 实现

### Web 应用（Page）

- React 19.2
- TypeScript 5.9
- Vite 7.x
- Tailwind CSS 4.x
- Lucide React（图标）

### 构建工具

- pnpm（包管理）
- TypeScript Compiler（核心库构建）
- Vite（Web 应用构建）

## 开发流程

1. **核心库开发** → `packages/core/src/`
2. **构建核心库** → `pnpm build:core`
3. **Web 应用开发** → `packages/page/src/`
4. **本地预览** → `pnpm dev`
5. **生产构建** → `pnpm build`

## 依赖关系

```
@elevator-system/page
    ↓ (depends on)
@elevator-system/core
```

页面应用依赖核心库，通过 `workspace:*` 协议链接。

## 扩展指南

### 添加新的电梯类型

1. 在 `packages/core/src/models/` 创建新文件
2. 继承 `BaseElevator`
3. 实现 `getElevatorType()` 方法
4. 在 `models/index.ts` 中导出
5. 在页面应用中创建实例并注册

### 添加新功能

1. 在核心库中实现逻辑
2. 通过公共接口暴露
3. 在页面组件中调用
4. 添加相应的 UI 组件

## 性能优化

- ✅ 使用 `useEffect` 和 `setInterval` 实现状态轮询
- ✅ CSS 动画代替 JavaScript 动画
- ✅ Tailwind CSS 的 JIT 模式减小体积
- ✅ Vite 的快速 HMR 提升开发体验
- ✅ TypeScript 严格模式保证代码质量

## 待改进项

- [ ] 添加单元测试（Jest + React Testing Library）
- [ ] 添加 E2E 测试（Playwright）
- [ ] 实现真实的 WebSocket 通信
- [ ] 添加数据持久化（LocalStorage）
- [ ] 性能监控和分析
- [ ] 国际化支持（i18n）

---

**本文档持续更新中...** 📝
