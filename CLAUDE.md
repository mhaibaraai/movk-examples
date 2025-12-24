# CLAUDE.md - Movk Examples 项目配置

> 本项目的 Claude Code 配置文件

## 项目概述

Movk Examples 是 Movk 框架的示例集合项目，展示框架的各种功能和最佳实践。项目采用 pnpm workspace 管理多个独立示例。

## 项目结构

```plaintext
movk-examples/
├── examples/              # 示例代码目录
│   ├── auto-form/        # 自动表单示例
│   ├── api-fetch/        # API 请求示例
│   ├── api-auth/         # 认证管理示例
│   ├── api-upload/       # 文件上传示例
│   ├── api-download/     # 文件下载示例
│   └── api-dashboard/    # API 综合应用示例
├── .scripts/             # 构建和工具脚本
├── package.json          # 根 package.json
└── pnpm-workspace.yaml   # pnpm 工作区配置
```

## 技术栈

- **框架**:Nuxt 4 (Vue 3)
- **Movk 扩展**:@movk/nuxt ^0.1.1
- **UI 库**:@nuxt/ui ^4.2.1
- **样式**:Tailwind CSS ^4.1.17
- **验证**:Zod ^4.1.13
- **包管理器**:pnpm 10.24.0
- **TypeScript**:^5.9.3

## 示例说明

### 表单系统

#### auto-form
- **功能**:基于 Zod schema 的自动表单生成
- **核心 Composable**:`useAutoForm`
- **关键特性**:
  - Schema 定义驱动表单生成
  - 自动类型推导
  - 内置验证
  - 自定义字段渲染

### API 系统

#### api-fetch
- **功能**:API 请求封装和数据获取
- **核心 Composable**:`useApiFetch`、`useClientApiFetch`
- **关键特性**:
  - 服务端和客户端请求
  - 自动状态管理
  - 请求缓存
  - 错误处理

#### api-auth
- **功能**:用户认证和会话管理
- **核心 Composable**:`useApiAuth`
- **关键特性**:
  - 登录/登出
  - 会话持久化
  - 用户状态管理
  - 与 nuxt-auth-utils 集成

#### api-upload
- **功能**:带进度监控的文件上传
- **核心 Composable**:`useUploadWithProgress`
- **关键特性**:
  - 实时上传进度
  - 多文件上传
  - 取消上传
  - 文件验证

#### api-download
- **功能**:带进度监控的文件下载
- **核心 Composable**:`useDownloadWithProgress`
- **关键特性**:
  - 实时下载进度
  - 取消下载
  - 文件类型处理
  - 自动保存

#### api-dashboard
- **功能**:综合 API 管理应用
- **核心 Composable**:全部 API System composables
- **关键特性**:
  - 多功能集成
  - 标签页导航
  - 认证保护
  - 统一状态管理

## 开发规范

### 代码风格

- 遵循全局 `~/.claude/CLAUDE.md` 的代码规范
- 组件文件使用 PascalCase:`ComponentName.vue`
- Composable 使用 camelCase，以 `use` 开头:`useFeature`
- 服务端 API 路由使用 kebab-case:`api/user-profile.get.ts`

### 示例开发原则

1. **独立性**:每个示例应该是独立完整的 Nuxt 应用
2. **简洁性**:UI 简洁明了，不添加冗余说明文字
3. **功能性**:专注展示核心功能，避免过度工程
4. **一致性**:使用统一的项目结构和配置

### 文件组织

每个示例必须包含:
```plaintext
example-name/
├── app/
│   ├── app.vue           # 主应用组件
│   └── assets/
│       └── css/
│           └── main.css  # Tailwind 导入
├── server/
│   └── api/              # 模拟后端 API
├── public/               # 静态资源
├── package.json          # 依赖配置
├── nuxt.config.ts        # Nuxt 配置
└── tsconfig.json         # TypeScript 配置
```

### 依赖管理

- 所有示例使用相同版本的核心依赖
- 新增示例时复制现有示例的 `package.json` 作为模板
- 依赖版本:
  - `@movk/nuxt`: `^0.1.1`
  - `@nuxt/ui`: `^4.2.1`
  - `nuxt`: `^4.2.1`
  - `tailwindcss`: `^4.1.17`

## 开发工作流

### 添加新示例

1. 在 `examples/` 下创建新目录
2. 复制现有示例的基础配置文件
3. 实现示例功能和 UI
4. 测试示例独立运行
5. 更新根目录 README.md

### 本地开发

```bash
# 安装依赖
pnpm install

# 进入示例目录
cd examples/[example-name]

# 启动开发服务器
pnpm dev

# 类型检查
pnpm typecheck

# 构建
pnpm build
```

### 代码检查

```bash
# 在根目录运行
pnpm lint          # ESLint 检查
pnpm lint:fix      # 自动修复
pnpm typecheck     # 类型检查所有示例
```

## 注意事项

### API 模拟

- 所有示例使用本地 `server/api/` 模拟后端
- API 响应使用统一格式:
  ```typescript
  {
    code: 0,      // 0 表示成功
    message: 'success',
    data: any     // 实际数据
  }
  ```
- 使用 `setTimeout` 模拟网络延迟

### UI 组件使用

- 充分使用 @nuxt/ui 组件库
- 保持 UI 简洁，避免过多文字说明
- 使用组件的视觉反馈(Loading、Badge、Progress 等)传达状态

### 状态管理

- 优先使用 composables 管理状态
- 避免引入额外的状态管理库
- 利用 Vue 3 的响应式系统

## 参考文档

- **Movk Nuxt**:https://nuxt.mhaibaraai.cn/llms.txt
- **@movk/core**:https://core.mhaibaraai.cn/llms.txt
- **Nuxt 文档**:https://nuxt.com/docs
- **Nuxt UI**:https://ui.nuxt.com/
- **TypeScript**:https://www.typescriptlang.org/

## 常见任务

### 创建新示例

参考现有示例的结构和配置，确保:
1. ✅ 独立的 Nuxt 应用配置
2. ✅ 完整的 package.json
3. ✅ TypeScript 配置
4. ✅ 模拟 API 端点
5. ✅ 简洁的 UI 实现

### 更新依赖

由于使用 pnpm workspace，更新依赖时:
1. 在根目录更新 `resolutions` 字段
2. 在各示例的 `package.json` 更新版本号
3. 运行 `pnpm install` 同步更新

### 调试问题

- 检查 Nuxt DevTools (开发模式自动启用)
- 查看浏览器控制台
- 检查 server/api 路由是否正确
- 验证 TypeScript 类型定义
