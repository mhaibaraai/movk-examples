# Movk Examples

Movk 框架示例集合，展示框架的各种功能和最佳实践。

## 📦 示例列表

### 表单组件

- [**auto-form**](./examples/auto-form) - 自动表单生成示例，展示如何使用 schema 自动生成表单组件

## 🚀 快速开始

### 环境要求

- Node.js >= 18
- pnpm >= 10

### 安装依赖

```bash
pnpm install
```

### 运行示例

进入任意示例目录并启动开发服务器：

```bash
cd examples/auto-form
pnpm dev
```

## 📚 项目结构

```plaintext
movk-examples/
├── examples/           # 示例代码
│   └── auto-form/     # 自动表单示例
├── .scripts/          # 构建脚本
├── package.json       # 根配置
└── pnpm-workspace.yaml # pnpm 工作区配置
```

## 🛠️ 技术栈

- [Nuxt](https://nuxt.com/) - 基于 Vue 3 的全栈框架
- [Nuxt UI](https://ui.nuxt.com/) - UI 组件库
- [TypeScript](https://www.typescriptlang.org/) - 类型安全
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架

## 📝 开发指南

### 添加新示例

1. 在 `examples/` 目录下创建新的示例目录
2. 初始化 Nuxt 项目配置
3. 更新本 README 的示例列表

### 代码规范

运行 ESLint 检查：

```bash
pnpm lint
```

自动修复代码问题：

```bash
pnpm lint:fix
```

类型检查：

```bash
pnpm typecheck
```

## 📄 许可证

[MIT License](./LICENSE)
