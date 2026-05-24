# VapeKeys.com 部署指南

> 本文档记录从本地到 Vercel 上线的完整步骤。

---

## 一、当前状态

| 项目 | 状态 |
|------|------|
| 域名 | `vapekeys.com` |
| 代码仓库 | Git 已初始化，56 个文件已提交 |
| Build | ✅ 17 个静态页面通过 |
| Supabase | 用户已创建项目并执行 schema |
| Newsletter | Beehiiv 暂缓，改用 Supabase 过渡方案 |

---

## 二、Newsletter 平替方案（Beehiiv 暂缓）

### 推荐方案：纯 Supabase 过渡（零成本，立即可用）

**逻辑**：
- 用户提交邮箱 → `app/actions.ts` → Supabase `newsletter_subscribers` 表
- 每周/每月从 Supabase Dashboard 导出 CSV
- 用邮件客户端（Gmail/Outlook）或邮件服务（Resend/SendGrid）批量发送

**优点**：
- 零额外注册成本
- 数据完全在自己手中
- 已有代码支持，无需改代码

**缺点**：
- 需要手动发送（MVP 早期 50-100 订阅者完全可以接受）
- 没有自动化 welcome email

**未来迁移路径**：订阅量 > 100 后，导出 CSV 一键迁移到 Buttondown/ConvertKit。

---

### 备选方案对比

| 方案 | 免费 Tier | API | 复杂度 | 适合阶段 |
|------|-----------|-----|--------|----------|
| **Supabase 纯存 + 手动发** | ∞ | 已有 | 最低 | MVP 0-3 个月 ✅ |
| **Buttondown** | 1,000 订阅 | 有 | 低 | 3-6 个月 |
| **ConvertKit** | 1,000 订阅 | 有 | 低 | 3-6 个月 |
| **Mailchimp** | 500 订阅 | 有 | 中 | 任何时候 |
| **Cloudflare Workers + Resend** | ∞ | 自建 | 高 | 长期自控 |

> **拍板建议**：先用 Supabase 纯存方案，等订阅量过 50 再考虑 Buttondown。现在不要为 newsletter 平台分心。

---

## 三、Supabase 环境变量配置

你已经创建好 Supabase 项目并执行了 `supabase/schema.sql`。现在需要把凭证注入到 Vercel。

### 需要的环境变量

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

> 注意：`app/actions.ts` 使用的是 `lib/supabase.ts`，它读取的是 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY`。不需要 Service Role Key（因为 Server Actions 运行在服务端，但这里用的是 anon key + upsert/insert 权限）。

### 配置方式（任选一种）

**方式 A：Vercel Dashboard（推荐）**
1. 部署后进入 Project Settings → Environment Variables
2. 添加上面两个变量
3. Redeploy

**方式 B：Vercel CLI**
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel --prod
```

**方式 C：本地 `.env.local`（仅本地开发）**
```bash
cp .env.local.example .env.local
# 编辑 .env.local 填入真实值
```

---

## 四、Vercel 部署

### 方式一：Vercel CLI（最快，不需要 GitHub）

```bash
# 1. 登录（如果还没登录）
vercel login

# 2. 初始化项目（首次）
vercel
# 按提示选择 scope、项目名称

# 3. 配置环境变量
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY

# 4. 生产部署
vercel --prod
```

### 方式二：GitHub + Vercel Dashboard（推荐长期）

```bash
# 1. 在 GitHub 创建新仓库（不要初始化 README）
# 2. 本地关联并推送
git remote add origin https://github.com/YOUR_USERNAME/vape-wholesale-discount-mvp.git
git branch -M main
git push -u origin main

# 3. 登录 Vercel Dashboard → Add New Project → Import Git Repository
# 4. 配置 Framework Preset 为 Next.js
# 5. 添加 Environment Variables
# 6. Deploy
```

### 方式三：绑定自定义域名

1. Vercel Dashboard → Project → Domains
2. 添加 `vapekeys.com`
3. 按提示在域名 DNS 中添加 CNAME / A 记录
4. 等待 SSL 自动签发（通常 1-5 分钟）

---

## 五、部署后验证清单

| 检查项 | URL | 期望结果 |
|--------|-----|----------|
| 首页 | `https://vapekeys.com` | 正常显示 |
| 主着陆页 | `https://vapekeys.com/vape-wholesale-usa-discount-code` | 正常显示，含 FAQ JSON-LD |
| Sitemap | `https://vapekeys.com/sitemap.xml` | 10 个 URL，域名正确 |
| Robots | `https://vapekeys.com/robots.txt` | Sitemap 指向 vapekeys.com |
| Newsletter 表单 | 首页底部 | 提交后显示成功消息 |
| Quote Match 表单 | `https://vapekeys.com` | 提交后数据进入 Supabase |
| Supabase 数据 | Supabase Dashboard → Table Editor | `newsletter_subscribers`、`quote_requests` 有数据 |

---

## 六、部署后立即做（SEO 收录）

1. **Google Search Console**
   - 访问 [search.google.com/search-console](https://search.google.com/search-console)
   - 添加属性：`vapekeys.com`
   - 验证方式：HTML 标签 或 DNS 记录
   - 提交 Sitemap：`https://vapekeys.com/sitemap.xml`

2. **Bing Webmaster Tools**
   - 访问 [bing.com/webmasters](https://bing.com/webmasters)
   - 通常会自动从 GSC 同步，但建议手动提交一次

---

## 七、下一步（上线后 1-2 天）

1. [ ] 验证 Google 是否已收录 `vapekeys.com`
2. [ ] 验证 `site:vapekeys.com` 在 Google 有结果
3. [ ] 观察 Search Console 的 Core Web Vitals
4. [ ] 发 5 封商家 Cold Email（启动 affiliate 合作）

---

*最后更新：2026-05-23*
