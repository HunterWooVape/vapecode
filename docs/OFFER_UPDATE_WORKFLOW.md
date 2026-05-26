# VapeKeys Offer Weekly Workflow

> 本文档专门回答「每周怎么更新真实 offer」这个问题。
> 目标不是现在就做全自动抓取，而是先建立一个稳定、低成本、可复用的半自动流程。

---

## 一、当前阶段拍板

### 现在不要做的事

- 不要马上去抓几十个 coupon 网站
- 不要现在就上全自动 scraping pipeline
- 不要让脚本直接生成 `offers.ts` 最终数据
- 不要把 `WELCOME10`、`SAVE10` 这类泛用码直接当成高可信 offer

### 现在应该做的事

- 先固定一批高价值来源，建立 watchlist
- 先让脚本负责「发现候选线索」而不是「自动发布结果」
- 先把候选来源导入 review queue，再人工判断是否进入 `lib/offers.ts`
- 先把每周流程稳定 3-4 周，再决定是否值得加自动化

---

## 二、推荐的来源策略

### Source Tier 1：官方来源（最高优先级）

- 商家首页 banner
- 商家活动页 / deals 页 / reward program 页
- 商家 newsletter
- 商家 checkout / cart 自动折扣提示

**用途：**
- 能直接产出 `official`
- 如果 checkout 真测通过，可升级 `verified`

### Source Tier 2：固定 coupon watchlist（每周固定扫）

- 只保留 6-10 个历史上对你这个垂类有价值的站点
- 每个商家优先看是否有更新频率高、信息更细的来源
- 重点不是数量，而是「长期稳定、经常提到同一批商家」

**用途：**
- 发现本周新增 code
- 做 cross-reference
- 计算 `sourceCount`

### Source Tier 3：SEMrush / backlink discovery（每月或双周）

- 用 SEMrush 找新增提到 merchant 或 code 的来源页
- 通过现有的 [page.tsx](file:///Users/dezuo/Documents/Codex/2026-05-21/vape-wholesale-usa-discount-code/app/admin/import/page.tsx) 和 [CsvImporter.tsx](file:///Users/dezuo/Documents/Codex/2026-05-21/vape-wholesale-usa-discount-code/components/CsvImporter.tsx) 做候选打分

**用途：**
- 不是每周主流程
- 更适合做「新来源发现」和「补充 watchlist」

### Source Tier 4：用户提交 / 人工补充

- `/submit` 提交的来源页
- 商家合作方主动发来的 code
- 你手工浏览时发现的活动页

**用途：**
- 补充长尾来源
- 进入 `source_pages` review queue

---

## 三、每周执行流程

### Step 1：先定本周维护范围

- 每周只维护 5-10 个最重要的 offer
- 优先顺序：
- 上周 `copy_code` / `outbound_click` 高的
- 首页和主 codes 页露出高的
- 高商业价值商家
- 临近过期或最近有变动的

### Step 2：固定来源采集

- 先看官方来源
- 再看固定 watchlist
- 只把本周有变化的项拉出来

**建议输出一个候选清单，字段至少包含：**

- merchant
- raw title
- raw code
- raw source url
- source type
- observed discount
- observed restrictions
- checked date

### Step 3：候选线索进入 review queue

- 从 SEMrush 导出的新增来源，先进入 `source_pages`
- 从 coupon 站手工发现的候选，也先放在 review queue
- 这一步的目标是「归档候选」，不是直接上线

### Step 4：做标准化判断

对每个 candidate 按以下顺序判断：

1. 是不是官方来源？
2. 是否至少有 2 个独立来源提到同一 code / 同一 offer？
3. 是否能在 checkout 或 cart 里验证？
4. 是否属于泛用码、假码或低质量聚合站噪音？

### Step 5：写入 `lib/offers.ts`

- 只把通过 review 的项写进 [offers.ts](file:///Users/dezuo/Documents/Codex/2026-05-21/vape-wholesale-usa-discount-code/lib/offers.ts)
- 同步更新 `lastCheckedAt`
- 有过期证据就改 `expired`
- 新增或明显变更时，更新 `internalNotes`
- 每次手动更新后，同步更新 `updatedAt`

### Step 6：上线后复盘

- 看本周哪些 code 有 `copy_code`
- 看哪些 merchant 有更多 `outbound_click`
- 看哪些 offer 明显无人点击，下周降低维护优先级

---

## 四、sourceCount 计算策略

### 计数规则

- 同一个 merchant
- 同一个 code（或同一条 hidden / auto-applied offer）
- 同一类折扣语义

满足以上 3 点，才算同一 offer 的多个来源。

### 不应重复计数的情况

- 同一站点的多个镜像页
- 同一集团下多个完全复制内容的 coupon 页
- 只有标题不同，但实际指向同一条原始来源内容

### 推荐做法

- `sourceCount` 只统计独立来源数
- `internalNotes` 记录具体来源差异和冲突点

---

## 五、confidence 决策策略

### `verified`

- 你亲自到 checkout / cart 测过可用
- 或官方明确展示并且能在实际下单流程看到生效

### `official`

- 商家官网、官方活动页、官方 newsletter、reward page
- 但你还没有实际走到 checkout 验证完

### `reported`

- 第三方 coupon 站、论坛、聚合站提到
- 至少有一定可信来源支持，但你没完成独立验证

### `expired`

- 已验证失效
- 或被多个来源明确标记过期，且最近复测失败

---

## 六、自动化建议

### 现在适合自动化的只有两类

- 自动收集候选来源
- 自动做初步清洗和打分

### 现在不适合自动化的部分

- 自动判定 `verified`
- 自动覆盖 `lib/offers.ts`
- 自动删除旧 offer

### 什么情况下再开始写脚本扩展

只有当下面任一条件成立，才值得继续自动化：

- 每周固定维护超过 20 条 offer
- 固定 watchlist 超过 10 个来源站
- 手工去重和归并每周超过 1 小时
- 同样的清洗规则已经连续稳定使用 3-4 周

---

## 七、推荐的近 4 周策略

### 第 1 周

- 确定 6-10 个固定 coupon 来源
- 为 5 个核心 merchant 建立 watchlist
- 跑一轮人工更新

### 第 2 周

- 继续同样流程
- 记录哪些来源质量高、哪些噪音大
- 删掉低质量来源

### 第 3 周

- 把高质量来源固化为固定输入
- 用现有 CSV import 页面辅助发现新来源

### 第 4 周

- 复盘每周耗时
- 如果重复劳动明显，再决定是否补脚本

---

## 八、我的拍板建议

- 你的方向是对的：后续确实要靠更多来源发现 candidate
- 但现在不要直接进入「找更多站 + 写更多抓取脚本」模式
- 当前最优解是：
- 固定少量高质量来源
- 让脚本只做 discovery 和 scoring
- 人工做 review、归并、验证、入库

这样能最快形成你自己的结构化流程，又不会太早把时间耗在错误的自动化方向上。
