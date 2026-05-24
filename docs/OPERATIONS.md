# VapeKeys 日常运营工作手册

> 本文档定义网站上线后的固定运营节奏、数据追踪方法和优化策略。
> 最后更新：2026-05-23

---

## 一、运营工作分类

| 类别 | 频率 | 核心目标 |
|------|------|---------|
| **数据维护** | 每周 | 保持 offers 新鲜度和准确性 |
| **内容运营** | 每周/每月 | SEO 收录、长尾词覆盖、用户价值 |
| **用户运营** | 每周 | 邮件列表增长、B2B 线索积累 |
| **商务拓展** | 每月 | Affiliate 合作、exclusive codes |
| **技术维护** | 按需 | 稳定性、性能、安全 |
| **数据分析** | 每月 | 找到增长杠杆和优化点 |

---

## 二、每周固定工作（~2-3 小时）

### 周一：Code 验证日

| 任务 | 动作 | 工具 |
|------|------|------|
| 验证 5-10 个热门 codes | 走到商家 checkout 页，输入 code，截图记录结果 | 浏览器 + 截图工具 |
| 更新 `lib/offers.ts` | 修改 confidence、lastCheckedAt、expiresAt、internalNotes | VS Code + Git |
| 检查过期 codes | 把 confirmed expired 的标记为 expired | 同上 |
| 部署更新 | `git commit` + `git push`，Vercel 自动部署 | Git + Vercel |

**关键原则：**
- 优先验证上周点击量高的 codes（需要 Analytics 后才能知道）
- 新发现的 code 至少 cross-reference 2 个来源才加入
- 每次验证都要记录：成功/失败、实际折扣额、限制条件、截图文件名

### 周三：内容检查日

| 任务 | 动作 |
|------|------|
| 检查 GSC | 查看 Coverage、Core Web Vitals、搜索查询报告 |
| 检查 Supabase 数据 | 查看 newsletter_subscribers、quote_requests 增长 |
| 回复用户提交 | 处理 `/submit` 页面提交的 code sources |
| 更新 lastCheckedAt | 即使没有验证，也把页面的 "Last updated" 日期刷新（给搜索引擎 freshness 信号）|

### 周五：Newsletter 准备日

| 任务 | 动作 |
|------|------|
| 整理本周验证结果 | 3 个能用、2 个过期、1 个新发现 |
| 撰写邮件内容 | 简洁明了：本周最佳 code + 过期提醒 + 新商家动态 |
| 发送邮件 | 从 Supabase 导出 CSV → 用邮件服务发送（现阶段手动）|
| 归档邮件内容 | 保存到 docs/ 或 Notion，方便复用 |

**Newsletter 内容模板：**
```
Subject: This week's verified wholesale codes (3 active, 2 expired)

Hi [Name],

Here's what we verified this week:

✅ ACTIVE
• 10OFFWEEL @ The Vape Mall — 15% off + free shipping
• SD565S @ The Vape Mall — 15% off everything

❌ EXPIRED
• SERVICE15 @ Flawless Vape Shop — no longer works

🔍 NEW
• FVS15 @ Flawless Vape Shop — 10% off first order

[Browse all codes →]

---
VapeKeys | Unsubscribe
```

---

## 三、每月固定工作（~4-6 小时）

### 第 1 周：商家 Outreach

| 任务 | 目标 | 方法 |
|------|------|------|
| Cold Email 3-5 家商家 | 建立 affiliate 或 exclusive code 合作 | 邮件模板见下方 |
| 跟进上月 outreach | 回复率通常 10-20%，需要 follow-up | 邮件/LinkedIn |

**Cold Email 模板：**
```
Subject: Partnership idea — verified discount tracking for [Merchant Name]

Hi [Name],

I run VapeKeys.com, a discount tracker focused on wholesale vape buyers. We currently list [X] offers from [Y] merchants and send weekly deal alerts to [Z] verified business buyers.

I'd like to explore two things:
1. Affiliate partnership — we drive qualified wholesale traffic to your site
2. Exclusive code — a discount code only available through VapeKeys

Would you be open to a 10-min call next week?

Best,
[Your name]
VapeKeys.com
```

### 第 2 周：内容生产

| 任务 | 目标 | 方法 |
|------|------|------|
| 发布 1 篇深度文章 | 占领新长尾词，获得外链 | 见内容选题库 |
| 更新 1 个商家页面 | 新增 store 专属页 | 复制现有 store 页面结构 |

**内容选题库（按优先级）：**
1. "Free Shipping Thresholds Compared: Vape Wholesale USA vs Flawless vs Geek Vape"
2. "Which States Require a License to Buy Wholesale Vape?"
3. "Geek Bar Pulse 15K Wholesale Margin Analysis"
4. "Q3 2026 Vape Wholesale Discount Trends"
5. "How to Spot Fake Coupon Codes (Wholesale Buyer Guide)"

### 第 3 周：数据分析

| 任务 | 动作 | 工具 |
|------|------|------|
| 分析 GSC 数据 | 找到有展示但无点击的关键词；找到排名 5-15 位的词优化 | GSC |
| 分析 Supabase 数据 | subscriber 增长趋势、quote request 质量 | Supabase Dashboard |
| 检查网站性能 | Lighthouse / PageSpeed Insights | Chrome DevTools |
| 竞品监控 | 检查 CouponBirds、DontPayFull 是否有新 codes | 手动 |

### 第 4 周：技术维护

| 任务 | 动作 |
|------|------|
| 更新依赖 | `npm audit fix`，检查 Next.js 是否有安全更新 |
| 检查 broken links | 所有 sourceUrl 是否还能访问 |
| 备份数据 | Supabase 数据导出备份 |
| 更新 sitemap lastModified | 刷新所有页面的 lastModified 日期 |

---

## 四、季度复盘（每 3 个月）

| 指标 | 目标（Q1） | 实际 | 差距分析 |
|------|-----------|------|---------|
| 自然搜索点击/月 | 200 | | |
| 邮件订阅数 | 50 | | |
| Verified codes 数 | 50 | | |
| Exclusive codes | 1 | | |
| Affiliate 申请 | 3 | | |
| Quote Match 提交 | 10 | | |
| 外链数量 | 10 | | |

**复盘问题：**
1. 哪些关键词带来了最多流量？如何加倍投入？
2. 哪些页面的跳出率最高？为什么？
3. Newsletter 的打开率/点击率是多少？什么内容表现最好？
4. 商家的回复率如何？需要调整 outreach 策略吗？
5. 技术债：哪些代码需要重构？

---

## 五、数据追踪清单

### 必须追踪的事件（等 Analytics 接入后）

| 事件 | 意义 | 实现方式 |
|------|------|---------|
| `copy_code` | 用户复制了 code，说明内容有价值 | Plausible custom event |
| `outbound_click` | 用户点击了商家链接，是 affiliate 转化的上游 | Plausible custom event |
| `newsletter_submit` | 邮件列表增长 | Supabase + Plausible |
| `quote_match_submit` | B2B 线索 | Supabase + Plausible |
| `offer_source_submit` | UGC 参与度 | Supabase + Plausible |
| `filter_click` | 用户使用了 confidence filter，说明对可信度敏感 | Plausible custom event |

### 关键转化漏斗

```
Impression (SERP)
  → Click (organic visit)
    → Engage (scroll past hero)
      → Copy code / Click outbound
        → Purchase (merchant site)
          → Commission (affiliate)
```

我们目前能追踪到 `Copy code / Click outbound`，Purchase 和 Commission 需要 affiliate 平台数据。

---

## 六、快速决策框架

### 当发现一个新 code 时

```
1. 能否找到 2+ 独立来源确认？
   → 是：加入 offers，confidence = reported，sourceCount = N
   → 否：不加入，或加入 source_pages review queue

2. 能否走到 checkout 验证？
   → 是：升级到 verified
   → 否：保持 reported，加备注 "pending checkout verification"

3. 是否来自商家官方渠道？
   → 是：标记 official
   → 否：按上述流程
```

### 当有商家联系合作时

```
1. 是否要求付费置顶？
   → 是：明确标注 "Sponsored"，不修改 confidence
   → 否：按正常验证流程处理

2. 是否提供 exclusive code？
   → 是：站内标注 "Exclusive to VapeKeys"，这是最高优先级内容
   → 否：正常 listing

3. 是否要求修改现有评价？
   → 是：拒绝，保持 editorial independence
   → 否：继续洽谈
```

---

## 七、时间分配建议

| 活动 | 每周 | 每月 |
|------|------|------|
| Code 验证 | 2h | 8h |
| Newsletter | 1h | 4h |
| Content 写作 | 0 | 4h |
| 商家 Outreach | 0 | 2h |
| 数据分析 | 0.5h | 2h |
| 技术维护 | 0 | 2h |
| **总计** | **3.5h** | **22h** |

> 每月约 22 小时，相当于每周 5-6 小时的副业强度。前期（前 3 个月）建议投入更多时间建立节奏和数据基础。

---

## 八、工具栈

| 用途 | 工具 | 成本 |
|------|------|------|
| 部署 | Vercel | 免费 |
| 数据库 | Supabase | 免费 |
| Analytics | Plausible（推荐）或 GA4 | $9/月 或 免费 |
| 邮件发送 | 现阶段手动导出 CSV + Gmail；长期 Buttondown | 免费 → $9/月 |
| 截图/验证 | 浏览器 + 本地文件夹 | 免费 |
| 内容管理 | Notion / Markdown in repo | 免费 |
| 外链监控 | Ahrefs free / Google Alerts | 免费 |
| 竞品监控 | 手动 + 书签 | 免费 |

---

*本文档随业务增长持续更新。每次重大策略调整后追加记录。*
