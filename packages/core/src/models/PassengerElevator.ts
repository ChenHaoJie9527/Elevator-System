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
      minFloor: -2,
      speed: 2000, // 移动速度：2000毫秒/层
      capacity: 10, // 最大载客量：10人
      maxWeight: 800, // 最大承重：800kg
      doorTime: 500, // 开关门动作时间：500毫秒（门从关到开/从开到关的时间）
      doorOpenTime: 5000, // 门保持打开时间：5000毫秒（5秒）- 标准停留时间，给乘客充足的进出时间
      color: 'bg-blue-500',
      description: '速度适中，承重一般，服务所有楼层（含地下停车场）',
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
