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

  // 获取配置
  getConfig(): ElevatorConfig {
    return { ...this.config };
  }

  // 获取状态
  getStatus(): ElevatorStatus {
    return { ...this.status };
  }

  // 获取当前楼层
  getCurrentFloor(): number {
    return this.status.currentFloor;
  }

  // 获取状态
  getState(): ElevatorState {
    return this.status.state;
  }

  // 获取容量
  getCapacity(): number {
    return this.config.capacity;
  }

  // 获取当前载重
  getCurrentWeight(): number {
    return this.status.currentWeight;
  }

  // 移动到指定楼层
  async moveTo(floor: number): Promise<void> {
    // 验证楼层
    if (floor < this.config.minFloor || floor > this.config.maxFloor) {
      throw new Error(
        `Invalid floor: ${floor}. Must be between ${this.config.minFloor} and ${this.config.maxFloor}`
      );
    }

    if (floor === this.status.currentFloor) {
      return;
    }

    // 关门
    await this.closeDoor();

    // 设置目标楼层和状态
    this.status.targetFloor = floor;
    this.status.isMoving = true;
    this.status.state =
      floor > this.status.currentFloor ? ElevatorState.MOVING_UP : ElevatorState.MOVING_DOWN;

    // 移动前钩子
    await this.beforeMove(floor);

    // 模拟移动
    const distance = Math.abs(floor - this.status.currentFloor);
    const direction = floor > this.status.currentFloor ? 1 : -1;

    for (let i = 0; i < distance; i++) {
      await this.delay(this.config.speed);
      this.status.currentFloor += direction;

      // 移动中钩子
      await this.onMoving(this.status.currentFloor);
    }

    // 到达目标楼层
    this.status.targetFloor = null;
    this.status.isMoving = false;
    this.status.state = ElevatorState.IDLE;

    // 移动后钩子
    await this.afterMove(floor);

    // 开门
    await this.openDoor();
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

  // 关门
  async closeDoor(): Promise<void> {
    if (this.status.doorState === DoorState.CLOSED) {
      return;
    }

    this.status.doorState = DoorState.CLOSING;
    this.status.state = ElevatorState.DOOR_CLOSING;

    await this.delay(this.config.doorTime);

    this.status.doorState = DoorState.CLOSED;
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
