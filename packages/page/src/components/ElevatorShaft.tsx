import type { IElevator } from '@elevator-system/core';
import { DoorState, ElevatorState } from '@elevator-system/core';
import { Tooltip } from 'antd';
import clsx from 'clsx';
import { AlertCircle, ArrowDown, ArrowUp, Info } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ElevatorShaftProps {
  elevator: IElevator;
  maxFloor: number;
  minFloor: number;
}

export function ElevatorShaft({ elevator, maxFloor, minFloor }: ElevatorShaftProps) {
  const [currentFloor, setCurrentFloor] = useState(elevator.getCurrentFloor());
  const [state, setState] = useState(elevator.getState());
  const [doorState, setDoorState] = useState(DoorState.CLOSED);
  const config = elevator.getConfig();

  useEffect(() => {
    const interval = setInterval(() => {
      const status = elevator.getStatus();
      setCurrentFloor(status.currentFloor);
      setState(status.state);
      setDoorState(status.doorState);
    }, 100);

    return () => clearInterval(interval);
  }, [elevator]);

  const totalFloors = maxFloor - minFloor + 1;
  const floorPosition = ((maxFloor - currentFloor) / (totalFloors - 1)) * 100;

  const getStateIcon = () => {
    switch (state) {
      case ElevatorState.MOVING_UP:
        return <ArrowUp className="w-4 h-4 animate-bounce" />;
      case ElevatorState.MOVING_DOWN:
        return <ArrowDown className="w-4 h-4 animate-bounce" />;
      case ElevatorState.EMERGENCY:
        return <AlertCircle className="w-4 h-4 text-red-500 animate-pulse" />;
      default:
        return null;
    }
  };

  const getStateColor = () => {
    switch (state) {
      case ElevatorState.MOVING_UP:
      case ElevatorState.MOVING_DOWN:
        return 'bg-green-500';
      case ElevatorState.EMERGENCY:
        return 'bg-red-500';
      case ElevatorState.MAINTENANCE:
        return 'bg-yellow-500';
      default:
        return 'bg-blue-500';
    }
  };

  const isDoorOpen = doorState === DoorState.OPEN || doorState === DoorState.OPENING;

  const tooltipContent = (
    <div className="space-y-2">
      <div>
        <strong>电梯类型：</strong>
        {config.name}
      </div>
      <div>
        <strong>描述：</strong>
        {config.description}
      </div>
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-300">
        <div>
          <div className="text-gray-300">速度</div>
          <div>{config.speed} m/s</div>
        </div>
        <div>
          <div className="text-gray-300">载重</div>
          <div>{config.maxWeight} kg</div>
        </div>
        <div>
          <div className="text-gray-300">服务楼层</div>
          <div>
            {config.minFloor}-{config.maxFloor}F
          </div>
        </div>
        <div>
          <div className="text-gray-300">当前状态</div>
          <div>{getStateText(state)}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center">
      {/* 电梯信息头部 with Tooltip */}
      <Tooltip title={tooltipContent} placement="top">
        <div className="mb-4 text-center cursor-help">
          <div className="text-2xl mb-1">{config.icon}</div>
          <div className="text-sm font-semibold">{config.name}</div>
          <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
            {config.id}
            <Info className="w-3 h-3" />
          </div>
        </div>
      </Tooltip>

      {/* 电梯井道 */}
      <div
        className="relative w-32 bg-gray-100 rounded-lg shadow-inner p-2"
        style={{ height: `${totalFloors * 60}px` }}
      >
        {/* 楼层标记 */}
        {Array.from({ length: totalFloors }, (_, i) => {
          const floor = maxFloor - i;
          return (
            <div
              key={floor}
              className="absolute left-0 w-full flex items-center justify-between px-2 text-xs text-gray-500"
              style={{ top: `${i * 60}px` }}
            >
              <span className="font-mono">{floor}F</span>
              <div className="flex-1 border-b border-dashed border-gray-300 mx-2" />
            </div>
          );
        })}

        {/* 电梯轿厢 */}
        <div
          className={clsx(
            'absolute left-2 right-2 h-14 rounded-lg shadow-lg transition-all duration-300 ease-linear',
            getStateColor(),
            'flex items-center justify-center text-white font-bold'
          )}
          style={{
            top: `${(floorPosition * (totalFloors - 1) * 60) / 100 + 3}px`,
          }}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            {/* 门 */}
            <div className="absolute inset-0 flex">
              <div
                className={clsx(
                  'w-1/2 h-full bg-gray-700 transition-transform duration-500',
                  isDoorOpen ? '-translate-x-full' : 'translate-x-0'
                )}
              />
              <div
                className={clsx(
                  'w-1/2 h-full bg-gray-700 transition-transform duration-500',
                  isDoorOpen ? 'translate-x-full' : 'translate-x-0'
                )}
              />
            </div>

            {/* 楼层显示和状态图标 */}
            <div className="relative z-10 flex items-center gap-2">
              <span className="text-lg">{currentFloor}</span>
              {getStateIcon()}
            </div>
          </div>
        </div>
      </div>

      {/* 状态信息 */}
      <div className="mt-4 text-center space-y-1">
        <div className="text-xs">
          <span className="font-semibold">状态：</span>
          <span
            className={clsx('ml-1', state === ElevatorState.EMERGENCY && 'text-red-500 font-bold')}
          >
            {getStateText(state)}
          </span>
        </div>
        <div className="text-xs">
          <span className="font-semibold">门：</span>
          <span className="ml-1">{getDoorStateText(doorState)}</span>
        </div>
      </div>
    </div>
  );
}

function getStateText(state: ElevatorState): string {
  const stateMap: Record<ElevatorState, string> = {
    [ElevatorState.IDLE]: '空闲',
    [ElevatorState.MOVING_UP]: '上行',
    [ElevatorState.MOVING_DOWN]: '下行',
    [ElevatorState.DOOR_OPENING]: '开门中',
    [ElevatorState.DOOR_CLOSING]: '关门中',
    [ElevatorState.MAINTENANCE]: '维护中',
    [ElevatorState.EMERGENCY]: '紧急停止',
  };
  return stateMap[state] || '未知';
}

function getDoorStateText(doorState: DoorState): string {
  const doorStateMap: Record<DoorState, string> = {
    [DoorState.OPEN]: '开启',
    [DoorState.CLOSED]: '关闭',
    [DoorState.OPENING]: '开启中',
    [DoorState.CLOSING]: '关闭中',
  };
  return doorStateMap[doorState] || '未知';
}
