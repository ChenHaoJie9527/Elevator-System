/**
 * 电梯系统类型定义
 */

// 电梯类型
export type ElevatorType = 'passenger' | 'freight' | 'scenic' | 'vip' | 'smart';

// 电梯状态
export enum ElevatorState {
  IDLE = 'idle',
  MOVING_UP = 'moving_up',
  MOVING_DOWN = 'moving_down',
  DOOR_OPENING = 'door_opening',
  DOOR_CLOSING = 'door_closing',
  MAINTENANCE = 'maintenance',
  EMERGENCY = 'emergency',
}

// 门的状态
export enum DoorState {
  OPEN = 'open',
  CLOSED = 'closed',
  OPENING = 'opening',
  CLOSING = 'closing',
}

// 电梯配置接口
export interface ElevatorConfig {
  id: string;
  type: ElevatorType;
  name: string;
  icon: string;
  maxFloor: number;
  minFloor: number;
  speed: number; // 移动速度（毫秒/层）
  capacity: number; // 最大载客量
  maxWeight: number; // 最大承重（kg）
  doorTime: number; // 开关门动作时间（毫秒）- 门从关闭到完全打开/从打开到完全关闭的时间
  doorOpenTime: number; // 门保持打开的时间（毫秒）- 到达楼层后门打开状态的停留时间，超时后自动关门
  color?: string; // UI 颜色（可选）
  description?: string; // 描述（可选）
}

// 电梯请求
export interface ElevatorRequest {
  targetFloor: number;
  timestamp: number;
  priority: number; // 0-普通，1-高，2-紧急
}

// 电梯运行状态
export interface ElevatorStatus {
  currentFloor: number;
  state: ElevatorState;
  doorState: DoorState;
  targetFloor: number | null;
  currentWeight: number;
  passengerCount: number;
  isMoving: boolean;
  requestQueue: ElevatorRequest[];
}

// 电梯接口 - 定义所有电梯必须实现的行为
export interface IElevator {
  // 基本操作
  moveTo(floor: number): Promise<void>;
  openDoor(): Promise<void>;
  closeDoor(): Promise<void>;
  stop(): void;

  // 状态查询
  getConfig(): ElevatorConfig;
  getStatus(): ElevatorStatus;
  getCurrentFloor(): number;
  getState(): ElevatorState;
  getCapacity(): number;
  getCurrentWeight(): number;

  // 请求处理
  addRequest(request: ElevatorRequest): void;
  processNextRequest(): Promise<void>;
}

// 传感器接口
export interface ISensor {
  read(): number;
  calibrate(): void;
  isNormal(): boolean;
}

// 访问控制接口
export interface IAccessControl {
  validateAccess(userId: string, targetFloor: number): boolean;
  getAccessLevel(userId: string): number;
}

// 控制器接口
export interface IElevatorController {
  registerElevator(id: string, elevator: IElevator): void;
  callElevator(fromFloor: number, toFloor: number, priority?: number): Promise<void>;
  getElevator(id: string): IElevator | undefined;
  getAllStatus(): ElevatorStatus[];
  emergencyStopAll(): void;
}
