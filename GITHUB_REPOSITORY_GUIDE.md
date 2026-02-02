# GitHub 仓库配置指南

## 📦 仓库信息

**仓库地址**：<https://github.com/ChenHaoJie9527/Elevator-System>

## ✅ 已完成的配置

### 1. 基础配置

- ✅ **MIT 许可证** - `LICENSE` 文件
- ✅ **README.md** - 完整的项目说明，包含徽章
- ✅ **CONTRIBUTING.md** - 贡献者指南
- ✅ **CHANGELOG.md** - 版本更新日志
- ✅ **.gitignore** - Git 忽略规则

### 2. GitHub 特性

- ✅ **GitHub Actions CI** - `.github/workflows/ci.yml`
  - 自动代码检查（Lint）
  - 自动构建测试
  - 构建产物上传
  
- ✅ **Issue 模板**
  - Bug 报告模板
  - 功能请求模板
  
- ✅ **Pull Request 模板**
  - 标准化的 PR 描述格式

### 3. 代码质量

- ✅ **Biome** - 统一的代码格式化和检查
- ✅ **TypeScript** - 类型安全
- ✅ **pnpm** - 快速的包管理器

## 🔧 推荐的 GitHub 仓库设置

### Repository Settings（仓库设置）

访问：<https://github.com/ChenHaoJie9527/Elevator-System/settings>

#### General（常规）

**About（关于）**

- Description（描述）：

  ```
  🏢 基于 TypeScript 的智能电梯系统演示 - 完整展示 OOP 四大核心思想（封装、抽象、继承、多态）| Monorepo + React 19 + Ant Design 6
  ```

- Website（网站）：

  ```
  https://github.com/ChenHaoJie9527/Elevator-System
  ```

- Topics（主题标签）：

  ```
  typescript
  react
  oop
  monorepo
  elevator-system
  ant-design
  vite
  pnpm
  教育项目
  设计模式
  ```

**Features（功能）**

- ✅ Issues
- ✅ Preserve this repository（保留此仓库）
- ✅ Discussions（可选，用于社区讨论）

**Pull Requests**

- ✅ Allow merge commits
- ✅ Allow squash merging
- ✅ Allow rebase merging
- ✅ Automatically delete head branches

#### Branches（分支）

**Branch protection rules（分支保护规则）**

为 `main` 分支添加保护：

- ✅ Require a pull request before merging
- ✅ Require status checks to pass before merging
  - CI workflow
- ✅ Require conversation resolution before merging

#### Pages（GitHub Pages）

如果需要部署演示站点：

**Source**: GitHub Actions

**Custom domain**（可选）：设置你的自定义域名

#### Actions

**General**

- ✅ Allow all actions and reusable workflows

**Workflow permissions**

- ✅ Read and write permissions

## 📊 徽章（Badges）

已添加到 README.md：

```markdown
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2-61dafb)](https://react.dev/)
[![Ant Design](https://img.shields.io/badge/Ant%20Design-6.2-1890ff)](https://ant-design.antgroup.com/)
[![pnpm](https://img.shields.io/badge/pnpm-workspace-orange)](https://pnpm.io/)
```

可以添加的其他徽章：

```markdown
[![CI](https://github.com/ChenHaoJie9527/Elevator-System/actions/workflows/ci.yml/badge.svg)](https://github.com/ChenHaoJie9527/Elevator-System/actions/workflows/ci.yml)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)
[![Code Style: Biome](https://img.shields.io/badge/code_style-biome-60a5fa.svg)](https://biomejs.dev/)
```

## 🚀 GitHub Actions Workflows

### CI Workflow（持续集成）

**文件**：`.github/workflows/ci.yml`

**触发条件**：

- Push 到 `main` 或 `develop` 分支
- Pull Request 到 `main` 或 `develop` 分支

**工作流程**：

1. **Lint Job**
   - 安装依赖
   - 运行 `pnpm lint` 检查代码

2. **Build Job**
   - 依赖 Lint Job 成功
   - 构建 `@elevator-system/core`
   - 构建 `@elevator-system/page`
   - 上传构建产物

### 建议添加的 Workflows

#### 1. 自动部署到 GitHub Pages

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    permissions:
      contents: read
      pages: write
      id-token: write
    
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 10
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      
      - uses: actions/upload-pages-artifact@v3
        with:
          path: packages/page/dist
      
      - uses: actions/deploy-pages@v4
```

#### 2. 自动发布 npm 包

如果需要发布 `@elevator-system/core` 到 npm：

```yaml
name: Publish to npm

on:
  release:
    types: [published]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          registry-url: 'https://registry.npmjs.org'
      
      - run: pnpm install --frozen-lockfile
      - run: pnpm build:core
      - run: pnpm publish --filter @elevator-system/core --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## 📋 Issue 和 PR 管理

### Issue 标签

建议创建以下标签：

| 标签 | 颜色 | 描述 |
|------|------|------|
| `bug` | `#d73a4a` | Bug 报告 |
| `enhancement` | `#a2eeef` | 新功能 |
| `documentation` | `#0075ca` | 文档改进 |
| `good first issue` | `#7057ff` | 适合新贡献者 |
| `help wanted` | `#008672` | 需要帮助 |
| `question` | `#d876e3` | 问题咨询 |
| `wontfix` | `#ffffff` | 不会修复 |
| `duplicate` | `#cfd3d7` | 重复问题 |

### Milestones（里程碑）

建议创建：

- v1.0.0 - 初始发布
- v2.0.0 - 主要功能升级
- Future - 未来计划

## 📖 README 优化建议

### 添加项目截图

在 README 中添加：

```markdown
## 📸 项目截图

![控制面板](docs/images/control-panel.png)
![电梯井道](docs/images/elevator-shaft.png)
```

### 添加在线演示链接

如果部署到 GitHub Pages：

```markdown
## 🌐 在线演示

👉 [立即体验](https://chenhao
jie9527.github.io/Elevator-System/)
```

### 添加贡献者

```markdown
## 👥 贡献者

感谢所有贡献者！

<a href="https://github.com/ChenHaoJie9527/Elevator-System/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=ChenHaoJie9527/Elevator-System" />
</a>
```

## 🎯 下一步建议

1. **设置仓库 About 信息**
   - 访问仓库主页
   - 点击右上角 ⚙️ 设置 About
   - 添加描述、网站、主题标签

2. **启用 GitHub Pages**（可选）
   - Settings → Pages
   - Source: GitHub Actions
   - 部署前端演示应用

3. **配置 GitHub Actions secrets**（如果需要）
   - Settings → Secrets and variables → Actions
   - 添加 NPM_TOKEN（如果要发布包）

4. **添加 SECURITY.md**
   - 说明如何报告安全漏洞

5. **添加 CODE_OF_CONDUCT.md**
   - 社区行为准则

## 📝 提交记录

```bash
✅ Commit 1: feat: 初始提交 - 智能电梯系统演示项目 (a9545a0)
✅ Commit 2: chore: 完善仓库配置 (52114d4)
```

---

**恭喜！🎉 你的 GitHub 仓库已经完全配置好了！**

现在访问 <https://github.com/ChenHaoJie9527/Elevator-System> 即可看到完整的项目！
