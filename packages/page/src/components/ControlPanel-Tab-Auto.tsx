import { Button, Space } from 'antd';

interface ControlPanelTabAutoProps {
  handleQuickScenario: (scenario: string) => void;
  isRunning: boolean;
}
export function ControlPanelTabAuto({ handleQuickScenario, isRunning }: ControlPanelTabAutoProps) {
  return (
    <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
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
  );
}
