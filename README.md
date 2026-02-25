# 🧬 实验室材料仓库管理系统 (Lab Inventory)

这是一个基于 **Next.js 16** 和 **PostgreSQL** 构建的轻量级实验室信息管理系统 (LIMS)。专门设计用于菌株、质粒及文本信息的存储、查询与二维码溯源。

## ✨ 核心功能

- **样品数字化**: 记录菌株名称、编号、存放位置、拥有人、管理员及基因型等关键信息。
- **Markdown 支持**: 样品详细描述支持 Markdown 语法渲染，适合记录复杂的基因型结构或实验备注。
- **盒子/位置视图**: 支持按存放位置（如冰箱盒子）查看该位置下的所有样品，配合盒子二维码标签可快速查看内容物。
- **唯一溯源**: 自动为每个样品和盒子生成动态详情页，支持私有域名绑定。
- **扫码直达**: 配合二维码标签，手机扫码即可查看样品详情或盒子列表。
- **权限管理**: 基于角色的访问控制（RBAC），支持全局管理员、局部管理员和普通用户。
- **自主可控**: 数据库存储在阿里云 ECS，数据完全自主可控。

## 🚀 技术栈

- **前端框架**: [Next.js 16](https://nextjs.org/) (App Router, React 19)
- **样式方案**: [Tailwind CSS v4](https://tailwindcss.com/)
- **数据库**: PostgreSQL (部署在阿里云 ECS)
- **认证**: JWT + bcrypt
- **功能组件**:
  - [React Markdown](https://github.com/remarkjs/react-markdown): 渲染富文本描述
  - [React QR Code](https://github.com/rossohan/react-qr-code): 生成溯源二维码
  - [Lucide React](https://lucide.dev/): 精美图标库
- **部署平台**: [Vercel](https://vercel.com/) (前端) + [阿里云 ECS](https://ecs.console.aliyun.com/) (数据库)

## 🛠️ 快速开始

### 1. 环境准备

复制 `.env.example` 为 `.env.local`  并配置：

```bash
cp .env.example .env.local
```

编辑 `.env.local`：

```env
DATABASE_URL=postgresql://用户名:密码@你的ECS域名:5432/lab_inventory
JWT_SECRET=your-random-secret-key-min-32-characters-long
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. 安装依赖

```bash
npm install
```

### 3. 数据库初始化

```bash
# 初始化数据库表结构
psql "$DATABASE_URL" -f scripts/init-db.sql

# 迁移权限系统（首次部署后执行）
psql "$DATABASE_URL" -f scripts/migrate-permissions.sql
```

### 4. 运行开发服务器

```bash
npm run dev
```

### 5. 访问应用

打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 👥 用户和权限管理

系统支持三种用户角色：

| 角色 | 权限 |
|------|------|
| **全局管理员** | 编辑所有菌株信息，管理用户和权限 |
| **局部管理员** | 只能编辑被授权的特定菌株信息 |
| **普通用户** | 只能查看菌株信息，无法编辑 |

### 设置第一个管理员

```bash
# 将指定用户设为管理员
DATABASE_URL="your-db-url" node scripts/set-admin.js user@example.com
```

### 用户管理界面

全局管理员可访问 `/admin/users` 进行：
- 查看所有用户列表
- 修改用户角色（设为局部管理员/普通用户）
- 删除用户
- 为局部管理员分配菌株权限

### 登录方式

- 支持**用户名**或**邮箱**登录
- 注册时自动检查邮箱和用户名是否重复

## 📦 部署

### 阿里云 ECS 配置 PostgreSQL

1. SSH 登录你的阿里云 ECS
2. 执行 `scripts/setup-postgres.sh` 安装 PostgreSQL
3. 开放安全组 5432 端口

### Vercel 部署

1. 推送代码到 GitHub
2. 登录 [Vercel](https://vercel.com/) 创建新站点
3. 设置环境变量（同上）
4. 点击 Deploy

## 📝 更新日志

查看完整的更新历史，请参见 [CHANGELOG.md](./CHANGELOG.md)。

## 📄 许可证

MIT License