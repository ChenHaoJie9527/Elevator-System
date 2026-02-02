import type { IElevator } from '@elevator-system/core';
import {
  ElevatorController,
  FreightElevator,
  PassengerElevator,
  ScenicElevator,
  SmartElevator,
  VIPElevator,
} from '@elevator-system/core';
import { Button, Modal } from 'antd';
import { Building2, Github } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { ElevatorShaft } from './components/ElevatorShaft';
import { Header } from './components/Header';

function App() {
  const [controller] = useState(() => new ElevatorController());
  const [elevators, setElevators] = useState<IElevator[]>([]);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);

  useEffect(() => {
    // 创建不同类型的电梯
    const passenger = new PassengerElevator('E1', 20);
    const freight = new FreightElevator('F1', 20);
    const scenic = new ScenicElevator('S1', 20, [10, 15]);
    const vip = new VIPElevator('V1', 20);
    const smart = new SmartElevator('M1', 20);

    // VIP 电梯添加授权用户
    vip.addAuthorizedUser('vip001', 3);

    // 注册到控制器
    controller.registerElevator('E1', passenger);
    controller.registerElevator('F1', freight);
    controller.registerElevator('S1', scenic);
    controller.registerElevator('V1', vip);
    controller.registerElevator('M1', smart);

    setElevators([passenger, freight, scenic, vip, smart]);
  }, [controller]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* 头部 */}
      <Header setAboutModalOpen={setAboutModalOpen} />

      {/* 主要内容 */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：控制面板 */}
          <div className="lg:col-span-1">
            <ControlPanel controller={controller} maxFloor={20} minFloor={-2} />
          </div>

          {/* 右侧：电梯井道展示 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-6">电梯井道实时视图（含地下停车场）</h2>

              {elevators.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">正在初始化电梯系统...</div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
                  {elevators.map((elevator) => (
                    <ElevatorShaft
                      key={elevator.getConfig().id}
                      elevator={elevator}
                      maxFloor={20}
                      minFloor={-2}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="mt-12 py-6 border-t bg-white">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>智能电梯系统 - OOP 思想教学演示项目</p>
          <p className="mt-1">使用 TypeScript + React 构建 | MIT License</p>
        </div>
      </footer>

      {/* 关于对话框 */}
      <Modal
        title={
          <div className="flex items-center gap-3">
            <Building2 className="w-6 h-6 text-blue-500" />
            <span>关于智能电梯系统</span>
          </div>
        }
        open={aboutModalOpen}
        onCancel={() => setAboutModalOpen(false)}
        footer={[
          <Button key="github" icon={<Github className="w-4 h-4" />} href="https://github.com">
            查看源码
          </Button>,
          <Button key="close" type="primary" onClick={() => setAboutModalOpen(false)}>
            关闭
          </Button>,
        ]}
        width={800}
      >
        <div className="space-y-4 text-sm">
          <section>
            <h3 className="font-semibold text-lg mb-2 text-blue-600">🎯 项目简介</h3>
            <p className="text-gray-700 leading-relaxed">
              这是一个基于 TypeScript
              构建的智能电梯系统演示项目，旨在展示面向对象编程（OOP）的核心思想和现代前端开发的最佳实践。
              项目采用 Monorepo 架构，展示了如何构建可维护、可扩展的大型应用。
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-lg mb-2 text-purple-600">🧩 OOP 四大核心</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-semibold mb-1">封装（Encapsulation）</h4>
                <p className="text-xs text-gray-600">
                  电梯内部状态（如当前楼层、运行状态）被封装在类内部，通过公共方法访问
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-semibold mb-1">抽象（Abstraction）</h4>
                <p className="text-xs text-gray-600">
                  通过 IElevator 接口定义电梯的抽象行为，隐藏实现细节
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-semibold mb-1">继承（Inheritance）</h4>
                <p className="text-xs text-gray-600">
                  PassengerElevator、FreightElevator 等继承自 BaseElevator 基类
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-semibold mb-1">多态（Polymorphism）</h4>
                <p className="text-xs text-gray-600">
                  不同类型的电梯通过同一接口调用，实现不同的具体行为
                </p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="font-semibold text-lg mb-2 text-green-600">🚀 技术特色</h3>
            <ul className="space-y-1 text-gray-700">
              <li>✨ TypeScript 提供完整的类型安全</li>
              <li>✨ React 19 最新特性与 Hooks</li>
              <li>✨ Vite 极速开发体验</li>
              <li>✨ Tailwind CSS 4 现代化样式方案</li>
              <li>✨ Ant Design 6 企业级组件库</li>
              <li>✨ Biome 统一的代码格式化和检查</li>
              <li>✨ pnpm workspace Monorepo 管理</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold text-lg mb-2 text-orange-600">📚 学习价值</h3>
            <p className="text-gray-700 leading-relaxed">
              本项目适合学习 TypeScript、OOP 思想、设计模式、React 开发、Monorepo
              架构等多方面的知识。 代码结构清晰，注释完整，是学习现代前端工程化的优秀示例。
            </p>
          </section>
        </div>
      </Modal>
    </div>
  );
}

export default App;
