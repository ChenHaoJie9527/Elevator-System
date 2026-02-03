# 测试文档

本项目使用 [Vitest](https://vitest.dev/) 作为测试框架。

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 运行测试

```bash
# 在根目录运行所有测试
pnpm test

# 监听模式（自动重新运行）
pnpm test:watch

# 查看测试 UI
pnpm test:ui

# 生成代码覆盖率报告
pnpm test:coverage
```

## 测试结构

测试文件位于 `src/models/` 目录下，与源代码放在一起：

```
src/
├── models/
│   ├── BaseElevator.ts        # 源代码
│   ├── BaseElevator.test.ts   # 测试文件
│   ├── PassengerElevator.ts
│   └── ...
```

## 测试配置

配置文件：`vitest.config.ts`

主要配置：

- **测试环境**: Node.js
- **全局 API**: 启用（无需导入 describe, it, expect）
- **测试超时**: 30秒（因为电梯移动需要时间）
- **代码覆盖率**: v8 提供商

## 编写测试

### 基本结构

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { PassengerElevator } from './PassengerElevator.js';

describe('电梯功能测试', () => {
  let elevator: PassengerElevator;

  beforeEach(() => {
    // 每个测试前创建新实例
    elevator = new PassengerElevator('TEST-1', 10);
  });

  it('应该正确初始化', () => {
    expect(elevator.getCurrentFloor()).toBe(-2);
  });

  it('应该能够移动到指定楼层', async () => {
    await elevator.moveTo(5);
    expect(elevator.getCurrentFloor()).toBe(5);
  });
});
```

### 测试异步操作

电梯的移动、开关门都是异步操作，测试时需要使用 `async/await`：

```typescript
it('应该能够向上移动', async () => {
  await elevator.moveTo(5);  // 等待移动完成
  expect(elevator.getCurrentFloor()).toBe(5);
});
```

### 测试错误处理

使用 `expect().rejects.toThrow()` 测试异步函数抛出的错误：

```typescript
it('应该拒绝无效楼层', async () => {
  await expect(elevator.moveTo(99)).rejects.toThrow('Invalid floor');
});
```

### 测试超时设置

如果某个测试需要更长时间，可以在测试中指定超时：

```typescript
it('长时间运行的测试', async () => {
  await elevator.moveTo(25);  // 可能需要很长时间
}, 60000);  // 60秒超时
```

## 自动关门功能测试场景

针对电梯自动关门功能，需要测试以下场景：

### 场景1：基本自动关门

```typescript
it('到达楼层后应该在5秒后自动关门', async () => {
  await elevator.moveTo(5);
  
  // 门应该是开启状态
  expect(elevator.getStatus().doorState).toBe(DoorState.OPEN);
  
  // 等待5秒
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  // 门应该自动关闭
  expect(elevator.getStatus().doorState).toBe(DoorState.CLOSED);
});
```

### 场景2：按住开门按钮

```typescript
it('按住开门按钮时门应该保持打开', async () => {
  await elevator.moveTo(5);
  
  // 按住开门按钮
  elevator.pressOpenButton();
  
  // 等待超过5秒
  await new Promise(resolve => setTimeout(resolve, 6000));
  
  // 门仍然应该是开启状态
  expect(elevator.getStatus().doorState).toBe(DoorState.OPEN);
  
  // 释放按钮
  elevator.releaseOpenButton();
  
  // 再等待5秒
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  // 现在门应该关闭
  expect(elevator.getStatus().doorState).toBe(DoorState.CLOSED);
});
```

### 场景3：关门中途有紧急请求

```typescript
it('关门过程中收到当前楼层请求应该重新开门', async () => {
  await elevator.moveTo(5);
  
  // 等待开始自动关门（4秒后）
  await new Promise(resolve => setTimeout(resolve, 4000));
  
  // 在关门过程中添加当前楼层的请求
  elevator.addRequest({
    targetFloor: 5,
    timestamp: Date.now(),
    priority: 2,  // 紧急
  });
  
  // 等待一下
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 门应该重新开启
  expect(elevator.getStatus().doorState).toBe(DoorState.OPEN);
});
```

### 场景4：关门过程中按开门按钮

```typescript
it('关门过程中按开门按钮应该重新开门', async () => {
  await elevator.moveTo(5);
  
  // 等待开始自动关门
  await new Promise(resolve => setTimeout(resolve, 4000));
  
  // 门应该正在关闭或即将关闭
  const statusBeforePress = elevator.getStatus().doorState;
  expect([DoorState.OPEN, DoorState.CLOSING]).toContain(statusBeforePress);
  
  // 按下开门按钮
  elevator.pressOpenButton();
  elevator.releaseOpenButton();
  
  // 等待一下
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 门应该重新开启
  expect(elevator.getStatus().doorState).toBe(DoorState.OPEN);
});
```

## 常用命令

```bash
# 只运行特定文件的测试
pnpm test BaseElevator.test.ts

# 只运行匹配特定名称的测试
pnpm test -t "移动功能"

# 监听模式（文件变化时自动运行）
pnpm test:watch

# 生成并查看覆盖率报告
pnpm test:coverage
# 报告将生成在 coverage/ 目录下，打开 coverage/index.html 查看
```

## 调试测试

在 VS Code 中调试测试：

1. 在测试文件中设置断点
2. 点击测试代码上方的 "Debug" 按钮
3. 或者使用 VS Code 的调试功能

或者使用浏览器 UI 调试：

```bash
pnpm test:ui
```

这将打开一个浏览器界面，可以可视化地查看和调试测试。

## 最佳实践

1. **每个测试应该独立**：使用 `beforeEach` 创建新的实例
2. **测试应该快速**：如果可能，使用模拟（mock）来加速
3. **清晰的测试描述**：测试名称应该描述预期行为
4. **一个测试一个断言**：每个测试专注于一个功能点
5. **测试边界情况**：不仅测试正常流程，也要测试错误情况

## 持续集成

测试会在 CI/CD 流程中自动运行。确保所有测试通过后再提交代码。

```bash
# 提交前运行测试
pnpm test

# 检查代码质量
pnpm lint

# 格式化代码
pnpm format
```
