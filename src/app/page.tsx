import Link from "next/link";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "首页 - 实验室材料仓库管理系统",
  description: "基于 Next.js 16 和 Supabase 的轻量级 LIMS",
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white p-6 dark:bg-black sm:p-12">
      <main className="w-full max-w-3xl space-y-16">
        <div className="space-y-6 text-center sm:text-left">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
            实验室材料仓库管理系统
          </h1>
          <p className="text-xl leading-relaxed text-zinc-600 dark:text-zinc-400">
            基于 Next.js 16 和 Supabase 的轻量级 LIMS。<br className="hidden sm:block" />
            专门设计用于菌株、质粒及文本信息的存储、查询与二维码溯源。
          </p>
          <div className="flex flex-col gap-4 pt-2 sm:flex-row">
            <Link
              href="/strain/LB-001"
              className="inline-flex items-center text-sm font-semibold text-zinc-900 underline decoration-zinc-500 underline-offset-4 hover:decoration-zinc-900 dark:text-zinc-100 dark:decoration-zinc-500 dark:hover:decoration-zinc-100"
            >
              查看示例样品 (LB-001) →
            </Link>
            <Link
              href="/box/box1"
              className="inline-flex items-center text-sm font-semibold text-zinc-900 underline decoration-zinc-500 underline-offset-4 hover:decoration-zinc-900 dark:text-zinc-100 dark:decoration-zinc-500 dark:hover:decoration-zinc-100"
            >
              查看示例盒子 (box1) →
            </Link>
          </div>
        </div>

        <div className="grid gap-12 md:grid-cols-2">
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              ✨ 核心功能
            </h2>
            <ul className="space-y-4 text-zinc-600 dark:text-zinc-400">
              <li>
                <strong className="font-medium text-zinc-900 dark:text-zinc-200">样品数字化:</strong> 记录菌株名称、编号、存放位置、拥有人及基因型等关键信息。
              </li>
              <li>
                <strong className="font-medium text-zinc-900 dark:text-zinc-200">Markdown 支持:</strong> 样品详细描述支持 Markdown 语法渲染，适合记录复杂备注。
              </li>
              <li>
                <strong className="font-medium text-zinc-900 dark:text-zinc-200">盒子/位置视图:</strong> 支持按存放位置查看该位置下的所有样品，配合二维码标签使用。
              </li>
              <li>
                <strong className="font-medium text-zinc-900 dark:text-zinc-200">扫码直达:</strong> 配合二维码标签，手机扫码即可查看样品详情或盒子列表。
              </li>
              <li>
                <strong className="font-medium text-zinc-900 dark:text-zinc-200">权限管理:</strong> 内置登录认证系统，确保只有授权用户可以编辑样品信息。
              </li>
            </ul>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              🚀 技术栈
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-zinc-600 dark:text-zinc-400">
              <li>Next.js 16 (App Router, React 19)</li>
              <li>Tailwind CSS v4</li>
              <li>Supabase (PostgreSQL, Auth)</li>
              <li>React Markdown (富文本渲染)</li>
              <li>React QR Code (二维码生成)</li>
              <li>Lucide React (图标库)</li>
              <li>Vercel (部署)</li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
