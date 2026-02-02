import { Button } from 'antd';
import { Building2, Github, Info } from 'lucide-react';

export function Header({ setAboutModalOpen }: { setAboutModalOpen: (open: boolean) => void }) {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="w-8 h-8 text-blue-500" />
            <div>
              <h1 className="text-2xl font-bold">智能电梯系统演示</h1>
              <p className="text-sm text-muted-foreground">
                基于 TypeScript 的 OOP 思想展示 - Monorepo 架构
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button icon={<Info className="w-4 h-4" />} onClick={() => setAboutModalOpen(true)}>
              关于
            </Button>
            <Button
              icon={<Github className="w-4 h-4" />}
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
