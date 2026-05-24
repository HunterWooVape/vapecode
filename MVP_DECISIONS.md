# MVP 最终拍板建议

## 1. 总体拍板

第一版 MVP 的主线采用：

> SEO coupon 页面 + 邮件订阅 + 自愿 B2B 采购需求表单 + 人工审核 coupon 数据。

不要一开始就把项目做成“卖美国零售商线索给供应商”的站。线索转手是中后期变现方式，不是第一版对外主叙事。

原因：

1. 邮件订阅合规路径更清晰，信任成本更低。
2. 用户搜索 discount code 时，第一需求是拿优惠，不是被转卖给供应商。
3. 直接卖 lead 容易触发隐私、同意、数据使用披露、线索质量争议。
4. 先沉淀邮箱、采购意向、州、品类偏好，再筛选高质量 buyer lead，后续议价能力更强。

最终定位：

> A verified wholesale vape discount tracker for adult, lawful US business buyers.

## 2. 机会点 1：B2B 线索收集 + 转手

### 结论

可以做，但第一版只能做“自愿采购需求匹配”，不能做暗箱卖线索。

推荐强度：中高。

短期优先级：P1.5，不是 P0。

长期价值：高。

### 为什么有机会

这个关键词背后的用户大概率有采购意图，可能是：

- smoke shop owner
- vape shop buyer
- convenience store buyer
- online reseller
- distributor scout

这些人相比普通消费者更有价值。一个有效 B2B lead 的价值可能高于几十个普通 coupon 点击。

### 最大风险

1. 用户只是来找 discount code，不一定愿意被供应商联系。
2. 美国隐私和营销规则要求明确告知数据用途。
3. 如果把线索卖给多家供应商，容易损害信任。
4. 供应商会质疑 lead 真实性、采购量、是否有 license。
5. vape/ENDS 品类涉及年龄、州限制、配送、税务和许可问题。

### 第一版正确做法

页面文案不要写“我们会帮你找供应商报价”作为主 CTA。主 CTA 仍然是：

> Get weekly verified wholesale discount codes.

第二 CTA 才是：

> Request a wholesale quote match.

表单字段：

- Business name
- Website or store type
- State
- Business email
- Monthly purchase volume
- Product categories
- Do you have required resale/tobacco licenses?
- Consent checkbox: I agree to be contacted by selected wholesale partners about relevant offers.

必须有单独的 consent checkbox，不能默认勾选。

### 变现方式

第一阶段只做：

- 按合格线索收费
- 按成功介绍收费
- 私下人工转介绍

不要第一版就做：

- 公开 lead marketplace
- 多供应商自动分发
- SMS 营销
- 未经许可的名单售卖

### 拍板

保留 B2B lead 机制，但第一版只做一个“Request wholesale quote match”表单。表单数据进入后台，不自动售卖，不自动分发。等有 30-50 条真实买家需求后，再谈 2-3 家供应商试点。

## 3. 机会点 2：邮件自动化

### 结论

这是第一版 MVP 的核心增长和变现主线。

推荐强度：高。

短期优先级：P0。

长期价值：高。

### 为什么优先做

1. coupon 流量本身一次性强，邮件可以把一次访问变成可复触达资产。
2. 电子烟批发属于复购品类，采购者会持续关注新品、清仓、免运费、bulk deal。
3. 邮件内容可以先做信息服务，不需要我们卖货。
4. 后期可以接 affiliate、赞助优惠、供应商报价、私域询盘。

### 邮件订阅承诺

建议使用这句：

> Get verified wholesale vape discounts, free shipping alerts, and bulk deal updates in your inbox.

不要使用：

- guaranteed lowest price
- exclusive legal access
- free vape samples
- no-license deals
- ship anywhere in the US

### 自动化序列

第一版做 5 封邮件即可：

1. Welcome: 本周 verified deals + 如何使用本网站
2. Buyer checklist: 下单前检查 license、state、shipping、return policy
3. Savings calculator: 教用户如何计算真实批发折扣
4. Top merchants: 推荐 3-5 个当前活跃的 wholesale deal source
5. Quote match: 邀请用户填写 B2B 采购需求表单

### 发送频率

第一版：

- Welcome 自动序列 5 封
- 每周 1 封 newsletter

不要一开始每周 2-3 封，vape 品类投诉率和退订率要谨慎。

### 工具选择

第一版建议：

- Beehiiv：适合内容型 newsletter、增长和推荐。
- Mailchimp：适合传统邮件自动化。

拍板选 Beehiiv。原因是这个项目更像内容和信息站，而不是纯电商 CRM。

### 合规要求

所有邮件必须：

- 明确发件人
- 不用误导性标题
- 包含退订链接
- 包含联系地址或业务地址
- 尊重退订
- 说明订阅内容和频率

### 拍板

邮件自动化作为 MVP 核心，主页面首屏和 coupon 表格旁都放订阅入口。目标是 30 天内拿到 20+ 高意图邮箱，90 天内验证 newsletter 点击率和商家跳转价值。

## 4. MVP 最终范围

### 必做

1. 主 SEO 页面：`/vape-wholesale-usa-discount-code`
2. Coupon / deal 表格
3. 批发省钱计算器
4. 邮件订阅入口
5. 采购需求表单
6. 合规说明页
7. SEMrush CSV 导入和人工审核流程
8. Google Search Console / analytics

### 暂不做

1. 用户账号
2. 自动售卖线索
3. 供应商后台
4. 自动抓取全网 coupon
5. SMS 营销
6. 付费会员
7. 多语言

## 5. 技术拍板

第一版采用：

- Next.js
- Supabase
- Tailwind CSS
- Beehiiv 嵌入或 API
- 手动 SEMrush CSV 导入
- 人工审核后台
- Vercel 部署

原因：

1. Next.js 适合 SEO 和后续扩展。
2. Supabase 能快速处理表单、后台、数据库和审核状态。
3. Beehiiv 适合 newsletter 资产沉淀。
4. 手动 CSV 导入比一开始接 SEMrush API 更快上线。

## 6. 数据拍板

第一批数据目标：

- 20 个 merchant
- 30-50 条 offer / deal / reward / free shipping
- 10 条 verified 或 official
- 20 条 reported
- 10 条 expired

数据来源优先级：

1. 官网 / FAQ / reward / sale 页面
2. SEMrush 外链导出的 coupon 线索页
3. 第三方 coupon 站
4. 邮件订阅欢迎优惠
5. 用户提交

## 7. 首屏拍板

首屏不要做供应商报价，也不要做 lead form。

首屏结构：

1. H1: Vape Wholesale USA Discount Code
2. 副标题：Verified wholesale vape discounts, free shipping alerts, and bulk deal updates for adult business buyers.
3. 主 CTA: Get weekly verified discounts
4. 次 CTA: View current codes
5. 信任信息：Last updated、verification method、21+ disclaimer

## 8. 表单拍板

### Newsletter 表单

字段：

- Email
- Buyer type
- State
- Interested categories

Checkbox:

- I am 21+ and agree to receive wholesale discount emails.

### Quote Match 表单

字段：

- Business name
- Business email
- State
- Monthly purchase volume
- Product categories
- License status
- Notes

Checkbox:

- I agree that selected wholesale partners may contact me about relevant offers.

## 9. 变现顺序

1. Merchant outbound click
2. Newsletter sponsorship
3. Affiliate / referral code
4. Qualified B2B lead intro
5. Sponsored merchant placement
6. Direct wholesale quote matching

不要把 lead resale 放在第一位。

## 10. 执行条件

如果用户无异议，下一步直接执行：

1. 建 Next.js + Tailwind 项目。
2. 建 Supabase schema 草案。
3. 做主页面、coupon 表格、计算器、newsletter CTA、quote match 表单。
4. 做 CSV 导入格式和示例数据。
5. 做合规页和隐私说明草案。
6. 本地跑起来并给出预览地址。

