/**
 * 观光电梯
 * 展示继承和特殊功能扩展
 */

import type { ElevatorConfig } from '../types/index.js';
import { BaseElevator } from './BaseElevator.js';

export class ScenicElevator extends BaseElevator {
  private readonly scenicFloors: number[];

  constructor(id: string, maxFloor: number = 30, scenicFloors: number[] = []) {
    const config: ElevatorConfig = {
      id,
      type: 'scenic',
      name: '观光电梯',
      icon: '🎡',
      maxFloor,
      minFloor: 1,
      speed: 2500,
      capacity: 8,
      maxWeight: 600,
      doorTime: 600,
      color: 'bg-purple-500',
      description: '速度缓慢，可欣赏风景，配备特殊照明',
    };
    super(config);
    this.scenicFloors = scenicFloors;
  }

  getElevatorType(): string {
    return '🎡 观光电梯';
  }

  // 特殊功能：切换照明
  toggleLighting(enabled: boolean): void {
    this.lightingEnabled = enabled;
  }

  // 检查是否是观景楼层
  isScenicFloor(floor: number): boolean {
    return this.scenicFloors.includes(floor);
  }

  protected async onMoving(currentFloor: number): Promise<void> {
    // 在观景楼层可以放慢速度
    if (this.isScenicFloor(currentFloor)) {
      await this.delay(500); // 额外停留时间欣赏风景
    }
  }
}
