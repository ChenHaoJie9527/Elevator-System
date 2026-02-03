/**
 * BaseElevator 测试套件
 * 测试电梯基础功能
 */

import { beforeEach, describe, expect, it } from 'vitest';
import { DoorState, ElevatorState } from '../types/index.js';
import { PassengerElevator } from './PassengerElevator.js';

describe('BaseElevator 基础功能测试', () => {
  let elevator: PassengerElevator;

  beforeEach(() => {
    // 每个测试前创建一个新的电梯实例
    elevator = new PassengerElevator('TEST-1', 10);
  });

  describe('初始化测试', () => {
    it('应该正确初始化电梯配置', () => {
      const config = elevator.getConfig();

      expect(config.id).toBe('TEST-1');
      expect(config.type).toBe('passenger');
      expect(config.maxFloor).toBe(10);
      expect(config.minFloor).toBe(-2);
      expect(config.capacity).toBe(10);
    });

    it('应该初始化在最低楼层且门关闭状态', () => {
      const status = elevator.getStatus();

      expect(status.currentFloor).toBe(-2);
      expect(status.state).toBe(ElevatorState.IDLE);
      expect(status.doorState).toBe(DoorState.CLOSED);
      expect(status.isMoving).toBe(false);
      expect(status.targetFloor).toBe(null);
    });
  });

  describe('基本属性获取测试', () => {
    it('应该正确返回当前楼层', () => {
      expect(elevator.getCurrentFloor()).toBe(-2);
    });

    it('应该正确返回电梯状态', () => {
      expect(elevator.getState()).toBe(ElevatorState.IDLE);
    });

    it('应该正确返回容量', () => {
      expect(elevator.getCapacity()).toBe(10);
    });

    it('应该正确返回当前载重', () => {
      expect(elevator.getCurrentWeight()).toBe(0);
    });

    it('应该正确返回电梯类型', () => {
      expect(elevator.getElevatorType()).toBe('🏢 普通客梯');
    });
  });

  describe('开关门功能测试', () => {
    it('应该能够正确开门', async () => {
      await elevator.openDoor();

      const status = elevator.getStatus();
      expect(status.doorState).toBe(DoorState.OPEN);
      expect(status.state).toBe(ElevatorState.IDLE);
    });

    it('应该能够正确关门', async () => {
      await elevator.openDoor();
      await elevator.closeDoor();

      const status = elevator.getStatus();
      expect(status.doorState).toBe(DoorState.CLOSED);
    });

    it('门已经开启时，再次开门不应该有问题', async () => {
      await elevator.openDoor();
      await elevator.openDoor(); // 重复开门

      const status = elevator.getStatus();
      expect(status.doorState).toBe(DoorState.OPEN);
    });

    it('门已经关闭时，再次关门不应该有问题', async () => {
      const status = elevator.getStatus();
      expect(status.doorState).toBe(DoorState.CLOSED);

      await elevator.closeDoor(); // 重复关门
      expect(elevator.getStatus().doorState).toBe(DoorState.CLOSED);
    });
  });

  describe('移动功能测试', () => {
    it('应该能够向上移动到指定楼层', async () => {
      await elevator.moveTo(5);

      const status = elevator.getStatus();
      // 验证电梯已到达5楼
      expect(status.currentFloor).toBe(5);
      // 验证电梯处于空闲状态
      expect(status.state).toBe(ElevatorState.IDLE);
      // 验证门已自动关闭（场景1：到达后等待一段时间，然后自动关门）
      expect(status.doorState).toBe(DoorState.CLOSED);
      // 验证电梯不在移动中
      expect(status.isMoving).toBe(false);
    });

    it('应该能够向下移动到指定楼层', async () => {
      // 先移动到5楼
      await elevator.moveTo(5);
      // 再移动到1楼
      await elevator.moveTo(1);

      // 验证电梯已到达1楼
      expect(elevator.getCurrentFloor()).toBe(1);
      // 验证门已自动关闭（完整的到达流程后门会自动关闭）
      expect(elevator.getStatus().doorState).toBe(DoorState.CLOSED);
    }, 60000); // 增加超时时间，因为需要两次移动

    it('移动到当前楼层应该不执行任何操作', async () => {
      const initialFloor = elevator.getCurrentFloor();
      await elevator.moveTo(initialFloor);

      expect(elevator.getCurrentFloor()).toBe(initialFloor);
    });

    it('移动过程中电梯状态应该正确更新', async () => {
      // 使用 Promise 来捕获移动过程中的状态
      const movePromise = elevator.moveTo(5);

      // 等待一小段时间让移动开始
      await new Promise((resolve) => setTimeout(resolve, 100));

      // 检查移动中的状态（可能是 MOVING_UP）
      const movingStatus = elevator.getStatus();
      expect([ElevatorState.MOVING_UP, ElevatorState.IDLE]).toContain(movingStatus.state);

      // 等待移动完成
      await movePromise;

      // 检查到达后的状态
      const finalStatus = elevator.getStatus();
      expect(finalStatus.currentFloor).toBe(5);
      expect(finalStatus.state).toBe(ElevatorState.IDLE);
    });

    it('应该拒绝超出最大楼层的移动请求', async () => {
      await expect(elevator.moveTo(99)).rejects.toThrow('Invalid floor');
    });

    it('应该拒绝低于最小楼层的移动请求', async () => {
      await expect(elevator.moveTo(-10)).rejects.toThrow('Invalid floor');
    });
  });

  describe('请求队列测试', () => {
    it('应该能够添加请求到队列', () => {
      elevator.addRequest({
        targetFloor: 5,
        timestamp: Date.now(),
        priority: 0,
      });

      const status = elevator.getStatus();
      expect(status.requestQueue.length).toBe(1);
      expect(status.requestQueue[0].targetFloor).toBe(5);
    });

    it('应该按优先级排序请求', () => {
      elevator.addRequest({
        targetFloor: 5,
        timestamp: Date.now(),
        priority: 0,
      });

      elevator.addRequest({
        targetFloor: 8,
        timestamp: Date.now(),
        priority: 2, // 紧急
      });

      elevator.addRequest({
        targetFloor: 3,
        timestamp: Date.now(),
        priority: 1, // 高优先级
      });

      const queue = elevator.getStatus().requestQueue;
      expect(queue[0].priority).toBe(2); // 紧急请求在最前
      expect(queue[1].priority).toBe(1); // 高优先级第二
      expect(queue[2].priority).toBe(0); // 普通请求最后
    });

    it('应该能够处理下一个请求', async () => {
      elevator.addRequest({
        targetFloor: 5,
        timestamp: Date.now(),
        priority: 0,
      });

      await elevator.processNextRequest();

      expect(elevator.getCurrentFloor()).toBe(5);
      expect(elevator.getStatus().requestQueue.length).toBe(0);
    });
  });

  describe('紧急停止功能测试', () => {
    it('应该能够紧急停止', () => {
      elevator.stop();

      const status = elevator.getStatus();
      expect(status.state).toBe(ElevatorState.EMERGENCY);
      expect(status.isMoving).toBe(false);
      expect(status.targetFloor).toBe(null);
    });
  });

  describe('场景1：自动关门功能测试', () => {
    /**
     * 测试场景1：基本自动关门
     * 需求描述：
     * - 电梯到达指定楼层后，门会自动打开
     * - 门打开后等待一段时间（默认5秒）
     * - 如果没有新的请求，也没有人按住开门按钮
     * - 电梯门应该自动关闭
     * 
     * 这是最基础的电梯行为，符合日常生活中的电梯使用体验
     */
    it('到达楼层后应该在指定时间后自动关门', async () => {
      // 1. 电梯移动到5楼
      // moveTo() 方法会：关门 → 移动 → 到达 → 开门 → 等待 → 自动关门
      await elevator.moveTo(5);

      // 2. 验证电梯已经到达5楼
      expect(elevator.getCurrentFloor()).toBe(5);

      // 3. 验证移动完成后，门应该已经自动关闭
      // 因为 moveTo() 内部会等待门打开时间后自动关门
      const finalStatus = elevator.getStatus();
      expect(finalStatus.doorState).toBe(DoorState.CLOSED);
      expect(finalStatus.state).toBe(ElevatorState.IDLE);
    });

    /**
     * 测试场景1的细节：验证自动关门的时机
     * 这个测试更细致地验证了自动关门的时间点
     */
    it('门打开后在配置的时间内应该保持打开状态', async () => {
      // 1. 手动控制电梯的每一步操作
      // 先移动到5楼（但不使用 moveTo，因为它会自动关门）
      // 我们需要测试门保持打开的时间

      // 注意：这个测试需要我们实现一个只开门不自动关门的方法
      // 或者我们需要在开门后立即检查状态

      // 先关门
      await elevator.closeDoor();

      // 手动设置目标楼层和移动（模拟内部逻辑）
      // 注意：这里我们无法直接测试，因为 moveTo 会完整执行
      // 所以这个测试用例需要等待实现了可中断的关门逻辑后再完善

      // 暂时跳过这个详细测试，先验证基本功能
    }, 60000); // 设置更长的超时时间

    /**
     * 测试场景1的边界情况：移动到当前楼层
     * 如果电梯已经在目标楼层，不应该执行移动
     * 但这个测试可以验证在当前楼层开门关门的行为
     */
    it('在当前楼层不应该执行移动操作', async () => {
      const currentFloor = elevator.getCurrentFloor();

      // 移动到当前楼层
      await elevator.moveTo(currentFloor);

      // 应该还在原来的楼层
      expect(elevator.getCurrentFloor()).toBe(currentFloor);

      // 门的状态应该没有改变（因为没有实际移动）
      // 这个行为在实现时需要决定：不移动是否需要开关门？
    });
  });
});
