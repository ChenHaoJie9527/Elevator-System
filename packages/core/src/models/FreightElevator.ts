/**
 * 货运电梯
 * 展示继承和扩展功能
 */

import type { ElevatorConfig } from '../types/index.js';
import { BaseElevator } from './BaseElevator.js';

export class FreightElevator extends BaseElevator {
  private readonly maxItemSize: number;

  constructor(id: string, maxFloor: number = 15) {
    const config: ElevatorConfig = {
      id,
      type: 'freight',
      name: '货运电梯',
      icon: '📦',
      maxFloor,
      minFloor: -2,
      speed: 3500,
      capacity: 3,
      maxWeight: 3000,
      doorTime: 1000,
      color: 'bg-orange-500',
      description: '速度慢，承重大，适合运输货物（可达地下停车场）',
    };
    super(config);
    this.maxItemSize = 10; // 最大货物尺寸（立方米）
  }

  getElevatorType(): string {
    return '📦 货运电梯';
  }

  // 扩展功能：检查货物尺寸
  checkItemSize(size: number): boolean {
    return size <= this.maxItemSize;
  }

  protected async beforeMove(_targetFloor: number): Promise<void> {
    // 货物运输提示
  }
}
