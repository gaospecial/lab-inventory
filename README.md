# 🧬 实验室材料仓库管理系统 (Lab Inventory)

这是一个基于 **Next.js 16** 和 **PostgreSQL** 构建的轻量级实验室信息管理系统 (LIMS)。专门设计用于菌株、质粒及文本信息的存储、查询与二维码溯源。

## ✨ 核心功能

- **样品数字化**: 记录菌株名称、编号、存放位置、拥有人、管理员及基因型等关键信息。
- **Markdown 支持**: 样品详细描述支持 Markdown 语法渲染，适合记录复杂的基因型结构或实验备注。
- **盒子/位置视图**: 支持按存放位置（如冰箱盒子）查看该位置下的所有样品，配合盒子二维码标签可快速查看内容物。
- **唯一溯源**: 自动为每个样品和盒子生成动态详情页，支持私有域名绑定。
- **扫码直达**: 配合二维码标签，手机扫码即可查看样品详情或盒子列表。
- **权限管理**: 内置登录认证系统，确保只有授权用户可以编辑样品信息。
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

### 3. 运行开发服务器

```bash
npm run dev
```

### 4. 访问应用

打开浏览器访问 [http://localhost:3000](http://localhost:3000)

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

## 📄 许可证

MIT License