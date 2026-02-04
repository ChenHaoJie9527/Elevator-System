import { Button, Select, Space } from 'antd';
import { Play, StopCircle } from 'lucide-react';

interface ControlPanelTabManualProps {
  fromFloor: number;
  setFromFloor: (floor: number) => void;
  toFloor: number;
  setToFloor: (floor: number) => void;
  floorOptions: { label: string; value: number }[];
  isRunning: boolean;
  priority: number;
  setPriority: (priority: number) => void;
  handleCallElevator: () => void;
  handleEmergencyStop: () => void;
}
export function ControlPanelTabManual({
  fromFloor,
  setFromFloor,
  toFloor,
  setToFloor,
  floorOptions,
  isRunning,
  priority,
  setPriority,
  handleCallElevator,
  handleEmergencyStop,
}: ControlPanelTabManualProps) {
  return (
    <Space orientation="vertical" size="large" style={{ width: '100%' }}>
      <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
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

          <Button danger icon={<StopCircle className="w-4 h-4" />} onClick={handleEmergencyStop}>
            紧急停止
          </Button>
        </Space>
      </Space>
    </Space>
  );
}
