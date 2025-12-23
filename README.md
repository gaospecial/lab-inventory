# 🧬 实验室材料仓库管理系统 (Lab Inventory)

这是一个基于 **Next.js 16** 和 **Supabase** 构建的轻量级实验室信息管理系统 (LIMS)。专门设计用于菌株、质粒及文本信息的存储、查询与二维码溯源。

## ✨ 核心功能

- **样品数字化**: 记录菌株名称、编号、存放位置、拥有人、管理员及基因型等关键信息。
- **Markdown 支持**: 样品详细描述支持 Markdown 语法渲染，适合记录复杂的基因型结构或实验备注。
- **盒子/位置视图**: 支持按存放位置（如冰箱盒子）查看该位置下的所有样品，配合盒子二维码标签可快速查看内容物。
- **唯一溯源**: 自动为每个样品和盒子生成动态详情页，支持私有域名绑定。
- **扫码直达**: 配合二维码标签，手机扫码即可查看样品详情或盒子列表。
- **权限管理**: 内置登录认证系统，确保只有授权用户可以编辑样品信息。
- **无服务器架构**: 基于 Vercel + Supabase，零成本运维，高可用性。

## 🚀 技术栈

- **前端框架**: [Next.js 16](https://nextjs.org/) (App Router, React 19)
- **样式方案**: [Tailwind CSS v4](https://tailwindcss.com/)
- **后端/数据库**: [Supabase](https://supabase.com/) (PostgreSQL, Auth)
- **功能组件**:
  - [React Markdown](https://github.com/remarkjs/react-markdown): 渲染富文本描述
  - [React QR Code](https://github.com/rossohan/react-qr-code): 生成溯源二维码
  - [Lucide React](https://lucide.dev/): 精美图标库
- **部署平台**: [Vercel](https://vercel.com/)

## 🛠️ 快速开始

### 1. 环境准备
在项目根目录创建 `.env.local` 文件，并填入您的 Supabase 凭证：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_APP_URL=http://localhost:3000 # 用于生成二维码链接
```

### 2. 安装依赖

使用 npm 或 yarn 安装项目依赖：

```bash
npm install
```

### 3. 运行开发服务器

启动本地开发服务器：

```bash
npm run dev
```

### 4. 访问应用

打开浏览器，访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 📦 部署

将项目部署到 Vercel：

1. 登录 [Vercel](https://vercel.com/) 并创建一个新项目。
2. 连接您的 GitHub 仓库。
3. 设置环境变量（同 `.env.local` 文件，注意 `NEXT_PUBLIC_APP_URL` 应为您的生产环境域名）。
4. 点击部署按钮，等待部署完成。
5. 访问您的 Vercel 域名查看应用。
6. (可选) 绑定自定义域名（如：`https://lab.bio-spring.top`）。
