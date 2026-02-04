import type { IElevator } from '@elevator-system/core';
import { DoorState, ElevatorState } from '@elevator-system/core';
import { useGSAP } from '@gsap/react';
import { Tooltip } from 'antd';
import clsx from 'clsx';
import { gsap } from 'gsap';
import { AlertCircle, ArrowDown, ArrowUp, Info } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

gsap.registerPlugin(useGSAP);

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

  const containerRef = useRef<HTMLDivElement>(null);
  const carRef = useRef<HTMLDivElement>(null);
  const doorLeftRef = useRef<HTMLDivElement>(null);
  const doorRightRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const doorTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const prevStatusRef = useRef(elevator.getStatus()); // 用于存储上一次的状态

  // 🔑 组件挂载时强制同步一次状态
  // biome-ignore lint/correctness/useExhaustiveDependencies: Only run on mount
  useEffect(() => {
    const initialStatus = elevator.getStatus();
    const initialPosition = (maxFloor - initialStatus.currentFloor) * 60 + 3;

    console.log('🎬 组件初始化:', {
      elevatorId: config.id,
      initialFloor: initialStatus.currentFloor,
      currentFloorState: currentFloor,
      state: initialStatus.state,
      initialPosition: `${initialPosition}px`,
    });

    // 强制同步初始楼层
    setCurrentFloor(initialStatus.currentFloor);
    setState(initialStatus.state);
    setDoorState(initialStatus.doorState);
    prevStatusRef.current = initialStatus;

    // 使用 GSAP 设置初始位置（确保准确）
    if (carRef.current) {
      gsap.set(carRef.current, {
        top: initialPosition,
      });
    }
  }, [elevator, config.id, maxFloor]);

  /**
   * 创建门动画时间线
   */
  const createDoorTimeline = useCallback((isOpening: boolean) => {
    // 清理之前的门动画
    if (doorTimelineRef.current) {
      doorTimelineRef.current.kill();
    }

    const tl = gsap.timeline({
      defaults: { ease: 'power1.inOut' },
    });

    doorTimelineRef.current = tl;

    if (isOpening) {
      // 开门：左门向左，右门向右
      tl.to([doorLeftRef.current, doorRightRef.current], {
        x: (index) => (index === 0 ? '-100%' : '100%'),
        duration: 0.5,
      });
    } else {
      // 关门：回到中间
      tl.to([doorLeftRef.current, doorRightRef.current], {
        x: '0%',
        duration: 0.5,
      });
    }

    return tl;
  }, []);

  /**
   * 创建电梯运动时间轴动画（全程匀速）
   */
  const createElevatorTimeline = useCallback(
    (fromFloor: number, toFloor: number) => {
      // 清理之前的时间线
      if (timelineRef.current) {
        timelineRef.current.kill();
      }

      const distance = Math.abs(toFloor - fromFloor);
      const config = elevator.getConfig();

      // 计算位置（从上到下的像素位置）
      const startPos = (maxFloor - fromFloor) * 60 + 3;
      const endPos = (maxFloor - toFloor) * 60 + 3;

      // 计算总时长（全程匀速）
      const duration = (distance * config.speed) / 1000;

      // 判断方向
      const direction = toFloor > fromFloor ? '上行 ⬆️' : toFloor < fromFloor ? '下行 ⬇️' : '同层';
      const isMovingUp = endPos < startPos; // 像素值越小表示越往上

      console.log('🎯 创建电梯动画（全程匀速）:', {
        fromFloor,
        toFloor,
        direction,
        distance,
        maxFloor,
        startPos: `${startPos}px`,
        endPos: `${endPos}px`,
        isMovingUp,
        pixelDistance: Math.abs(endPos - startPos),
        duration: `${duration}s`,
      });

      // 🔑 关键：强制设置初始位置
      // 先获取当前轿厢的实际位置
      const currentTop = carRef.current?.style.top || 'unknown';
      const computedTop = carRef.current ? window.getComputedStyle(carRef.current).top : 'unknown';

      console.log('🔧 设置初始位置:', {
        fromFloor,
        toFloor,
        startPos: `${startPos}px`,
        endPos: `${endPos}px`,
        beforeSet: {
          inlineStyleTop: currentTop,
          computedTop: computedTop,
        },
      });

      // 强制清除所有 inline style，完全由 GSAP 控制
      if (carRef.current) {
        carRef.current.style.top = '';
      }

      // 使用 GSAP 立即设置位置（不使用动画）
      gsap.set(carRef.current, {
        top: startPos,
        clearProps: 'none', // 不清除属性，保持 GSAP 的控制
      });

      // 创建主时间轴（全程匀速运动）
      const tl = gsap.timeline({
        defaults: { ease: 'none' }, // 完全线性匀速
        onStart: () => {
          console.log(`🚀 电梯开始从 ${fromFloor}F 前往 ${toFloor}F（匀速运动）`);
        },
        onUpdate: function () {
          const progress = this.progress();
          const currentDisplay = Math.round(fromFloor + (toFloor - fromFloor) * progress);
          setCurrentFloor(currentDisplay);
        },
        onComplete: () => {
          console.log(`✅ 电梯到达 ${toFloor}F`);
          setCurrentFloor(toFloor);
        },
      });

      timelineRef.current = tl;

      // 全程匀速运动：直接从起点到终点
      tl.addLabel('start')
        .to(carRef.current, {
          top: endPos,
          duration: duration,
          ease: 'none', // 确保完全匀速
        })
        .addLabel('arrived');

      return tl;
    },
    [elevator, maxFloor]
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: currentFloor is intentionally not in deps to avoid infinite loop
  useEffect(() => {
    const interval = setInterval(() => {
      const newStatus = elevator.getStatus();
      const prevStatus = prevStatusRef.current; // 🔑 使用 ref 而不是 state

      // 检测运动开始：关键是使用 prevStatus.currentFloor 作为起点
      if (
        prevStatus.state === ElevatorState.IDLE &&
        (newStatus.state === ElevatorState.MOVING_UP ||
          newStatus.state === ElevatorState.MOVING_DOWN) &&
        newStatus.targetFloor !== null
      ) {
        // 🔑 立即同步当前楼层（确保起始位置正确）
        const actualStartFloor = prevStatus.currentFloor;
        const currentFloorState = currentFloor; // 记录当前 state 中的楼层

        console.log('🎬 检测到运动开始:', {
          from: actualStartFloor,
          to: newStatus.targetFloor,
          currentFloorState, // 显示 state 中的楼层（可能过时）
          prevState: prevStatus.state,
          newState: newStatus.state,
          direction: newStatus.targetFloor > actualStartFloor ? '上行 ⬆️' : '下行 ⬇️',
        });

        // 立即更新 currentFloor 确保位置正确
        setCurrentFloor(actualStartFloor);

        createElevatorTimeline(actualStartFloor, newStatus.targetFloor);
      }

      // 检测门状态变化
      if (prevStatus.doorState !== newStatus.doorState) {
        const isOpening =
          newStatus.doorState === DoorState.OPENING || newStatus.doorState === DoorState.OPEN;
        createDoorTimeline(isOpening);
      }

      // 🔑 立即更新 ref（确保下次循环能获取到最新值）
      prevStatusRef.current = newStatus;

      // 更新状态
      setState(newStatus.state);
      setDoorState(newStatus.doorState);

      // 只在非运动状态时同步楼层显示
      if (
        newStatus.state === ElevatorState.IDLE ||
        newStatus.state === ElevatorState.DOOR_OPENING ||
        newStatus.state === ElevatorState.DOOR_CLOSING
      ) {
        setCurrentFloor(newStatus.currentFloor);
      }
    }, 100);

    return () => {
      clearInterval(interval);
      // 清理动画
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
      if (doorTimelineRef.current) {
        doorTimelineRef.current.kill();
      }
    };
  }, [elevator, createElevatorTimeline, createDoorTimeline]);

  // 🔑 在空闲状态下同步位置（使用 GSAP）
  useEffect(() => {
    if (
      state === ElevatorState.IDLE ||
      state === ElevatorState.DOOR_OPENING ||
      state === ElevatorState.DOOR_CLOSING
    ) {
      const realFloor = prevStatusRef.current.currentFloor;
      const correctPosition = (maxFloor - realFloor) * 60 + 3;

      // 使用 GSAP 设置位置，避免与 inline style 冲突
      if (carRef.current) {
        gsap.set(carRef.current, {
          top: correctPosition,
        });
      }
    }
  }, [state, maxFloor]);

  useGSAP(
    () => {
      return () => {
        gsap.killTweensOf(carRef.current);
        gsap.killTweensOf([doorLeftRef.current, doorRightRef.current]);
      };
    },
    { scope: containerRef }
  );

  const totalFloors = maxFloor - minFloor + 1;

  // 🔑 获取实际显示的楼层（用于 UI 显示，不用于位置计算）
  const getActualCurrentFloor = () => {
    if (
      state === ElevatorState.IDLE ||
      state === ElevatorState.DOOR_OPENING ||
      state === ElevatorState.DOOR_CLOSING
    ) {
      // 空闲或开关门状态：使用实时楼层
      const realTimeFloor = prevStatusRef.current.currentFloor;

      // 调试日志：只在楼层不一致时输出
      // if (realTimeFloor !== currentFloor) {
      //   console.log('🔧 修正楼层显示:', {
      //     state,
      //     currentFloorState: currentFloor,
      //     realTimeFloor,
      //     correction: true,
      //   });
      // }

      return realTimeFloor;
    }
    // 运动状态：使用动画控制的楼层显示
    return currentFloor;
  };

  const actualFloor = getActualCurrentFloor();

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

  // 格式化楼层显示：负数楼层显示为 B1, B2
  const formatFloor = (floor: number): string => {
    if (floor < 0) {
      return `B${Math.abs(floor)}`;
    }
    return `${floor}F`;
  };

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
          <div>{config.speed} ms/层</div>
        </div>
        <div>
          <div className="text-gray-300">载重</div>
          <div>{config.maxWeight} kg</div>
        </div>
        <div>
          <div className="text-gray-300">服务楼层</div>
          <div>
            {formatFloor(config.minFloor)} - {config.maxFloor}F
          </div>
        </div>
        <div>
          <div className="text-gray-300">当前状态</div>
          <div className={clsx(state === ElevatorState.EMERGENCY && 'text-red-500 font-bold')}>
            {getStateText(state)}
          </div>
        </div>
        <div className="text-gray-300">门状态</div>
        <div>{getDoorStateText(doorState)}</div>
      </div>
    </div>
  );

  return (
    <div ref={containerRef} className="flex flex-col items-center">
      {/* 电梯信息头部 */}
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
              <span className="font-mono">{formatFloor(floor)}</span>
              <div className="flex-1 border-b border-dashed border-gray-300 mx-2" />
            </div>
          );
        })}

        {/* 电梯轿厢 - 完全由 GSAP 控制位置 */}
        <div
          ref={carRef}
          className={clsx(
            'absolute left-2 right-2 h-14 rounded-lg shadow-lg',
            getStateColor(),
            'flex items-center justify-center text-white font-bold'
          )}
          // 不设置 inline style，完全由 GSAP 控制位置
        >
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-lg">
            {/* 门 - 使用 ref，由 GSAP 控制 */}
            <div className="absolute inset-0 flex">
              <div
                ref={doorLeftRef}
                className="w-1/2 h-full bg-gray-700"
                style={{ transform: 'translateX(0%)' }}
              />
              <div
                ref={doorRightRef}
                className="w-1/2 h-full bg-gray-700"
                style={{ transform: 'translateX(0%)' }}
              />
            </div>

            {/* 楼层显示和状态图标 */}
            <div className="relative z-10 flex items-center gap-2">
              <span className="text-lg">{formatFloor(actualFloor)}</span>
              {getStateIcon()}
            </div>
          </div>
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
