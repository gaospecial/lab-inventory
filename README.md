# 🧬 实验室材料仓库管理系统 (Lab Inventory)

这是一个基于 **Next.js 15** 和 **Supabase** 构建的轻量级实验室信息管理系统 (LIMS)。专门设计用于菌株、质粒及文本信息的存储、查询与二维码溯源。

## ✨ 核心功能

- **样品数字化**: 记录菌株名称、编号、存放位置及基因型等关键信息。
- **唯一溯源**: 自动为每个样品生成动态详情页，支持私有域名绑定。
- **扫码直达**: 配合二维码标签，手机扫码即可查看存放位置及详细说明。
- **无服务器架构**: 基于 Vercel + Supabase，零成本运维，高可用性。

## 🚀 技术栈

- **前端**: [Next.js](https://nextjs.org/) (App Router, TypeScript)
- **样式**: [Tailwind CSS](https://tailwindcss.com/)
- **数据库**: [Supabase](https://supabase.com/) (PostgreSQL)
- **图标**: [Lucide React](https://lucide.dev/)
- **部署**: [Vercel](https://vercel.com/)

## 🛠️ 快速开始

### 1. 环境准备
在项目根目录创建 `.env.local` 文件，并填入您的 Supabase 凭证：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key