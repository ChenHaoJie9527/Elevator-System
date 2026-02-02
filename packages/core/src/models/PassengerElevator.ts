/**
 * 普通客梯
 * 展示 OOP 的继承
 */

import type { ElevatorConfig } from '../types/index.js';
import { BaseElevator } from './BaseElevator.js';

export class PassengerElevator extends BaseElevator {
  constructor(id: string, maxFloor: number = 20) {
    const config: ElevatorConfig = {
      id,
      type: 'passenger',
      name: '普通客梯',
      icon: '🏢',
      maxFloor,
      minFloor: 1,
      speed: 2000,
      capacity: 10,
      maxWeight: 800,
      doorTime: 500,
      color: 'bg-blue-500',
      description: '速度适中，承重一般，服务所有楼层',
    };
    super(config);
  }

  getElevatorType(): string {
    return '🏢 普通客梯';
  }

  protected async beforeMove(_targetFloor: number): Promise<void> {
    // 可以添加欢迎语等逻辑
  }
}
