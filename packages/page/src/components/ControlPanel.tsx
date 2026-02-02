import type { ElevatorController } from '@elevator-system/core';
import { Button, Card, Select, Space, Tabs } from 'antd';
import { Play, RotateCcw, StopCircle, Zap } from 'lucide-react';
import { useState } from 'react';

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
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">起始楼层</label>
                <Select
                  value={fromFloor}
                  onChange={setFromFloor}
                  options={floorOptions}
                  disabled={isRunning}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">目标楼层</label>
                <Select
                  value={toFloor}
                  onChange={setToFloor}
                  options={floorOptions}
                  disabled={isRunning}
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">优先级</label>
              <Space style={{ width: '100%' }}>
                <Button
                  type={priority === 0 ? 'primary' : 'default'}
                  onClick={() => setPriority(0)}
                  disabled={isRunning}
                  style={{ flex: 1 }}
                >
                  普通
                </Button>
                <Button
                  type={priority === 1 ? 'primary' : 'default'}
                  onClick={() => setPriority(1)}
                  disabled={isRunning}
                  danger={priority === 1}
                  style={{ flex: 1 }}
                >
                  高
                </Button>
                <Button
                  type={priority === 2 ? 'primary' : 'default'}
                  onClick={() => setPriority(2)}
                  disabled={isRunning}
                  danger={priority === 2}
                  style={{ flex: 1 }}
                >
                  紧急
                </Button>
              </Space>
            </div>

            <Space style={{ width: '100%' }}>
              <Button
                type="primary"
                icon={<Play className="w-4 h-4" />}
                onClick={handleCallElevator}
                disabled={isRunning || fromFloor === toFloor}
                loading={isRunning}
                style={{ flex: 1 }}
              >
                {isRunning ? '运行中...' : '调用电梯'}
              </Button>

              <Button
                danger
                icon={<StopCircle className="w-4 h-4" />}
                onClick={handleEmergencyStop}
              >
                紧急停止
              </Button>
            </Space>
          </Space>
        </Space>
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
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Button
            block
            size="large"
            onClick={() => handleQuickScenario('morning')}
            disabled={isRunning}
            className="text-left"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🌅</span>
              <div>
                <div className="font-semibold">早高峰场景</div>
                <div className="text-xs text-gray-600">多人从1楼到不同楼层</div>
              </div>
            </div>
          </Button>

          <Button
            block
            size="large"
            onClick={() => handleQuickScenario('vip')}
            disabled={isRunning}
            className="text-left"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">👑</span>
              <div>
                <div className="font-semibold">VIP 直达场景</div>
                <div className="text-xs text-gray-600">高优先级快速到达</div>
              </div>
            </div>
          </Button>

          <Button
            block
            size="large"
            onClick={() => handleQuickScenario('freight')}
            disabled={isRunning}
            className="text-left"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">📦</span>
              <div>
                <div className="font-semibold">货物运输场景</div>
                <div className="text-xs text-gray-600">从地下停车场运货到楼层</div>
              </div>
            </div>
          </Button>

          <Button
            block
            size="large"
            onClick={() => handleQuickScenario('parking')}
            disabled={isRunning}
            className="text-left"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🅿️</span>
              <div>
                <div className="font-semibold">停车场往返场景</div>
                <div className="text-xs text-gray-600">大堂往返地下停车场</div>
              </div>
            </div>
          </Button>
        </Space>
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
