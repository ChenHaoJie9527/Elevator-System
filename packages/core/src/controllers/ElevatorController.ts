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

export class ElevatorController implements IElevatorController {
  protected elevators: Map<string, IElevator> = new Map();
  private requestHistory: ElevatorRequest[] = [];

  // 注册电梯
  registerElevator(id: string, elevator: IElevator): void {
    this.elevators.set(id, elevator);
  }

  // 调用电梯
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

  // 获取电梯
  getElevator(id: string): IElevator | undefined {
    return this.elevators.get(id);
  }

  // 获取所有状态
  getAllStatus(): ElevatorStatus[] {
    return Array.from(this.elevators.values()).map((elevator) => elevator.getStatus());
  }

  // 紧急停止所有电梯
  emergencyStopAll(): void {
    this.elevators.forEach((elevator) => {
      elevator.stop();
    });
  }

  // 选择最优电梯（多态应用）
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
