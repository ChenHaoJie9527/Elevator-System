/**
 * 电梯控制器
 * 展示 OOP 的多态
 */

import type {
  ElevatorRequest,
  ElevatorStatus,
  IElevator,
  IElevatorController,
} from '../types/index.js';

/**
 * @description 电梯控制器
 * @function registerElevator - 注册电梯
 * @function callElevator - 调用电梯
 * @function getElevator - 获取电梯
 * @function getAllStatus - 获取所有电梯状态
 * @function emergencyStopAll - 紧急停止所有电梯
 * @function selectBestElevator - 选择最优电梯
 * @example
 * ```typescript
 * const controller = new ElevatorController();
 * controller.registerElevator('E1', elevator);
 * await controller.callElevator(1, 10);
 * const elevator = controller.getElevator('E1');
 * const statuses = controller.getAllStatus();
 * controller.emergencyStopAll();
 * ```
 */
export class ElevatorController implements IElevatorController {
  protected elevators: Map<string, IElevator> = new Map();
  private requestHistory: ElevatorRequest[] = [];

  /**
   * @description 注册电梯
   * @param id - 电梯ID
   * @param elevator - 电梯实例
   */
  registerElevator(id: string, elevator: IElevator): void {
    this.elevators.set(id, elevator);
  }

  /**
   * @description 调用电梯
   * @param fromFloor - 出发楼层
   * @param toFloor - 目标楼层
   * @param priority - 优先级
   */
  async callElevator(fromFloor: number, toFloor: number, priority: number = 0): Promise<void> {
    const bestElevator = this.selectBestElevator(fromFloor, toFloor);

    if (!bestElevator) {
      throw new Error('No available elevator');
    }

    const request: ElevatorRequest = {
      targetFloor: toFloor,
      timestamp: Date.now(),
      priority,
    };

    this.requestHistory.push(request);

    // 前往接人
    await bestElevator.moveTo(fromFloor);

    // 运送乘客
    bestElevator.addRequest(request);
    await bestElevator.processNextRequest();
  }

  /**
   * @description 获取电梯
   * @param id - 电梯ID
   * @returns 电梯实例
   */
  getElevator(id: string): IElevator | undefined {
    return this.elevators.get(id);
  }

  /**
   * @description 获取所有电梯状态
   * @returns 电梯状态数组
   */
  getAllStatus(): ElevatorStatus[] {
    return Array.from(this.elevators.values()).map((elevator) => elevator.getStatus());
  }

  /**
   * @description 紧急停止所有电梯
   */
  emergencyStopAll(): void {
    this.elevators.forEach((elevator) => {
      elevator.stop();
    });
  }

  /**
   * @description 选择最优电梯（多态应用）
   * @param fromFloor - 出发楼层
   * @param _toFloor - 目标楼层
   * @returns 最优电梯实例
   */
  protected selectBestElevator(fromFloor: number, _toFloor: number): IElevator | null {
    let bestElevator: IElevator | null = null;
    let minDistance = Infinity;

    this.elevators.forEach((elevator) => {
      const currentFloor = elevator.getCurrentFloor();
      const distance = Math.abs(currentFloor - fromFloor);

      if (distance < minDistance) {
        minDistance = distance;
        bestElevator = elevator;
      }
    });

    return bestElevator;
  }
}
