# CLAUDE.md - 项目上下文指南

## 项目概述

实验室材料仓库管理系统（Lab Inventory），基于 Next.js 16 + PostgreSQL 构建的轻量级 LIMS。用于菌株、质粒等生物材料的存储、查询与二维码溯源。

## 技术栈

- 前端: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4
- 后端: Next.js API Routes, PostgreSQL (pg driver)
- 认证: JWT + bcrypt, 中间件保护路由
- 部署: Vercel (前端) + 阿里云 ECS PostgreSQL (数据库)

## 目录结构

```
src/
├── app/                          # Next.js App Router
│   ├── api/strain/[code]/        # 菌株 API（字段白名单防泄露）
│   ├── api/box/[code]/           # 盒子 API
│   ├── admin/
│   │   └── users/                # 用户管理（仅 admin）
│   │       └── [id]/permissions/ # 用户权限管理
│   ├── login/                    # 登录页和 actions
│   ├── strain/[code]/            # 菌株详情和编辑页
│   └── box/[box]/                # 盒子位置视图
├── components/                   # React 组件（QRCodeLabel, PrintButton, DataMatrixLabel）
├── lib/
│   ├── db.ts                     # PostgreSQL 连接池（pg.Pool）
│   ├── auth.ts                   # JWT 认证（generateToken, verifyToken, getCurrentUser）
│   └── password.ts               # bcrypt 密码哈希
└── middleware.ts                 # 路由保护（/edit, /admin 需登录）
scripts/                          # 数据库初始化和迁移脚本
```

## 数据库约定

- 通过 `src/lib/db.ts` 的 `query()` 函数操作，使用参数化查询（`$1, $2`）
- 主表: `mgsc_germplasm`（菌株数据）、`users`（用户）、`strain_permissions`（权限）
- 用户角色: `admin`（全局管理员）、`manager`（局部管理员）、`user`（只读）

## 认证模式

- JWT token 存储在 httpOnly cookie（`auth-token`）
- `middleware.ts` 保护 `/edit` 和 `/admin` 路径
- Server Component 中通过 `getCurrentUser()` 获取当前用户
- `canEditStrain(user, strainCode)` 检查编辑权限

## API 约定

- API 路由使用字段白名单模式，防止内部数据泄露
- 错误返回 `{ error: string }` 格式
- 所有写操作需验证用户权限

## 开发命令

```bash
npm run dev    # 启动开发服务器
npm run build  # 构建生产版本
npm run lint   # ESLint 检查
```

## 环境变量

在 `.env.local` 中配置：

- `DATABASE_URL` - PostgreSQL 连接字符串
- `JWT_SECRET` - JWT 签名密钥
- `NEXT_PUBLIC_APP_URL` - 应用 URL

## 代码规范

- TypeScript 严格模式
- ESLint 使用 `eslint-config-next`（core-web-vitals + typescript）
- Tailwind CSS v4，配合 `@tailwindcss/typography` 插件
- 启用 React Compiler（`babel-plugin-react-compiler`）
- API 路由使用字段白名单，不要直接返回 `SELECT *`

## 常用依赖

- `pg` - PostgreSQL 客户端
- `jsonwebtoken` / `bcryptjs` - 认证相关
- `bwip-js` - DataMatrix 条码生成
- `react-qr-code` - QR 码生成
- `lucide-react` - 图标库
- `react-markdown` - Markdown 渲染
- `csv-parse` - CSV 数据导入

## 注意事项

- `.env.local` 包含敏感信息，切勿提交
- 修改数据库结构后需更新 `scripts/` 中的迁移脚本
- 新增 API 端点时务必使用字段白名单，避免泄露内部字段
- `middleware.ts` 中的 matcher 配置决定哪些路径需要认证保护
