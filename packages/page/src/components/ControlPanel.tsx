import type { ElevatorController } from '@elevator-system/core';
import { Card, Tabs } from 'antd';
import { RotateCcw, Zap } from 'lucide-react';
import { useState } from 'react';
import { ControlPanelTabManual } from './ControlPanel-Tab-Manual';
import { ControlPanelTabAuto } from './ControlPanel-Tab-Auto';

interface ControlPanelProps {
  controller: ElevatorController;
  maxFloor: number;
  minFloor: number;
}

export function ControlPanel({ controller, maxFloor, minFloor }: ControlPanelProps) {
  const [fromFloor, setFromFloor] = useState(-2); // 默认从地下停车场出发
  const [toFloor, setToFloor] = useState(1); // 默认到大堂
  const [priority, setPriority] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const handleCallElevator = async () => {
    if (isRunning) return;

    setIsRunning(true);
    try {
      await controller.callElevator(fromFloor, toFloor, priority);
    } catch (error) {
      console.error('调用电梯失败:', error);
      alert(`调用失败: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleEmergencyStop = () => {
    controller.emergencyStopAll();
    setIsRunning(false);
  };

  const handleQuickScenario = async (scenario: string) => {
    if (isRunning) return;

    setIsRunning(true);
    try {
      switch (scenario) {
        case 'morning':
          // 早高峰：从地下停车场和大堂到不同楼层
          await controller.callElevator(-2, 10, 0);
          await new Promise((resolve) => setTimeout(resolve, 1000));
          await controller.callElevator(-1, 15, 0);
          await new Promise((resolve) => setTimeout(resolve, 1000));
          await controller.callElevator(1, 20, 0);
          break;
        case 'vip':
          await controller.callElevator(1, 20, 2);
          break;
        case 'freight':
          // 货运：从地下停车场运货
          await controller.callElevator(-2, 10, 0);
          break;
        case 'parking':
          // 停车场往返场景
          await controller.callElevator(1, -2, 0);
          await new Promise((resolve) => setTimeout(resolve, 2000));
          await controller.callElevator(-2, 1, 0);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('场景演示失败:', error);
    } finally {
      setIsRunning(false);
    }
  };

  // 格式化楼层显示：负数楼层显示为 B1, B2
  const formatFloor = (floor: number): string => {
    if (floor < 0) {
      return `B${Math.abs(floor)}`;
    }
    return `${floor}F`;
  };

  const floors = Array.from({ length: maxFloor - minFloor + 1 }, (_, i) => minFloor + i).reverse();
  const floorOptions = floors.map((floor) => ({ label: formatFloor(floor), value: floor }));

  const tabItems = [
    {
      key: 'manual',
      label: '手动控制',
      children: (
        <ControlPanelTabManual
          fromFloor={fromFloor}
          setFromFloor={setFromFloor}
          toFloor={toFloor}
          setToFloor={setToFloor}
          floorOptions={floorOptions}
          isRunning={isRunning}
          priority={priority}
          setPriority={setPriority}
          handleCallElevator={handleCallElevator}
          handleEmergencyStop={handleEmergencyStop}
        />
      ),
    },
    {
      key: 'scenarios',
      label: (
        <span>
          <RotateCcw className="w-4 h-4 inline mr-1" />
          场景演示
        </span>
      ),
      children: (
        <ControlPanelTabAuto handleQuickScenario={handleQuickScenario} isRunning={isRunning} />
      ),
    },
  ];

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          <span>电梯控制面板</span>
        </div>
      }
    >
      <p className="text-sm text-muted-foreground mb-4">选择起始和目标楼层，调用电梯系统</p>

      <Tabs items={tabItems} />

      {/* 说明 */}
      <div className="bg-blue-50 rounded-md p-3 text-xs space-y-1 mt-4">
        <p className="font-semibold">💡 OOP 思想体现：</p>
        <p>
          • <strong>封装</strong>：电梯内部状态对外隐藏
        </p>
        <p>
          • <strong>抽象</strong>：通过接口统一管理不同电梯
        </p>
        <p>
          • <strong>继承</strong>：多种电梯类型共享基础功能
        </p>
        <p>
          • <strong>多态</strong>：同一方法在不同电梯有不同行为
        </p>
      </div>
    </Card>
  );
}
