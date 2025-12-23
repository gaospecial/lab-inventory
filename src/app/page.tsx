import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white p-6 dark:bg-black sm:p-12">
      <main className="w-full max-w-3xl space-y-16">
        <div className="space-y-6 text-center sm:text-left">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
            实验室材料仓库管理系统
          </h1>
          <p className="text-xl leading-relaxed text-zinc-600 dark:text-zinc-400">
            基于 Next.js 和 Supabase 的轻量级 LIMS。<br className="hidden sm:block" />
            专门设计用于菌株、质粒及文本信息的存储、查询与二维码溯源。
          </p>
          <div className="pt-2">
            <Link
              href="/strain/LB-001"
              className="inline-flex items-center text-sm font-semibold text-zinc-900 underline decoration-zinc-500 underline-offset-4 hover:decoration-zinc-900 dark:text-zinc-100 dark:decoration-zinc-500 dark:hover:decoration-zinc-100"
            >
              查看示例样品 (LB-001) →
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
                <strong className="font-medium text-zinc-900 dark:text-zinc-200">样品数字化:</strong> 记录菌株名称、编号、存放位置及基因型等关键信息。
              </li>
              <li>
                <strong className="font-medium text-zinc-900 dark:text-zinc-200">唯一溯源:</strong> 自动为每个样品生成动态详情页，支持私有域名绑定。
              </li>
              <li>
                <strong className="font-medium text-zinc-900 dark:text-zinc-200">扫码直达:</strong> 配合二维码标签，手机扫码即可查看存放位置及详细说明。
              </li>
              <li>
                <strong className="font-medium text-zinc-900 dark:text-zinc-200">无服务器架构:</strong> 基于 Vercel + Supabase，零成本运维，高可用性。
              </li>
            </ul>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              🚀 技术栈
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-zinc-600 dark:text-zinc-400">
              <li>Next.js (App Router, TypeScript)</li>
              <li>Tailwind CSS</li>
              <li>Supabase (PostgreSQL)</li>
              <li>Lucide React</li>
              <li>Vercel</li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
