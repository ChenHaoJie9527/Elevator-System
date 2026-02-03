/**
 * 电梯抽象基类
 * 实现通用逻辑，展示 OOP 的封装和抽象
 */

import {
  DoorState,
  type ElevatorConfig,
  type ElevatorRequest,
  ElevatorState,
  type ElevatorStatus,
  type IElevator,
} from '../types/index.js';

/**
 * 电梯抽象基类
 * 实现通用逻辑，展示 OOP 的封装和抽象
 * 所有电梯类型共享基类的 `moveTo()`、`openDoor()` 等方法，避免代码重复
 * 子类可以重写钩子方法 `beforeMove()`、`onMoving()`、`afterMove()` 来实现特定行为
 * 延迟辅助方法 `delay()` 用于模拟电梯移动时间
 * 验证楼层是否在有效范围内
 * @example
 * ```typescript
 * const elevator = new PassengerElevator('E1', 20);
 * await elevator.moveTo(10);
 * ```
 * ```typescript
 * const elevator = new FreightElevator('F1', 15);
 * await elevator.moveTo(5);
 * ```
 * ```typescript
 * const elevator = new ScenicElevator('S1', 30, [15, 25]);
 * await elevator.moveTo(25);
 * ```
 */
export abstract class BaseElevator implements IElevator {
  protected config: ElevatorConfig;
  protected status: ElevatorStatus;

  constructor(config: ElevatorConfig) {
    this.config = config;
    this.status = {
      currentFloor: config.minFloor || 1,
      state: ElevatorState.IDLE,
      doorState: DoorState.CLOSED,
      targetFloor: null,
      currentWeight: 0,
      passengerCount: 0,
      isMoving: false,
      requestQueue: [],
    };
  }

  // 抽象方法：子类必须实现
  abstract getElevatorType(): string;

  /**
   * 获取配置
   * @returns 电梯配置
   */
  getConfig(): ElevatorConfig {
    return { ...this.config };
  }

  /**
   * 获取状态
   * @returns 电梯状态
   */
  getStatus(): ElevatorStatus {
    return { ...this.status };
  }

  /**
   * 获取当前楼层
   * @returns 当前楼层
   */
  getCurrentFloor(): number {
    return this.status.currentFloor;
  }

  /**
   * 获取状态
   * @returns 电梯状态
   */
  getState(): ElevatorState {
    return this.status.state;
  }

  /**
   * 获取容量
   * @returns 电梯容量
   */
  getCapacity(): number {
    return this.config.capacity;
  }

  /**
   * 获取当前载重
   * @returns 当前载重
   */
  getCurrentWeight(): number {
    return this.status.currentWeight;
  }

  /**
   * 移动到指定楼层
   * 完整的电梯运行流程：
   * 1. 验证目标楼层是否有效
   * 2. 如果已在目标楼层，直接返回
   * 3. 关闭电梯门
   * 4. 移动到目标楼层（逐层移动）
   * 5. 到达后打开电梯门
   * 6. 门保持打开状态一段时间（让乘客进出）
   * 7. 自动关闭电梯门
   * 
   * @param floor 目标楼层
   * @returns 移动到指定楼层的 Promise，完成整个流程后 resolve
   */
  async moveTo(floor: number): Promise<void> {
    // ==================== 第一步：验证楼层 ====================
    // 检查目标楼层是否在有效范围内（最低楼层 ~ 最高楼层）
    if (floor < this.config.minFloor || floor > this.config.maxFloor) {
      throw new Error(
        `Invalid floor: ${floor}. Must be between ${this.config.minFloor} and ${this.config.maxFloor}`
      );
    }

    // ==================== 第二步：检查是否已在目标楼层 ====================
    // 如果电梯已经在目标楼层，不需要移动，直接返回
    if (floor === this.status.currentFloor) {
      return;
    }

    // ==================== 第三步：关门准备移动 ====================
    // 移动前必须先关闭电梯门，确保安全
    await this.closeDoor();

    // ==================== 第四步：设置电梯状态 ====================
    // 记录目标楼层
    this.status.targetFloor = floor;
    // 标记电梯正在移动
    this.status.isMoving = true;
    // 根据移动方向设置状态：向上或向下
    this.status.state =
      floor > this.status.currentFloor ? ElevatorState.MOVING_UP : ElevatorState.MOVING_DOWN;

    // ==================== 第五步：调用移动前钩子 ====================
    // 子类可以重写此方法，在移动前执行自定义逻辑
    // 例如：播放语音提示、记录日志等
    await this.beforeMove(floor);

    // ==================== 第六步：执行移动 ====================
    // 计算需要移动的楼层数（绝对值）
    const distance = Math.abs(floor - this.status.currentFloor);

    // 确定移动方向：向上为 1，向下为 -1
    const direction = floor > this.status.currentFloor ? 1 : -1;

    // 逐层移动（模拟电梯真实移动过程）
    // 例如：从1楼到5楼，需要经过2楼、3楼、4楼，最后到达5楼
    for (let i = 0; i < distance; i++) {
      // 等待移动一层的时间（由 config.speed 配置）
      await this.delay(this.config.speed);

      // 更新当前楼层
      this.status.currentFloor += direction;

      // 调用移动中钩子（每经过一层都会调用）
      // 子类可以重写此方法，例如：显示经过的楼层、检测中途请求等
      await this.onMoving(this.status.currentFloor);
    }

    // ==================== 第七步：到达目标楼层，更新状态 ====================
    // 清除目标楼层（已到达）
    this.status.targetFloor = null;
    // 取消移动标记
    this.status.isMoving = false;
    // 设置为空闲状态
    this.status.state = ElevatorState.IDLE;

    // ==================== 第八步：调用移动后钩子 ====================
    // 子类可以重写此方法，在到达后执行自定义逻辑
    // 例如：记录访问数据、播放到达提示音等
    await this.afterMove(floor);

    // ==================== 第九步：开门让乘客进出 ====================
    // 到达目标楼层后自动打开电梯门
    await this.openDoor();

    // ==================== 第十步：门保持打开状态 ====================
    // 等待一段时间，让乘客有足够时间进出电梯
    // 等待时间由 config.doorOpenTime 配置（通常为 5000 毫秒 = 5 秒）
    // 注意：这里使用简单的延迟，未来可以扩展为可中断的等待
    // （例如：有人按住开门按钮、有新请求等情况）
    await this.delay(this.config.doorOpenTime);

    // ==================== 第十一步：自动关门 ====================
    // 等待时间结束后，自动关闭电梯门
    // 这是场景1的核心实现：基本自动关门功能
    await this.closeDoor();
  }

  // 开门
  async openDoor(): Promise<void> {
    if (this.status.doorState === DoorState.OPEN) {
      return;
    }

    this.status.doorState = DoorState.OPENING;
    this.status.state = ElevatorState.DOOR_OPENING;

    await this.delay(this.config.doorTime);

    this.status.doorState = DoorState.OPEN;
    this.status.state = ElevatorState.IDLE;
  }

  /**
   * 关闭电梯门
   * 门的关闭过程：
   * 1. 检查门是否已经关闭，如果已关闭则直接返回
   * 2. 设置门状态为"正在关闭"
   * 3. 设置电梯状态为"关门中"
   * 4. 等待关门时间（模拟门关闭的物理过程）
   * 5. 设置门状态为"已关闭"
   * 6. 恢复电梯状态为"空闲"
   */
  async closeDoor(): Promise<void> {
    // 如果门已经关闭，不需要重复关门
    if (this.status.doorState === DoorState.CLOSED) {
      return;
    }

    // 设置门状态：正在关闭
    this.status.doorState = DoorState.CLOSING;
    // 设置电梯状态：关门中
    this.status.state = ElevatorState.DOOR_CLOSING;

    // 等待关门时间（门从打开到完全关闭的物理过程）
    await this.delay(this.config.doorTime);

    // 门已完全关闭
    this.status.doorState = DoorState.CLOSED;
    // 关门完成后，电梯恢复空闲状态（重要：这样电梯才能接受新的指令）
    this.status.state = ElevatorState.IDLE;
  }

  // 停止
  stop(): void {
    this.status.state = ElevatorState.EMERGENCY;
    this.status.isMoving = false;
    this.status.targetFloor = null;
  }

  // 添加请求
  addRequest(request: ElevatorRequest): void {
    this.status.requestQueue.push(request);
    // 按优先级和时间排序
    this.status.requestQueue.sort((a, b) => {
      if (a.priority !== b.priority) {
        return b.priority - a.priority;
      }
      return a.timestamp - b.timestamp;
    });
  }

  // 处理下一个请求
  async processNextRequest(): Promise<void> {
    if (this.status.requestQueue.length === 0) {
      return;
    }

    const request = this.status.requestQueue.shift()!;
    await this.moveTo(request.targetFloor);
  }

  // 钩子方法：移动前
  protected async beforeMove(_targetFloor: number): Promise<void> {
    // 子类可以重写
  }

  // 钩子方法：移动中
  protected async onMoving(_currentFloor: number): Promise<void> {
    // 子类可以重写
  }

  // 钩子方法：移动后
  protected async afterMove(_targetFloor: number): Promise<void> {
    // 子类可以重写
  }

  // 延迟辅助方法
  protected delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
