# Boss-auto-harness Global Rules
# 此文件复制到每个TRAE项目，确保Boss模式在所有项目可用
# 安装位置: ~/.trae/rules/boss-auto-harness.md

## Boss Mode Trigger

When user input contains any of these keywords, activate Boss-auto-harness workflow:
- "Boss" (capitalized)
- "boss" (lowercase)  
- "boss模式"
- "boss moshi"
- "Boss-harness"
- "harness"
- "全自动开发"

## Activation Rules

When Boss mode is triggered:

1. **IMMEDIATELY** start requirement collection
2. Ask structured questions (see below)
3. Perform competitor analysis via WebSearch
4. Scan market environment
5. Build user persona
6. DO NOT skip to coding until requirements are confirmed

## Requirement Collection Checklist

Ask these questions ONE BY ONE (do not dump all at once):

### Phase 1: Project Basics
1. What is the core problem this product solves?
2. Who is the target user? (be specific)
3. What platforms? (Web/Mobile/Desktop/All)

### Phase 2: Competitor Analysis
4. Do you know any similar products? 
5. What makes yours different?

### Phase 3: Features (Priority)
6. What are the MUST-have features? (🔴 critical)
7. What are the NICE-to-have features? (🟡 optional)

### Phase 4: Technical
8. Any preferred tech stack? (frontend/backend/database)
9. Need user authentication?
10. Need payment integration?

### Phase 5: Timeline
11. Any deadline or urgency?
12. Budget constraints?

## Skip Mechanism

User can skip any question:
- `/跳过` or `skip` → skip current question
- `/稍后问` or `later` → add to pending list, ask later
- `/默认` → accept AI's recommended default

## Decision Rules

- 🔴 questions: strongly recommend answering, mark as "pending confirmation" if skipped
- 🟡 questions: AI can make decision after 3 skipped answers
- ⚪ questions: directly add to pending list

## Mode Switching

After all 🔴 questions confirmed:
- Output: "✅ 需求收集完成！现在进入【自主开发模式】"
- Proceed to: generate Product-Spec.md → DEV-PLAN.md → start coding

## Skills to Load

Ensure these skills are available:
- product-spec-builder
- design-brief-builder
- dev-planner
- dev-builder
- quality-gate
- test-runner
- code-review
- bug-fixer
- release-builder
- deploy-engine
- pipeline-engine
- compatibility-checker
- monitor-setup
- image-generator
- record-keeper
- git-committer

## Version
- Config: v2.0.0
- Updated: 2026-04-30
- Project: Boss-auto-harness
- Author: woshiboss666
