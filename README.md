# 酒窖 WineCellar — CS2 电竞教练网站

专业 CS2 电竞教练服务网站：服务展示与分步报价、在线预约（选时段 / 提交需求）、天赋测评、合作履历、教练管理后台。

## 技术栈

- **Next.js 14**（App Router，`output: 'export'` 纯静态导出）+ TypeScript + Tailwind CSS
- **next-intl** 中英双语（`/zh`、`/en`）
- **Supabase**（Postgres + Auth + RLS）云端数据层，断网自动回退 localStorage
- 无后端服务器：所有数据操作经 Supabase RLS 保护，游客/教练权限分离

## 功能模块

| 页面 | 路径 | 说明 |
|------|------|------|
| 首页 | `/zh` | Hero、数据统计、服务预览、CTA |
| 服务与定价 | `/zh/services` | 分步交互报价器 + 吸顶报价单 |
| 预约 | `/zh/booking` | 模式A 直接选教练开放时段；模式B 提交需求 |
| 天赋测评 | `/zh/assessment` | 反应速度等互动测评，结果上云 |
| 合作履历 | `/zh/portfolio` | 执教案例 |
| 关于 | `/zh/about` | 品牌介绍 |
| 教练登录 | `/zh/login` | Supabase Auth 邮箱登录（页脚"教练入口"） |
| 管理后台 | `/zh/admin` | 日程管理 + 预约状态流转，需教练权限 |

## 本地开发

```bash
cp .env.example .env.local   # 已预填 Supabase 公网配置
npm install
npm run dev                  # http://localhost:3000 → 自动跳转 /zh
```

## 教练账号

- 邮箱：`coach@winecellar.gg`
- 初始密码：`WC-Coach-2026-x7Kp9mQ2`
- **请尽快到 Supabase 控制台改密**：Authentication → Users → 该用户 → Update Password

## 一键部署到 Vercel（推荐）

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/049-tyee/winecellar&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY,NEXT_PUBLIC_SITE_URL&envDescription=Supabase%20%E5%85%AC%E7%BD%91%E9%85%8D%E7%BD%AE%E4%B8%8E%E7%AB%99%E7%82%B9%E5%9F%9F%E5%90%8D)

1. 点上方按钮，导入 GitHub 仓库 `049-tyee/winecellar`
2. 填入三个环境变量：
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://krsvkcvqwhiifocnywhu.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `sb_publishable_b_m8qqaZAkC9rDEHL5av9A_4gbNktAU`
   - `NEXT_PUBLIC_SITE_URL` = 你的正式域名（如 `https://winecellar.vercel.app`），用于 sitemap/OG
3. Deploy，完成。之后每次 `git push` 自动重新部署。

> 项目是纯静态导出（`out/`），也同样兼容 Cloudflare Pages / Netlify / GitHub Pages：
> 构建命令 `npm run build`，输出目录 `out`。注意设置同样的环境变量后再构建。

## 权限模型（Supabase RLS）

- **游客**：可提交预约 / 测评 / 订阅 / 合作洽谈；只能读公开日程；无法读任何他人数据
- **教练**（`User.role = COACH/ADMIN`）：登录后可读全部预约与测评、改预约状态、增删日程
- 游客占用时段通过 `occupy_slot` 安全函数（SECURITY DEFINER），防重复占用与越权

## 目录结构

```
src/
  app/[locale]/        # 双语路由页面
  components/          # Navbar/Footer/SectionHeading + 各业务组件
  lib/db.ts            # Supabase 数据层（云端优先，本地兜底）
  lib/auth.ts          # 教练登录 / 角色查询
  lib/storage.ts       # localStorage 兜底
  messages/            # zh.json / en.json 全部文案
scripts/gen-sitemap.mjs  # 构建前生成 public/sitemap.xml（读 NEXT_PUBLIC_SITE_URL）
```
