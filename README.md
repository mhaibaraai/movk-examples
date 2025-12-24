# Movk Examples

Movk 框架示例集合，展示框架的各种功能和最佳实践。

## 📦 示例列表

### 表单系统

- [**auto-form**](./examples/auto-form) - 自动表单生成，展示基于 Zod schema 的表单自动生成功能

### API 系统

- [**api-fetch**](./examples/api-fetch) - API 请求封装，展示 `useApiFetch` 和 `useClientApiFetch` 的使用
- [**api-auth**](./examples/api-auth) - 认证管理，展示 `useApiAuth` 登录、登出和会话管理
- [**api-upload**](./examples/api-upload) - 文件上传，展示 `useUploadWithProgress` 带进度监控的上传功能
- [**api-download**](./examples/api-download) - 文件下载，展示 `useDownloadWithProgress` 带进度监控的下载功能
- [**api-dashboard**](./examples/api-dashboard) - API 综合应用，展示所有 API System 功能的集成使用

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
├── examples/              # 示例代码
│   ├── auto-form/        # 自动表单示例
│   ├── api-fetch/        # API 请求示例
│   ├── api-auth/         # 认证管理示例
│   ├── api-upload/       # 文件上传示例
│   ├── api-download/     # 文件下载示例
│   └── api-dashboard/    # API 综合应用示例
├── .scripts/             # 构建脚本
├── package.json          # 根配置
└── pnpm-workspace.yaml   # pnpm 工作区配置
```

## 🛠️ 技术栈

- [Nuxt 4](https://nuxt.com/) - 基于 Vue 3 的全栈框架
- [@movk/nuxt](https://nuxt.mhaibaraai.cn/) - Movk Nuxt 框架扩展
- [Nuxt UI](https://ui.nuxt.com/) - UI 组件库
- [TypeScript](https://www.typescriptlang.org/) - 类型安全
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [Zod](https://zod.dev/) - Schema 验证

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

## 🎯 示例功能概览

| 示例 | 主要功能 | 核心 Composable | UI 组件 |
|------|---------|----------------|---------|
| auto-form | 自动表单生成 | `useAutoForm` | Card、Input、Textarea、Alert |
| api-fetch | API 请求 | `useApiFetch`、`useClientApiFetch` | Card、Button、Badge、Avatar |
| api-auth | 用户认证 | `useApiAuth` | Card、Input、Avatar、Divider |
| api-upload | 文件上传 | `useUploadWithProgress` | Card、Progress、Icon、Alert |
| api-download | 文件下载 | `useDownloadWithProgress` | Card、Progress、Icon、Badge |
| api-dashboard | 综合应用 | 全部 API Composables | Tabs、Card、Progress、Avatar |

## 📄 许可证

[MIT License](./LICENSE)
