---
name: vapekeys-weekly-offer-tracker
description: Use for VapeKeys weekly offer tracking, SEMrush/CSV/XLSX coupon-source analysis, watchlist review, source-quality scoring, and preparing or applying strict updates to lib/offers.ts.
metadata:
  short-description: Track weekly VapeKeys offer sources
---

# VapeKeys Weekly Offer Tracker

## Use When

Use this skill only for the VapeKeys project when the user asks to:

- start weekly offer tracking
- analyze SEMrush, CSV, XLSX, coupon-source, or watchlist files
- compare new source findings with `lib/offers.ts`
- decide which codes/offers to add, update, expire, verify, or ignore
- apply a confirmed weekly offer update to `lib/offers.ts`

Do not use it for unrelated UI, favicon, analytics-only, or generic documentation work.

## Core Context

Read only what is needed:

- `docs/WATCHLIST_TEMPLATE.md` for watchlist quality rules
- `docs/WATCHLIST_WEEK1_SEED.csv` for seed sources
- `docs/OFFER_UPDATE_WORKFLOW.md` if present for operational details
- `lib/offers.ts` for merchants, offers, confidence rules, and `updatedAt`
- `lib/csv.ts`, `app/admin/import/page.tsx`, and `components/CsvImporter.tsx` when analyzing imports or CSV scoring

## Default Watchlist

Start from the fixed watchlist before expanding:

- `vapewholesaleusa.com` reward, clearance, homepage, cart, checkout
- `dontpayfull.com`
- `couponbirds.com`
- `reediscount.com`
- `valuecom.com`
- `tenereteam.com`
- `savingheist.com`

The watchlist can shrink after repeated low-value weeks.

## Confidence Rules

Use the project model strictly:

- `verified`: real cart/checkout validation confirmed the code or discount
- `official`: merchant-owned page, official policy, or official program, not checkout-verified
- `reported`: third-party coupon/source report, even if cross-referenced
- `expired`: recently verified as expired or strongly confirmed dead

Never mark generic noisy codes such as `WELCOME10`, `SAVE10`, or similar broad templates as `verified` based only on coupon-site reports.

## Source Rules

Count only independent sources for `sourceCount`.

Do not inflate source counts with:

- mirror pages
- template clones
- duplicated pages on the same coupon network
- pages syndicating the same underlying content
- low-quality pages that only say vague text like "up to X% off"

## Weekly Workflow

1. Establish scope: prefer one merchant or a small priority set.
2. Review watchlist sources and any user-provided files.
3. Compare findings against current `lib/offers.ts`.
4. Cluster duplicates and detect changed wording, expiration risk, and new candidates.
5. Recommend actions using: `ignore`, `compare`, `verify`, `add_to_offers`, `mark_expired`, `keep_watching`.
6. Apply edits only when evidence justifies them and the user asked for updates.

When editing `lib/offers.ts`, always update:

- `lastCheckedAt`
- `internalNotes`
- `sourceCount` where applicable
- `updatedAt`

New offers must include complete required fields and compliance-safe wording.

## Default Output

Use this structure unless the user asks for a different format:

- `本周发现`
- `建议更新`
- `建议验证`
- `建议忽略`
- `Recommended edits to offers.ts`

Keep recommendations concrete. If evidence is weak, ask for a narrow clarification or classify the item as `compare` / `keep_watching` instead of publishing it.

## Guardrails

- Do not blindly overwrite `lib/offers.ts`.
- Do not mass-import coupon-site output as final offers.
- Do not imply health, safety, cessation, guaranteed savings, guaranteed delivery, or legal advice.
- Keep VapeKeys positioned as an informational tracker for adults 21+ and lawful business buyers.
- If build-impacting edits are made, run `npm run build`; also run tests or lint when relevant.
