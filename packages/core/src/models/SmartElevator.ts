/**
 * 智能电梯
 * 展示智能调度和预测功能
 */

import type { ElevatorConfig, ElevatorRequest } from '../types/index.js';
import { BaseElevator } from './BaseElevator.js';

export class SmartElevator extends BaseElevator {
  private learningData: Map<number, number> = new Map(); // 楼层 -> 访问次数
  private peakHours: Set<number> = new Set(); // 高峰时段（小时）

  constructor(id: string, maxFloor: number = 25) {
    const config: ElevatorConfig = {
      id,
      type: 'smart',
      name: '智能电梯',
      icon: '🤖',
      maxFloor,
      minFloor: -2,
      speed: 1800, // 移动速度：1800毫秒/层（智能电梯速度较快）
      capacity: 12, // 最大载客量：12人（智能电梯容量大）
      maxWeight: 1000, // 最大承重：1000kg
      doorTime: 450, // 开关门动作时间：450毫秒（智能电梯门控制精准）
      doorOpenTime: 5000, // 门保持打开时间：5000毫秒（5秒）- 标准时间，未来可根据AI学习动态调整
      color: 'bg-green-500',
      description: '智能调度，自动学习，优化运行效率（全楼层智能服务）',
    };
    super(config);
    this.initializeLearning();
  }

  getElevatorType(): string {
    return '🤖 智能电梯';
  }

  // 初始化学习数据
  private initializeLearning(): void {
    // 假设一些常用楼层
    this.learningData.set(-2, 60); // 地下二层停车场
    this.learningData.set(-1, 70); // 地下一层停车场
    this.learningData.set(1, 100); // 大堂最常用
    this.learningData.set(10, 50);
    this.learningData.set(15, 30);

    // 高峰时段：8-9点，12-13点，17-18点
    this.peakHours.add(8);
    this.peakHours.add(9);
    this.peakHours.add(12);
    this.peakHours.add(13);
    this.peakHours.add(17);
    this.peakHours.add(18);
  }

  // 记录楼层访问
  private recordFloorAccess(floor: number): void {
    const count = this.learningData.get(floor) || 0;
    this.learningData.set(floor, count + 1);
  }

  // 预测下一个目标楼层
  predictNextFloor(): number {
    const currentHour = new Date().getHours();
    const isPeakHour = this.peakHours.has(currentHour);

    if (isPeakHour) {
      // 高峰期倾向于返回大堂
      return 1;
    }

    // 根据历史数据预测
    let maxCount = 0;
    let predictedFloor = 1;

    this.learningData.forEach((count, floor) => {
      if (count > maxCount && floor !== this.status.currentFloor) {
        maxCount = count;
        predictedFloor = floor;
      }
    });

    return predictedFloor;
  }

  // 智能排序请求队列
  addRequest(request: ElevatorRequest): void {
    super.addRequest(request);
    this.optimizeRequestQueue();
  }

  // 优化请求队列（智能调度算法）
  private optimizeRequestQueue(): void {
    // 按方向分组，减少往返次数
    const currentFloor = this.status.currentFloor;

    this.status.requestQueue.sort((a, b) => {
      // 优先级最高
      if (a.priority !== b.priority) {
        return b.priority - a.priority;
      }

      // 同方向优先
      const aDirection = a.targetFloor > currentFloor ? 1 : -1;
      const bDirection = b.targetFloor > currentFloor ? 1 : -1;

      if (aDirection !== bDirection) {
        return aDirection === 1 ? -1 : 1; // 优先向上
      }

      // 同方向按顺序排列
      return aDirection === 1 ? a.targetFloor - b.targetFloor : b.targetFloor - a.targetFloor;
    });
  }

  protected async afterMove(targetFloor: number): Promise<void> {
    // 记录访问数据用于学习
    this.recordFloorAccess(targetFloor);
  }

  // 获取学习统计数据
  getLearningStats(): Map<number, number> {
    return new Map(this.learningData);
  }
}
