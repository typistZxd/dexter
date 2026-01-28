# Research: Dexter 新手上手文档

**Feature**: 001-onboarding-docs  
**Date**: 2026-01-25  
**Status**: Complete

## 研究目标

为创建高质量的新手上手文档，需要解答以下问题：

1. 现有文档覆盖了哪些内容？有哪些缺失？
2. 项目的核心技术栈和架构是什么？
3. 开发者最需要了解的核心模块有哪些？
4. 最佳的文档组织方式是什么？

---

## 1. 现有文档分析

### 1.1 README.md 现状

**Decision**: 现有 README.md 提供了基本的项目介绍和安装步骤，但缺少深入的技术说明。

**现有内容**:
- ✅ 项目简介和核心能力概述
- ✅ 前置条件和 API Key 要求
- ✅ Bun 安装步骤（macOS/Linux/Windows）
- ✅ 项目安装和环境配置
- ✅ 基本使用命令
- ✅ 贡献指南（简要）
- ✅ 许可证信息

**缺失内容**:
- ❌ 项目目录结构说明
- ❌ 核心模块（Agent、Tools、Components、Hooks）介绍
- ❌ 数据流和架构图
- ❌ 常见问题解答
- ❌ 本地模型（Ollama）使用详细说明
- ❌ 开发命令详细说明（typecheck、test 等）

**Rationale**: 新手文档应在现有 README 基础上扩展，增加代码结构和模块介绍，帮助开发者理解项目内部工作原理。

**Alternatives considered**:
- 完全重写 README：❌ 会破坏现有用户的熟悉度
- 创建独立的 GETTING_STARTED.md：✅ 可行，但可能被忽略
- 在 docs/ 目录创建详细文档：✅ 推荐，适合深入内容

---

## 2. 技术栈深度分析

### 2.1 运行时环境

**Decision**: 项目使用 Bun 作为运行时，需要重点说明其优势和安装方式。

| 组件 | 版本 | 用途 |
|------|------|------|
| Bun | v1.0+ | 运行时，原生支持 TypeScript |
| TypeScript | 5.9+ | 类型安全 |

**Rationale**: Bun 相比 Node.js 的优势包括：
- 原生 TypeScript 支持，无需编译步骤
- 更快的包管理和脚本执行
- 内置测试运行器

**文档要点**:
- 说明为什么选择 Bun
- 提供多平台安装命令
- 说明与 Node.js 的兼容性

### 2.2 UI 框架

**Decision**: 项目使用 React + Ink 构建 CLI 界面。

| 组件 | 版本 | 用途 |
|------|------|------|
| React | 19.2 | 组件化 UI |
| Ink | 6.5 | React 到终端渲染 |

**Rationale**: Ink 允许使用 React 组件模式构建终端应用，使 UI 代码更易维护和测试。

**文档要点**:
- 解释 Ink 是什么（React for CLI）
- 列出主要组件及其职责
- 说明如何添加新的 UI 组件

### 2.3 AI 框架

**Decision**: 项目使用 LangChain 作为 LLM 调用抽象层。

| 组件 | 版本 | 用途 |
|------|------|------|
| @langchain/core | 1.1.0 | 核心抽象 |
| @langchain/openai | 1.1.3 | OpenAI 集成 |
| @langchain/anthropic | 1.1.3 | Anthropic 集成 |
| @langchain/google-genai | 2.0.0 | Google AI 集成 |
| @langchain/ollama | 1.0.3 | 本地模型支持 |

**Rationale**: LangChain 提供统一的 LLM 接口，使项目能够轻松切换不同的模型提供商。

**文档要点**:
- 说明支持的模型提供商
- 解释模型选择机制
- 介绍如何配置不同的 API Key

---

## 3. 核心模块分析

### 3.1 Agent 模块

**Decision**: Agent 是项目核心，负责任务规划、工具调用和答案生成。

**关键文件**:
- `agent.ts`: Agent 类，实现代理循环
- `prompts.ts`: 系统提示词构建
- `scratchpad.ts`: 执行过程记录
- `types.ts`: 类型定义

**核心流程**:
```
用户查询 → Agent.run()
    ↓
构建初始提示（含历史上下文）
    ↓
┌─────────────────────────────┐
│ 代理循环（最多 10 次迭代）    │
│   ↓                         │
│ 调用 LLM → 获取响应          │
│   ↓                         │
│ 有工具调用？                 │
│   是 → 执行工具 → 记录结果   │
│   否 → 生成最终答案          │
└─────────────────────────────┘
    ↓
返回答案和工具调用记录
```

**文档要点**:
- 解释代理循环的工作原理
- 说明 Scratchpad 的作用
- 介绍事件类型（thinking、tool_start、tool_end、done）

### 3.2 Tools 模块

**Decision**: Tools 提供可组合的数据获取能力，通过 registry 统一管理。

**关键文件**:
- `registry.ts`: 工具注册中心
- `types.ts`: 工具类型定义
- `finance/`: 金融数据工具集
- `search/`: 网络搜索工具
- `descriptions/`: 工具描述（供 LLM 理解）

**工具注册机制**:
```typescript
// registry.ts
export function getToolRegistry(model: string): RegisteredTool[] {
  const tools = [
    { name: 'financial_search', tool: createFinancialSearch(model), description: FINANCIAL_SEARCH_DESCRIPTION }
  ];
  // 根据环境变量条件添加搜索工具
  if (process.env.EXASEARCH_API_KEY) { /* 添加 Exa */ }
  else if (process.env.TAVILY_API_KEY) { /* 添加 Tavily */ }
  return tools;
}
```

**文档要点**:
- 解释工具注册机制
- 说明现有工具（financial_search、web_search）
- 提供添加新工具的指南

### 3.3 Components 模块

**Decision**: Components 使用 React + Ink 构建 CLI 界面组件。

**关键组件**:
| 组件 | 职责 |
|------|------|
| `CLI` (cli.tsx) | 主应用组件，组合所有子组件 |
| `Input` | 用户输入框 |
| `HistoryItemView` | 对话历史展示 |
| `WorkingIndicator` | 工作状态指示（thinking、tool 执行等） |
| `ModelSelector` | 模型选择界面 |
| `ApiKeyPrompt` | API Key 输入提示 |
| `DebugPanel` | 调试信息面板 |

**文档要点**:
- 列出主要组件及其职责
- 解释组件间的数据流
- 说明如何修改 UI

### 3.4 Hooks 模块

**Decision**: Hooks 封装了状态管理和业务逻辑，遵循 React Hooks 模式。

**关键 Hooks**:
| Hook | 职责 |
|------|------|
| `useAgentRunner` | 代理执行状态管理（history、workingState、error） |
| `useModelSelection` | 模型和提供商选择逻辑 |
| `useInputHistory` | 输入历史导航（上/下箭头） |
| `useDebugLogs` | 调试日志管理 |
| `useTextBuffer` | 文本缓冲区管理 |

**文档要点**:
- 解释 Hooks 的设计模式
- 说明各 Hook 的状态和方法
- 提供修改状态逻辑的指南

---

## 4. 文档组织方案

### 4.1 方案评估

**Option A: 单一长文档**
- 优点：一站式阅读，SEO 友好
- 缺点：过长不易维护，难以定位特定内容

**Option B: 多文件分层结构**
- 优点：模块化，易于维护和导航
- 缺点：需要多次点击，可能迷失

**Option C: 混合方案（推荐）**
- 主文档（README.md）提供快速入门
- docs/ 目录提供深入内容
- 清晰的导航链接

### 4.2 最终决策

**Decision**: 采用混合方案，具体结构如下：

```
/README.md                    # 更新：快速入门（概述 + 安装 + 运行）
/docs/
├── getting-started.md        # 详细安装和配置指南
├── architecture.md           # 代码结构和核心模块
└── contributing.md           # 开发流程和贡献指南
```

**Rationale**:
1. README.md 保持简洁，5 分钟内可读完
2. 深入内容放在 docs/ 目录，便于维护
3. 遵循 GitHub 项目的常见实践

**Alternatives considered**:
- 使用 GitBook/Docusaurus：❌ 过于复杂，维护成本高
- 全部放在 README：❌ 内容过长，影响阅读体验

---

## 5. 内容优先级

基于规范中的用户故事优先级，文档内容按以下顺序编写：

| 优先级 | 内容 | 对应用户故事 |
|--------|------|--------------|
| P1 | 项目概述 | US1: 了解 Dexter 是什么 |
| P1 | 安装和运行 | US2: 成功安装并运行 |
| P2 | 代码结构 | US3: 理解项目代码结构 |
| P2 | 核心模块 | US4: 理解核心模块工作原理 |
| P3 | 贡献指南 | US5: 成功提交代码贡献 |

---

## 研究结论

1. **文档基础**: 现有 README 提供了良好的基础，需要扩展深入内容
2. **技术栈**: Bun + TypeScript + React/Ink + LangChain 构成完整技术栈
3. **核心模块**: Agent（代理循环）、Tools（数据获取）、Components（UI）、Hooks（状态管理）
4. **组织方案**: 混合方案，README 快速入门 + docs/ 深入内容
5. **语言**: 全部使用中文，符合目标用户需求
