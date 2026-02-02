# 🚀 快速开始指南

欢迎使用智能电梯系统演示项目！本指南将帮助你在 5 分钟内运行项目。

## 📋 前置要求

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0（推荐使用 pnpm）

```bash
# 安装 pnpm（如果尚未安装）
npm install -g pnpm
```

## 🎯 三步启动

### 1️⃣ 安装依赖

```bash
# 在项目根目录执行
pnpm install
```

### 2️⃣ 启动开发服务器

```bash
# 启动 Web 演示应用
pnpm dev
```

### 3️⃣ 打开浏览器

访问 <http://localhost:5173/> （如果端口被占用，会自动使用其他端口）

## 🎮 使用指南

### 基本操作

1. **手动控制电梯**
   - 在左侧控制面板选择"手动控制"标签
   - 设置起始楼层和目标楼层
   - 选择优先级（普通/高/紧急）
   - 点击"调用电梯"按钮

2. **场景演示**
   - 在左侧控制面板选择"场景演示"标签
   - 点击预设场景按钮：
     - 🌅 早高峰 - 模拟多人同时使用
     - 👑 VIP直达 - 高优先级快速到达
     - 📦 货物运输 - 货运电梯演示

3. **查看电梯详情**
   - 将鼠标悬停在电梯图标上
   - 查看 Tooltip 显示的详细信息（速度、载重、服务楼层等）

4. **了解项目**
   - 点击右上角"关于"按钮
   - 查看项目详细介绍和技术栈

## 🏗️ 项目结构速览

```
elevator-system/
├── packages/
│   ├── core/              # 核心电梯系统库
│   │   ├── src/
│   │   │   ├── models/    # 电梯模型（5种类型）
│   │   │   ├── controllers/ # 控制器
│   │   │   └── types/     # TypeScript 类型定义
│   │   └── package.json
│   │
│   └── page/              # Web 前端演示
│       ├── src/
│       │   ├── components/ # React 组件
│       │   ├── App.tsx    # 主应用
│       │   └── main.tsx   # 入口文件
│       └── package.json
│
├── biome.json             # 代码规范配置（统一管理）
├── pnpm-workspace.yaml    # Monorepo 配置
└── package.json           # 根配置
```

## 🎨 技术特色

### 核心技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| TypeScript | 5.9+ | 类型安全 |
| React | 19.2+ | UI 框架 |
| Vite | 7.3+ | 构建工具 |
| Tailwind CSS | 4.x | 样式方案 |
| Ant Design | 6.2+ | 企业级 UI 组件库 |
| Biome | 2.3+ | 代码格式化 |

### Ant Design 组件使用

本项目使用 **Ant Design** 提供企业级的交互体验：

- ✨ **Button** - 多种类型和状态的按钮
- 📑 **Tabs** - 控制面板的标签切换
- 💬 **Tooltip** - 电梯详情悬浮提示
- 🗨️ **Modal** - 关于系统的对话框
- 📋 **Select** - 楼层选择器
- 📦 **Card** - 卡片容器
- 📐 **Space** - 间距管理

**特点**：

- 开箱即用的企业级组件
- 完善的国际化支持（中文）
- 优秀的可访问性
- 活跃的社区和完善的文档

## 📚 更多文档

- **[项目总览](./README.md)** - 完整的项目介绍
- **[项目结构](./PROJECT_STRUCTURE.md)** - 详细的目录说明
- **[Ant Design 集成](./ANT_DESIGN_INTEGRATION.md)** - Ant Design 使用指南
- **[更新日志](./CHANGELOG.md)** - 版本更新记录

## 🛠️ 开发命令

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建所有包
pnpm build

# 只构建核心库
pnpm build:core

# 只构建前端应用
pnpm build:page

# 代码检查
pnpm lint

# 自动修复代码风格
pnpm lint:fix

# 格式化代码
pnpm format

# 预览构建结果
pnpm preview
```

## 🎓 学习要点

### OOP 四大核心

1. **封装（Encapsulation）**
   - 电梯内部状态通过类封装
   - 只暴露必要的公共方法

2. **抽象（Abstraction）**
   - `IElevator` 接口定义抽象行为
   - 隐藏具体实现细节

3. **继承（Inheritance）**
   - `BaseElevator` 基类提供通用功能
   - 5 种电梯类型继承基类

4. **多态（Polymorphism）**
   - 同一接口，不同实现
   - 控制器统一管理不同类型电梯

### 设计模式

- 🏭 **抽象工厂模式** - 电梯实例创建
- 🎯 **策略模式** - 智能调度算法
- 👁️ **观察者模式** - 状态更新通知
- 📝 **模板方法模式** - 钩子函数扩展

## 🐛 常见问题

### Q: 端口被占用怎么办？

A: Vite 会自动尝试其他端口（5174、5175 等），查看终端输出的实际端口。

### Q: 如何修改电梯配置？

A: 编辑 `packages/page/src/App.tsx` 中的电梯初始化代码：

```typescript
const passenger = new PassengerElevator('E1', 30); // 改为 30 层
```

### Q: 如何添加新的电梯类型？

A:

1. 在 `packages/core/src/models/` 创建新类
2. 继承 `BaseElevator`
3. 实现 `getElevatorType()` 方法
4. 在 `models/index.ts` 导出

### Q: 代码检查失败怎么办？

A: 运行自动修复命令：

```bash
pnpm lint:fix
```

## 🎉 开始探索

现在你已经准备好了！试试这些操作：

1. 🎯 点击"调用电梯"，观察电梯运动
2. 🚪 注意门的开关动画
3. 🖱️ 悬停在电梯上查看详细信息
4. 📑 切换"场景演示"标签
5. ℹ️ 点击"关于"按钮了解项目

**祝你使用愉快！** 🚀

如有问题，请查看详细文档或提交 Issue。
