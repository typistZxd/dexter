# Implementation Plan: Dexter 新手上手文档

**Branch**: `001-onboarding-docs` | **Date**: 2026-01-25 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-onboarding-docs/spec.md`

## Summary

为 Dexter 项目创建一份面向首次接触项目的开发者的中文新手上手文档。文档将采用 Markdown 格式，包含项目概述、安装配置、代码结构、核心模块介绍和贡献指南，旨在帮助开发者在 30 分钟内完成从了解项目到成功运行的完整流程。

## Technical Context

**Language/Version**: Markdown（文档格式），项目代码为 TypeScript 5.9+  
**Primary Dependencies**: 无额外依赖（纯 Markdown 文档）  
**Storage**: 文件系统（`docs/` 目录）  
**Testing**: 手动验证（真人测试阅读体验和操作流程）  
**Target Platform**: GitHub / 本地 Markdown 阅读器  
**Project Type**: 文档项目（documentation）  
**Performance Goals**: 完整阅读时间 15-20 分钟，安装完成时间 30 分钟以内  
**Constraints**: 必须使用中文编写，内容需与代码保持同步  
**Scale/Scope**: 单一主文档 + 可选的模块详细文档

### 项目技术栈分析

基于代码分析，Dexter 项目使用以下技术栈：

| 层级 | 技术 | 用途 |
|------|------|------|
| 运行时 | Bun v1.0+ | 高性能 TypeScript 运行时 |
| 语言 | TypeScript 5.9+ | 类型安全的 JavaScript |
| UI 框架 | React 19 + Ink 6 | 终端 UI 组件化 |
| AI 框架 | LangChain | 统一的 LLM 调用接口 |
| 验证 | Zod 4 | 运行时类型验证 |
| 测试 | Jest + Bun Test | 单元测试和集成测试 |

### 核心模块结构

```
src/
├── agent/           # 代理核心（任务规划、执行、反思）
│   ├── agent.ts     # Agent 类：代理循环和工具执行
│   ├── prompts.ts   # 系统提示词构建
│   ├── scratchpad.ts# 执行过程记录
│   └── types.ts     # 类型定义
├── components/      # React/Ink UI 组件
│   ├── Input.tsx    # 用户输入组件
│   ├── HistoryItemView.tsx # 历史记录展示
│   ├── WorkingIndicator.tsx# 工作状态指示
│   └── ...          # 其他 UI 组件
├── hooks/           # React 自定义 Hooks
│   ├── useAgentRunner.ts   # 代理执行状态管理
│   ├── useModelSelection.ts# 模型选择逻辑
│   └── ...          # 其他 Hooks
├── tools/           # 工具实现
│   ├── registry.ts  # 工具注册中心
│   ├── finance/     # 金融数据工具
│   └── search/      # 搜索工具（Exa、Tavily）
└── utils/           # 通用工具函数
```

## Constitution Check

*GATE: 符合宪法规定的核心原则检查*

| 原则 | 状态 | 说明 |
|------|------|------|
| I. 代理优先架构 | ✅ 通过 | 文档将详细介绍 Agent 模块，帮助开发者理解代理能力 |
| II. 工具可组合性 | ✅ 通过 | 文档将说明 Tools 模块设计和工具注册机制 |
| III. 自主与可控 | ✅ 通过 | 文档将介绍安全机制（循环检测、步骤限制） |
| IV. 数据驱动决策 | ✅ 通过 | 文档将说明 Financial Datasets API 集成 |
| V. 用户体验优先 | ✅ 通过 | 文档本身追求清晰、易读、易用的用户体验 |

**技术栈要求检查**: ✅ 文档将准确描述 Bun + TypeScript + React/Ink + LangChain 技术栈

**目录结构约定检查**: ✅ 文档将遵循现有目录结构进行说明

## Project Structure

### Documentation (this feature)

```text
specs/001-onboarding-docs/
├── plan.md              # 本文件（实施计划）
├── research.md          # Phase 0 输出（研究发现）
├── data-model.md        # Phase 1 输出（文档结构模型）
├── quickstart.md        # Phase 1 输出（快速参考）
└── tasks.md             # Phase 2 输出（任务分解，由 /speckit.tasks 创建）
```

### Target Documentation Structure (deliverable)

```text
docs/
├── README.md            # 新手上手文档主文件
├── getting-started.md   # 快速启动指南
├── architecture.md      # 架构和模块介绍
└── contributing.md      # 贡献指南
```

**注**: 考虑到文档的可发现性，主文档也可以直接更新项目根目录的 `README.md`，并在 `docs/` 目录下放置详细的模块文档。

### Source Code (repository root)

```text
src/
├── agent/       # 代理核心逻辑（任务规划、执行、反思）
├── components/  # React/Ink UI 组件
├── hooks/       # React 自定义 Hooks
├── model/       # LLM 配置和实例化
├── tools/       # 工具实现（金融、搜索等）
│   ├── descriptions/  # 工具描述（供代理理解）
│   ├── finance/       # 金融数据工具
│   └── search/        # 搜索工具（Exa、Tavily）
└── utils/       # 通用工具函数
```

**Structure Decision**: 采用 `docs/` 目录存放详细文档，同时更新根目录 `README.md` 作为入口。这符合 GitHub 项目的常见实践，便于新手发现文档。

## Implementation Phases

### Phase 0: 研究与分析 ✅

- 分析现有 README.md 内容
- 梳理项目技术栈和依赖关系
- 理解代码架构和核心模块职责
- 确定文档组织方案

**输出**: [research.md](./research.md)

### Phase 1: 设计与结构 ✅

- 设计文档信息架构
- 定义各章节内容大纲
- 创建文档模板

**输出**: [data-model.md](./data-model.md), [quickstart.md](./quickstart.md)

### Phase 2: 任务分解

- 将文档编写分解为可执行任务
- 按用户故事优先级排序
- 估算工作量

**输出**: tasks.md（由 `/speckit.tasks` 命令创建）

## Complexity Tracking

无宪法违规项需要说明。本功能为纯文档工作，不涉及代码复杂性问题。

## Dependencies

### 内部依赖
- 现有 README.md 内容（作为参考和可能的集成点）
- 源代码注释和类型定义（作为模块说明的依据）

### 外部依赖
- 无（纯 Markdown 文档）

## Risk Assessment

| 风险 | 可能性 | 影响 | 缓解措施 |
|------|--------|------|----------|
| 代码更新导致文档过时 | 中 | 中 | 在文档中标注版本，建立文档更新流程 |
| 技术细节描述不准确 | 低 | 高 | 基于代码分析编写，请维护者审核 |
| 文档过于冗长影响阅读 | 中 | 中 | 分层组织，核心内容控制在 15-20 分钟阅读量 |
