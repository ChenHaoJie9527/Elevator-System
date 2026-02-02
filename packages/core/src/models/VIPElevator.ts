/**
 * VIP 电梯
 * 展示访问控制和权限管理
 */

import type { ElevatorConfig, IAccessControl } from '../types/index.js';
import { BaseElevator } from './BaseElevator.js';

export class VIPElevator extends BaseElevator implements IAccessControl {
  private authorizedUsers: Set<string> = new Set();
  private accessLevels: Map<string, number> = new Map();

  constructor(id: string, maxFloor: number = 30) {
    const config: ElevatorConfig = {
      id,
      type: 'vip',
      name: 'VIP 电梯',
      icon: '👑',
      maxFloor,
      minFloor: -2,
      speed: 1500,
      capacity: 6,
      maxWeight: 500,
      doorTime: 400,
      color: 'bg-yellow-500',
      description: '速度快，仅限VIP使用，配备身份认证（含专属停车位）',
    };
    super(config);
  }

  getElevatorType(): string {
    return '👑 VIP 电梯';
  }

  // 实现访问控制接口
  validateAccess(userId: string, targetFloor: number): boolean {
    if (!this.authorizedUsers.has(userId)) {
      return false;
    }
    const userLevel = this.getAccessLevel(userId);
    // 假设高楼层需要更高的权限
    const requiredLevel = Math.floor(targetFloor / 10);
    return userLevel >= requiredLevel;
  }

  getAccessLevel(userId: string): number {
    return this.accessLevels.get(userId) || 0;
  }

  // 添加授权用户
  addAuthorizedUser(userId: string, level: number = 1): void {
    this.authorizedUsers.add(userId);
    this.accessLevels.set(userId, level);
  }

  // 移除授权
  removeAuthorizedUser(userId: string): void {
    this.authorizedUsers.delete(userId);
    this.accessLevels.delete(userId);
  }

  // VIP 专属：直达功能（无需排队）
  async expressTo(userId: string, floor: number): Promise<void> {
    if (!this.validateAccess(userId, floor)) {
      throw new Error('Access denied: Insufficient privileges');
    }
    await this.moveTo(floor);
  }

  protected async beforeMove(_targetFloor: number): Promise<void> {
    // VIP 移动前可以播放欢迎音乐等
  }
}
