import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // 测试环境
    environment: 'node',

    // 全局 API（describe, it, expect 等）
    globals: true,

    // 代码覆盖率配置
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/index.ts',
      ],
    },

    // 测试文件匹配模式
    include: ['src/**/*.{test,spec}.{js,ts}', 'tests/**/*.{test,spec}.{js,ts}'],

    // 排除文件
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],

    // 测试超时时间（毫秒）- 电梯移动测试需要更长时间
    testTimeout: 30000,

    // 钩子超时时间
    hookTimeout: 10000,
  },
});
