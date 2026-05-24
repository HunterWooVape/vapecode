# Vape Wholesale Discount Code MVP 落地方案

## 1. 项目判断

这个项目可以长期做，但第一阶段不要把它定义成普通 coupon 站。更好的定位是：

> 面向美国 vape 批发采购者的 verified discount intelligence 页面和采购省钱工具。

短期目标是抢 `vape wholesale usa discount code` 及相关长尾词的自然搜索流量。长期目标是沉淀批发商、优惠、验证状态、折扣规则、配送限制和采购成本数据，逐步从单页内容站升级为垂直采购工具。

## 2. MVP 目标

第一版只解决三个问题：

1. 用户能快速找到可信的 wholesale vape discount / coupon / deal。
2. 用户能判断这个优惠是否真的适合批发采购。
3. 我们能持续导入、验证、更新 coupon 数据。

第一版不追求大而全，不做账号系统，不做复杂商家后台，不做支付，不碰普通消费者导购。

## 3. SEMrush 外链方法是否可行

可行，而且适合作为冷启动数据挖掘方法。

SEMrush 的 Backlink Analytics 可以导出外链数据，API 也有 backlinks 相关能力。MVP 阶段建议先做“SEMrush CSV 手动导入”，不要一开始接 API，原因是：

1. 开发成本低，7 天内能上线。
2. SEMrush API 权限和额度可能受套餐限制。
3. 人工审核在 vape 这种强监管品类里很重要。
4. CSV 导入更适合早期快速调整字段和清洗规则。

这个方法的关键不是“从外链里直接拿 coupon”，而是用外链找到 coupon 线索页，再经过提取、去重、验证和分级。

推荐流程：

1. 在 SEMrush 中输入目标域名，例如 `vapewholesaleusa.com`。
2. 导出 Backlinks / Referring Pages。
3. 过滤页面标题、URL、锚文本中包含这些词的来源：
   - coupon
   - promo
   - discount
   - deal
   - code
   - free shipping
   - sale
   - reward
   - affiliate
4. 把这些来源页面作为线索源。
5. 从页面中提取疑似 coupon code 和 offer 文案。
6. 和官网、FAQ、sale 页面、newsletter、checkout 验证结果交叉验证。
7. 只把可信数据展示在页面上，低可信数据进入待审核池。

## 4. Coupon 数据来源分层

### A 级来源：官方来源

优先级最高，可以直接标记为 `official`。

- 商家官网 promotion 页面
- FAQ / Help Center
- reward program
- sale / clearance 页面
- 邮件订阅欢迎优惠
- 官方 affiliate / referral program

### B 级来源：可验证第三方来源

适合作为线索，需要二次验证。

- SEMrush 外链中的 coupon 页面
- CouponAnnie、Dealspotr、CouponBirds、ShipTheDeal 等页面
- 博客评测中的优惠码
- affiliate landing page

### C 级来源：社区和用户提交

只能作为待审核线索。

- Reddit
- Discord / Telegram 社群
- 评论区
- 用户提交表单
- 社媒帖子

## 5. 数据模型

第一版建议用一个简单数据库表或 Airtable/Google Sheet 过渡。字段必须从第一天就规范。

### Merchant

- `id`
- `name`
- `domain`
- `homepage_url`
- `category`
- `country`
- `supports_wholesale`
- `requires_license`
- `age_gate_present`
- `notes`

### Offer

- `id`
- `merchant_id`
- `offer_type`: `coupon_code` / `automatic_discount` / `free_shipping` / `reward` / `sale`
- `code`
- `title`
- `description`
- `discount_value`
- `minimum_order_value`
- `applicable_products`
- `source_url`
- `source_type`: `official` / `semrush_backlink` / `coupon_site` / `newsletter` / `community`
- `confidence`: `verified` / `official` / `reported` / `expired` / `rejected`
- `last_checked_at`
- `expires_at`
- `requires_account`
- `requires_license`
- `stackable`
- `state_restrictions`
- `internal_notes`

### Source Page

- `id`
- `url`
- `domain`
- `page_title`
- `anchor_text`
- `target_domain`
- `semrush_export_batch_id`
- `detected_codes`
- `raw_offer_text`
- `review_status`: `new` / `parsed` / `needs_review` / `approved` / `rejected`

## 6. 清洗规则

冷启动时必须做这些清洗：

1. 去重：同一 merchant、同一 code、同一折扣类型合并。
2. 大小写统一：coupon code 全部转大写保存，展示时保留原始格式。
3. 排除假码：`WELCOME10`、`SAVE10` 这类常见码不能直接展示为 verified。
4. 排除个人 referral code：除非来源允许公开传播。
5. 标记过期：不要删除 expired code，可以保留在页面底部，吃长尾搜索，但明确标记失效。
6. 官方优先：第三方站和官网冲突时，以官网为准。
7. 合规过滤：任何暗示未成年人、免费样品、健康功效、规避州限制的内容进入 rejected。

## 7. MVP 页面结构

第一版建议是小型站点，4 个页面即可。

### 1. 主页面

URL:

`/vape-wholesale-usa-discount-code`

模块：

- H1: Vape Wholesale USA Discount Code
- 更新时间
- Top verified offers
- Coupon 表格
- 批发省钱计算器
- How we verify codes
- Buying checklist for licensed retailers
- Expired / reported codes
- 邮件订阅

### 2. 商家详情页

URL:

`/stores/vape-wholesale-usa`

模块：

- 商家简介
- 当前可用 offers
- 历史 offers
- verification log
- reward / free shipping / sale 信息
- FAQ

### 3. 提交优惠页

URL:

`/submit`

模块：

- merchant
- code
- source URL
- offer details
- contact email
- disclaimer

### 4. 合规说明页

URL:

`/compliance`

模块：

- 21+ 提醒
- 仅面向合法年龄和合规买家
- 非法律建议
- 不销售产品
- 不承诺配送可用性

## 8. 技术实现建议

### 第一版技术栈

推荐：

- Next.js 或 Astro
- SQLite / Turso / Supabase
- Tailwind CSS
- 简单 admin CSV import
- 静态渲染 SEO 页面
- Plausible 或 Google Analytics
- Search Console

如果要最快上线，优先选 Astro + SQLite/JSON。页面轻、SEO 好、维护简单。

如果后续要做账号、提交、审核后台，优先选 Next.js + Supabase。

### MVP 技术模块

1. 数据导入
   - 支持上传 SEMrush CSV。
   - 解析 source URL、anchor、title、target URL。
   - 自动识别疑似 coupon 页面。

2. Coupon 提取
   - 从 URL、title、anchor、页面摘要中识别 coupon 线索。
   - 正则提取疑似 code。
   - 把结果放入 review queue。

3. 人工审核后台
   - approve / reject / mark expired。
   - 修改 offer 文案。
   - 添加 verification notes。

4. 前台展示
   - 只展示 `verified`、`official`、`reported` 三类。
   - 默认排序：verified > official > reported > expired。
   - 每条显示最后验证日期。

5. 计算器
   - 输入订单金额。
   - 选择折扣类型。
   - 计算预计节省。
   - 显示“实际结账金额可能因配送、税费、州限制变化”。

6. SEO
   - title / meta description。
   - Coupon / FAQ structured data 要谨慎，只有确定信息才标。
   - 自动生成 sitemap。
   - 页面显示 `last updated`。

## 9. 7 天上线计划

### Day 1: 定位和数据表

- 确定站名、主词、页面结构。
- 建立 merchant、offer、source_page 三张表。
- 写好合规声明和 verification policy。

### Day 2: 数据采集

- 从 SEMrush 导出目标域名外链。
- 导出 5-10 个竞品/相邻批发商外链。
- 人工收集官网、FAQ、sale、reward、affiliate 页面。

### Day 3: 清洗和审核

- 导入 CSV。
- 过滤 coupon 线索页。
- 整理 30-50 条 offers。
- 至少验证 10 条 high-confidence offers。

### Day 4: 前台页面

- 做主 SEO 页面。
- 做 coupon 表格。
- 做计算器。
- 做邮件订阅入口。

### Day 5: 商家页和提交页

- 做 `stores/vape-wholesale-usa`。
- 做 submit 页面。
- 做合规页。
- 加 sitemap、robots、基础 analytics。

### Day 6: 内容补强

- 写 5-10 个 FAQ。
- 加 expired codes 区块。
- 写 verification policy。
- 做内部链接。

### Day 7: 上线和收录

- 部署。
- 接 Google Search Console。
- 提交 sitemap。
- 检查移动端、速度、结构化数据。
- 开始记录点击、复制 coupon、订阅转化。

## 10. 第一批目标数据

冷启动先不要追求多，目标是：

- 20 个 merchant
- 30-50 条 offer/deal/reward/free shipping 信息
- 10 条以上 verified / official
- 20 条 reported
- 10 条 expired，用来补充长尾内容

优先 merchant 类型：

1. vape wholesale distributor
2. vape supplies wholesale
3. e-liquid wholesale
4. disposable vape wholesale
5. smoke shop wholesale supplies

## 11. 运营节奏

### 每周

- 更新 10-20 条 coupon 状态。
- 新增 2-3 个 merchant。
- 检查 Search Console 新出现的 query。
- 把有曝光但没排名的 query 做成新段落或新页面。

### 每月

- 做一次 expired code 清理。
- 做一次 merchant 排名更新。
- 增加 5-10 个长尾页。
- 联系 5 个批发商，争取官方合作码。

## 12. 风险控制

必须避免：

- 面向未成年人营销。
- 暗示健康、安全或戒烟功效。
- 发布免费烟草/ENDS 样品。
- 指导绕过州限制或配送限制。
- 直接声称某个商品一定合法配送到某州。
- 未标注 sponsored 或 affiliate 关系。

页面默认加：

> This site is intended for adults 21+ and lawful business buyers. We do not sell tobacco or nicotine products. Offers may be subject to licensing, state restrictions, shipping rules, and seller verification. This content is informational and not legal advice.

## 13. 成功指标

### 7 天

- 页面上线并被 Search Console 收录。
- 至少 30 条 offer 数据。
- 至少 10 条 verified / official。
- 有 coupon copy click 或 merchant outbound click。

### 30 天

- 50-100 个自然搜索点击。
- 100 条 offer 数据。
- 20 个 merchant 页面。
- 邮件订阅 20+。
- 找到 3-5 个有排名潜力的长尾词。

### 90 天

- 300-1000 个自然搜索点击/月。
- 300 条 offer/deal 历史数据。
- 50 个 merchant 页面。
- 至少 1 个 affiliate 或 sponsored 合作。

## 14. 下一步执行

建议下一步直接做两件事：

1. 建 MVP 项目骨架：页面、数据模型、导入脚本、主页面。
2. 准备第一批 SEMrush CSV 和官网线索数据，导入后生成第一版 coupon 表。

只要拿到第一批 CSV，我们就可以把“外链线索 -> coupon 线索 -> 人工审核 -> 页面展示”跑通。
