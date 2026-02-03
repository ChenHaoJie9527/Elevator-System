/**
 * 观光电梯
 * 展示继承和特殊功能扩展
 */

import type { ElevatorConfig } from '../types/index.js';
import { BaseElevator } from './BaseElevator.js';

/**
 * 观光电梯
 * 展示继承和特殊功能扩展
 * 实现观光电梯的特殊功能，如切换照明、检查观景楼层等
 * @param id 电梯ID
 * @param maxFloor 最大楼层
 * @param scenicFloors 观景楼层
 * @example
 * ```typescript
 * const scenic = new ScenicElevator('S1', 30, [10, 15]);
 * scenic.toggleLighting(true);
 * scenic.isScenicFloor(10);
 * ```
 */
export class ScenicElevator extends BaseElevator {
  private readonly scenicFloors: number[];
  private lightingEnabled: boolean = true;

  constructor(id: string, maxFloor: number = 30, scenicFloors: number[] = []) {
    const config: ElevatorConfig = {
      id,
      type: 'scenic',
      name: '观光电梯',
      icon: '🎡',
      maxFloor,
      minFloor: -2,
      speed: 2500, // 移动速度：2500毫秒/层（观光电梯速度适中，让乘客欣赏风景）
      capacity: 8, // 最大载客量：8人
      maxWeight: 600, // 最大承重：600kg
      doorTime: 600, // 开关门动作时间：600毫秒（观光电梯通常是玻璃门，开关门稍慢）
      doorOpenTime: 7000, // 门保持打开时间：7000毫秒（7秒）- 给乘客更多时间拍照和欣赏景色
      color: 'bg-purple-500',
      description: '速度缓慢，可欣赏风景，配备特殊照明（全楼层服务）',
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

  // 获取照明状态
  getLightingEnabled(): boolean {
    return this.lightingEnabled;
  }

  protected async onMoving(currentFloor: number): Promise<void> {
    // 在观景楼层可以放慢速度
    if (this.isScenicFloor(currentFloor) && this.lightingEnabled) {
      await this.delay(500); // 额外停留时间欣赏风景
    }
  }
}
