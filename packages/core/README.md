# @elevator-system/core

智能电梯系统核心库 - 展示面向对象编程（OOP）四大核心思想

## 🎯 设计思想

### 1. 封装 (Encapsulation)

- 电梯的内部状态被封装在类中
- 只通过公共方法暴露接口
- 隐藏实现细节

### 2. 抽象 (Abstraction)

- 定义 `IElevator` 接口
- 创建 `BaseElevator` 抽象基类
- 关注"是什么"而非"怎么做"

### 3. 继承 (Inheritance)

- 多种电梯类型继承 `BaseElevator`
- `FreightElevator`、`ScenicElevator`、`VIPElevator`、`SmartElevator` 扩展功能
- 代码重用和清晰的层次结构

### 4. 多态 (Polymorphism)

- `ElevatorController` 统一管理不同类型电梯
- 通过接口调用，运行时绑定具体实现
- "一个接口，多种实现"

## 📦 安装

```bash
pnpm add @elevator-system/core
```

## 🚀 快速开始

```typescript
import { 
  PassengerElevator, 
  FreightElevator,
  ScenicElevator,
  VIPElevator,
  SmartElevator,
  ElevatorController 
} from '@elevator-system/core';

// 创建不同类型的电梯
const passenger = new PassengerElevator('E1', 20);
const freight = new FreightElevator('F1', 15);
const scenic = new ScenicElevator('S1', 30, [15, 25]);
const vip = new VIPElevator('V1', 30);
const smart = new SmartElevator('M1', 25);

// 创建控制器
const controller = new ElevatorController();
controller.registerElevator('E1', passenger);
controller.registerElevator('F1', freight);
controller.registerElevator('S1', scenic);
controller.registerElevator('V1', vip);
controller.registerElevator('M1', smart);

// 调用电梯
await controller.callElevator(1, 10);

// 获取所有状态
const statuses = controller.getAllStatus();
console.log(statuses);
```

## 📚 API 文档

### 类型定义

#### ElevatorType

```typescript
type ElevatorType = 'passenger' | 'freight' | 'scenic' | 'vip' | 'smart';
```

#### ElevatorState

```typescript
enum ElevatorState {
  IDLE = 'idle',
  MOVING_UP = 'moving_up',
  MOVING_DOWN = 'moving_down',
  DOOR_OPENING = 'door_opening',
  DOOR_CLOSING = 'door_closing',
  MAINTENANCE = 'maintenance',
  EMERGENCY = 'emergency'
}
```

#### ElevatorConfig

```typescript
interface ElevatorConfig {
  id: string;
  type: ElevatorType;
  name: string;
  maxFloor: number;
  minFloor: number;
  speed: number;
  capacity: number;
  maxWeight: number;
  doorTime: number;
}
```

### 核心类

#### BaseElevator (抽象基类)

**方法：**

- `moveTo(floor: number): Promise<void>` - 移动到指定楼层
- `openDoor(): Promise<void>` - 开门
- `closeDoor(): Promise<void>` - 关门
- `stop(): void` - 紧急停止
- `getStatus(): ElevatorStatus` - 获取状态
- `getConfig(): ElevatorConfig` - 获取配置

#### PassengerElevator (普通客梯)

```typescript
const elevator = new PassengerElevator('E1', 20);
await elevator.moveTo(10);
```

#### FreightElevator (货运电梯)

```typescript
const freight = new FreightElevator('F1', 15);
freight.checkItemSize(8); // 检查货物尺寸
await freight.moveTo(5);
```

#### ScenicElevator (观光电梯)

```typescript
const scenic = new ScenicElevator('S1', 30, [15, 25]);
scenic.toggleLighting(true); // 开启特殊照明
await scenic.moveTo(25);
```

#### VIPElevator (VIP电梯)

```typescript
const vip = new VIPElevator('V1', 30);
vip.addAuthorizedUser('user001', 3); // 添加授权用户
await vip.expressTo('user001', 20); // VIP直达
```

#### SmartElevator (智能电梯)

```typescript
const smart = new SmartElevator('M1', 25);
const nextFloor = smart.predictNextFloor(); // 预测下一个目标
const stats = smart.getLearningStats(); // 获取学习数据
await smart.moveTo(10);
```

#### ElevatorController (控制器)

```typescript
const controller = new ElevatorController();
controller.registerElevator('E1', elevator);
await controller.callElevator(1, 10, 0);
controller.emergencyStopAll();
```

## 🏗️ 架构设计

```
@elevator-system/core
├── types/              # 类型定义
│   └── index.ts
├── models/             # 电梯模型
│   ├── BaseElevator.ts       # 抽象基类
│   ├── PassengerElevator.ts  # 普通客梯
│   ├── FreightElevator.ts    # 货运电梯
│   ├── ScenicElevator.ts     # 观光电梯
│   ├── VIPElevator.ts        # VIP电梯
│   ├── SmartElevator.ts      # 智能电梯
│   └── index.ts
├── controllers/        # 控制器
│   ├── ElevatorController.ts
│   └── index.ts
└── index.ts           # 主入口
```

## 🎓 学习价值

这个库是学习 OOP 的绝佳示例：

1. **清晰的类层次结构**
2. **接口驱动的设计**
3. **钩子方法模式**
4. **策略模式应用**
5. **TypeScript 最佳实践**

## 📝 许可证

MIT
