# VapeKeys — Agent Development Guide

> 本文档为 AI 编码助手提供项目上下文、技术约定和决策边界。修改代码前请先阅读相关章节。

---

## 1. 项目定位与边界

### 是什么
VapeKeys (`vapekeys.com`) 是一个面向美国 vape 批发采购者的 **verified discount intelligence** 站点。我们不是普通 coupon 站，而是提供经过验证的折扣信息、采购工具和 B2B 匹配服务。

### 目标用户
- Smoke shop owner / vape shop buyer
- Convenience store buyer / online reseller
- Distributor scout

### 当前阶段
MVP 已构建完成，17 个静态页面，使用 Next.js 静态导出部署在 Vercel。主数据目前硬编码在 `lib/offers.ts`，表单数据写入 Supabase。

### 绝对不做的事
- 不面向未成年人（任何页面必须有 21+ 提示）
- 不销售任何烟草/尼古丁产品（纯信息平台）
- 不提供法律建议
- 不承诺任何配送可用性
- 不做自动线索转卖（B2B 匹配是人工审核后手动联系）
- 不使用误导性标题（如 "guaranteed lowest price", "free vape samples"）

---

## 2. 技术栈与架构

### 核心栈
- **Framework**: Next.js 15 (App Router), React 19, TypeScript 5.5 (strict mode)
- **Styling**: Tailwind CSS 3.4, PostCSS, Autoprefixer
- **Icons**: `lucide-react`（唯一图标来源，禁止引入其他图标库）
- **Database**: Supabase (PostgreSQL)
- **Deploy**: Vercel，静态导出
- **Analytics**: Google Analytics (via `@next/third-parties/google`)

### 关键配置
```typescript
// next.config.mjs
images: { unoptimized: true }  // 静态导出必须关闭 Image Optimization
```

```typescript
// tsconfig.json
"paths": { "@/*": ["./*"] }  // 所有 import 使用 @/ 别名
"strict": true
"allowJs": false  // 禁止使用纯 JS 文件
```

### 目录职责

| 目录 | 职责 | 约束 |
|------|------|------|
| `app/` | Next.js App Router 页面 | 每个页面文件必须导出 `metadata`。SEO 页面需要完整的 `title` + `description`。 |
| `components/` | React 客户端组件 | 需要交互的组件必须加 `"use client"`。纯展示组件优先做服务端组件。 |
| `lib/` | 数据层、类型定义、工具函数 | `lib/offers.ts` 是当前主数据源。`lib/supabase.ts` 提供数据库客户端。 |
| `scripts/` | Node.js 运维脚本 | `.mjs` 扩展名，用于 CSV 分析、SERP 数据处理等。 |
| `supabase/` | 数据库 Schema | `schema.sql` 是表结构的唯一真相源。修改表结构必须同步更新此文件。 |
| `docs/` | 运营文档、业务决策 | 只读参考，不直接参与构建。 |
| `data/` | 原始数据文件、研究结果 | CSV、JSON、Excel 等，供脚本处理。 |

---

## 3. 数据模型与约定

### Offer 置信度分级（核心业务逻辑）
```typescript
type OfferConfidence = "verified" | "official" | "reported" | "expired";
```

| 级别 | 含义 | 排序优先级 |
|------|------|-----------|
| `verified` | 在 checkout 页面实际验证通过 | 最高（0） |
| `official` | 来自商家官网/官方渠道 | 高（1） |
| `reported` | 第三方 coupon 站报告，未独立验证 | 中（2） |
| `expired` | 确认已过期 | 最低（3） |

**排序规则**：`lib/offers.ts` 中的 `confidenceRank()` 定义了全局排序。任何列表展示都必须遵循此优先级。

### Offer 类型
```typescript
type OfferType = "coupon_code" | "automatic_discount" | "free_shipping" | "reward" | "sale" | "bogo" | "clearance";
```

### 数据更新规范
1. **Code 大小写**：数据库中保存大写，展示时保留原始格式
2. **日期格式**：`lastCheckedAt` 和 `expiresAt` 使用 `YYYY-MM-DD` 字符串
3. **金额字段**：`minimumOrderValue` 为数值（USD），展示时使用 `toLocaleString()`
4. **去重规则**：同一 merchant + 同一 code + 同一类型 = 合并为一条
5. **假码过滤**：`WELCOME10`、`SAVE10` 等通用码不能标记为 `verified`，最多 `reported`

### 当前数据架构的过渡状态
- **现状**：`lib/offers.ts` 硬编码，每周更新通过 Git 提交 + Vercel 重新部署
- **中期**：Supabase 表 + ISR/按需重验证
- **长期**：Admin 后台 + 自动 CSV 导入流水线

**AI 助手注意**：修改 `lib/offers.ts` 时，必须同步更新 `updatedAt` 常量。新增 offer 时必须填写完整的 `internalNotes`，说明数据来源和验证状态。

---

## 4. UI/UX 规范

### Tailwind 自定义色板（强制使用）
禁止在样式中硬编码十六进制颜色，必须使用以下语义 token：

| Token | 色值 | 用途 |
|-------|------|------|
| `ink` | `#17201b` | 主文本、深色背景、边框 |
| `moss` | `#53695f` | 次要文本、辅助信息 |
| `leaf` | `#1d6f54` | 主 CTA、成功状态、链接 hover |
| `mint` | `#dff3e9` | 成功背景、轻强调区块 |
| `clay` | `#a75d38` | 警告、次要 CTA、价格/折扣强调 |
| `wheat` | `#f4e2bf` | 温暖背景、次要强调 |
| `paper` | `#fbfaf6` | 页面背景色 |

### 组件风格约定
1. **焦点环**：所有可交互元素必须加 `focus-ring`（项目中已全局定义）
2. **圆角**：卡片/区块用 `rounded-lg` 或 `rounded-xl`，按钮用 `rounded-md`
3. **阴影**：卡片统一用 `shadow-soft`（自定义阴影 token）
4. **间距**：页面内容区最大宽度 `max-w-6xl`，水平内边距 `px-4`
5. **图标**：所有图标必须加 `aria-hidden="true"`，交互按钮加 `aria-label`
6. **字体**：不使用自定义字体，依赖系统字体栈（Tailwind 默认）

### 响应式断点
- 移动优先：基础样式适配移动端
- `sm:` (640px+)：小屏平板
- `md:` (768px+)：平板/小桌面
- `lg:` (1024px+)：桌面

---

## 5. SEO 与结构化数据

### 每个页面必须包含
1. **metadata**: `title` + `description`（在页面文件顶部导出）
2. **语义化 HTML**: 正确使用 `section`, `article`, `h1`-`h3`, `nav`, `footer`
3. **内部链接**：相关页面之间必须有上下文链接

### 主 SEO 页面的特殊要求
- `/vape-wholesale-usa-discount-code` 等长尾页包含完整 FAQ JSON-LD
- `app/sitemap.ts` 自动生成 sitemap，新增页面必须确保被包含
- `app/robots.ts` 控制爬虫行为

### 禁止的 SEO 做法
- 不要创建 doorway pages（无实质内容的纯关键词页面）
- 不要堆砌关键词到不自然的程度
- 不要隐藏文本或链接
- 所有 affiliate/sponsored 关系必须明确标注

---

## 6. 表单与 Server Actions

### 表单处理统一模式
所有表单通过 `app/actions.ts` 中的 Server Actions 处理：

```typescript
"use server";
// 1. 从 formData 提取字段
// 2. 基础验证（必填、邮箱格式等）
// 3. 合规验证（21+ 确认、 consent checkbox）
// 4. 写入 Supabase（如果配置）
// 5. 返回 ActionResult: { success, message } | { success: false, error }
```

### 表单合规 checklist
- [ ] 年龄确认 checkbox（21+）— Newsletter 订阅必填
- [ ] 联系同意 checkbox — Quote Match 必填
- [ ] 邮箱必须包含 `@`
- [ ] 错误消息必须对用户友好，不暴露内部错误细节
- [ ] Beehiiv 集成（可选）失败时不阻塞 Supabase 写入

---

## 7. 合规红线（不可违反）

### 内容层面
1. **年龄**：所有页面底部必须有 21+ disclaimers
2. **健康声明**：绝不暗示任何健康、安全或戒烟功效
3. **免费样品**：绝不推广免费烟草/ENDS 样品
4. **州限制**：不指导绕过州限制，州限制信息用中性措辞（"Subject to state restrictions"）
5. **法律**：明确标注 "informational and not legal advice"

### 代码层面
1. **隐私**：用户邮箱存储在 Supabase，不记录 IP 或敏感个人信息
2. **同意**：所有 checkbox 默认未勾选，用户必须主动勾选
3. **数据用途**：Quote Match 数据不自动分发，进入 review queue 后人工处理

### 修改代码时的自检问题
- 这个新功能是否可能被解读为面向未成年人？
- 这个文案是否暗示了任何产品功效？
- 这个表单是否收集了超出必要范围的数据？
- 这个页面是否有适当的 disclaimer？

---

## 8. 运营节奏与代码更新

### 每周更新（Code 验证日）
- 验证 5-10 个热门 codes
- 更新 `lib/offers.ts`：修改 `confidence`、`lastCheckedAt`、`expiresAt`
- 更新 `updatedAt` 常量
- `git commit` + `git push` → Vercel 自动部署

### 每月更新
- 新增 1-2 个 merchant 页面（复制现有结构）
- 新增 1 篇深度内容文章（长尾 SEO）
- 清理 expired codes（标记为 `expired`，不删除）
- 检查并更新所有页面的 `lastModified`（sitemap）

### AI 助手执行内容更新时的步骤
1. 阅读当前 `lib/offers.ts` 了解数据格式
2. 确认新数据符合所有字段规范
3. 更新 `updatedAt` 常量
4. 检查是否需要同步更新 FAQ 内容
5. 检查是否需要新增 sitemap 条目
6. 本地 `npm run build` 验证通过

---

## 9. 文件修改 checklist

### 修改 `lib/offers.ts`
- [ ] 新 offer 有完整的字段（id, merchantId, offerType, title, sourceUrl, confidence, lastCheckedAt）
- [ ] `id` 使用语义化 slug（如 `tvm-10offweel`）
- [ ] `code` 为 null 时说明原因（hidden, auto-applied, program）
- [ ] `internalNotes` 记录数据来源和验证细节
- [ ] 更新 `updatedAt`

### 新增页面（`app/`）
- [ ] 导出 `metadata`（title, description）
- [ ] 使用 `max-w-6xl px-4 mx-auto` 布局
- [ ] 包含适当的 disclaimer 文本
- [ ] 添加到 `app/sitemap.ts`
- [ ] 如果适用，添加到 `app/layout.tsx` 的 navItems

### 修改 `supabase/schema.sql`
- [ ] 所有变更必须同步到 schema.sql
- [ ] 使用 `if not exists` 避免重复执行错误
- [ ] 字段约束（check, default, not null）必须明确

---

## 10. 调试与开发

### 本地开发
```bash
npm run dev      # Next.js dev server
npm run build    # 生产构建验证（必须无错误）
npm run lint     # ESLint 检查
```

### 环境变量
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`：Supabase 连接
- `NEXT_PUBLIC_GA_ID`：Google Analytics（可选）
- `BEEHIIV_PUBLICATION_ID` / `BEEHIIV_API_KEY`：Newsletter 集成（可选）

缺少 Supabase 环境变量时，表单会回退到成功消息但不存储数据（`isSupabaseConfigured()` 保护）。

---

## 11. 扩展路线图（供参考）

### 近期（1-2 个月）
- [ ] Plausible Analytics 接入（比 GA 更轻量）
- [ ] `copy_code` / `outbound_click` 事件追踪
- [ ] Admin 后台：审核 source_pages、编辑 offers
- [ ] CSV 导入流水线自动化

### 中期（3-6 个月）
- [ ] Supabase 作为主数据源（替代硬编码）
- [ ] ISR 按需重验证（内容更新无需全量 rebuild）
- [ ] Buttondown/ConvertKit 替换手动邮件发送
- [ ] 商家 affiliate 合作追踪链接

### 长期（6-12 个月）
- [ ] 用户账号系统（可选）
- [ ] 自动 coupon 验证机器人
- [ ] B2B 报价匹配自动化
- [ ] 多语言支持（评估必要性）

---

*最后更新：2026-05-25*
*本文件应随项目演进持续更新。重大架构变更或业务策略调整后必须同步修改。*
