<!--
文档版本: 1.0.0
最后更新: 2026-01-25
适用代码版本: 3.0.2
-->

# 架构与核心模块

本文档介绍 Dexter 的代码架构和核心模块设计，帮助你理解项目的内部工作原理，以便进行功能扩展或代码贡献。

---

## 项目结构

```
dexter/
├── src/
│   ├── agent/           # 代理核心模块
│   │   ├── agent.ts     # Agent 类：代理循环和工具执行
│   │   ├── prompts.ts   # 系统提示词构建
│   │   ├── scratchpad.ts# 执行过程记录
│   │   ├── types.ts     # 类型定义
│   │   └── index.ts     # 模块导出
│   │
│   ├── components/      # React/Ink UI 组件
│   │   ├── Input.tsx    # 用户输入组件
│   │   ├── HistoryItemView.tsx # 历史记录展示
│   │   ├── WorkingIndicator.tsx# 工作状态指示
│   │   ├── ModelSelector.tsx   # 模型选择界面
│   │   ├── ApiKeyPrompt.tsx    # API Key 输入
│   │   ├── DebugPanel.tsx      # 调试面板
│   │   └── index.ts     # 组件导出
│   │
│   ├── hooks/           # React 自定义 Hooks
│   │   ├── useAgentRunner.ts   # 代理执行状态管理
│   │   ├── useModelSelection.ts# 模型选择逻辑
│   │   ├── useInputHistory.ts  # 输入历史管理
│   │   ├── useDebugLogs.ts     # 调试日志
│   │   └── useTextBuffer.ts    # 文本缓冲区
│   │
│   ├── tools/           # 工具实现
│   │   ├── registry.ts  # 工具注册中心
│   │   ├── types.ts     # 工具类型定义
│   │   ├── descriptions/# 工具描述（供 LLM 理解）
│   │   ├── finance/     # 金融数据工具
│   │   └── search/      # 搜索工具（Exa、Tavily）
│   │
│   ├── model/           # LLM 配置
│   │   └── llm.ts       # 模型实例化和调用
│   │
│   ├── utils/           # 通用工具函数
│   │   ├── env.ts       # 环境变量处理
│   │   ├── logger.ts    # 日志工具
│   │   └── ...          # 其他工具函数
│   │
│   ├── cli.tsx          # CLI 主组件
│   ├── index.tsx        # 应用入口
│   └── theme.ts         # 主题配置
│
├── docs/                # 文档目录
├── specs/               # 功能规格文档
├── package.json         # 项目配置
└── tsconfig.json        # TypeScript 配置
```

### 目录职责说明

| 目录 | 职责 | 主要文件 |
|------|------|----------|
| `src/agent/` | 代理核心逻辑，包括任务规划、工具执行、答案生成 | `agent.ts` |
| `src/components/` | CLI 界面组件，基于 React + Ink | `*.tsx` |
| `src/hooks/` | React 状态管理和业务逻辑封装 | `use*.ts` |
| `src/tools/` | 可调用工具的实现和注册 | `registry.ts`, `finance/`, `search/` |
| `src/model/` | LLM 配置和调用封装 | `llm.ts` |
| `src/utils/` | 通用工具函数 | `*.ts` |

---

## 技术栈

| 层级 | 技术 | 版本 | 用途 |
|------|------|------|------|
| 运行时 | Bun | v1.0+ | 高性能 TypeScript 运行时 |
| 语言 | TypeScript | 5.9+ | 类型安全的 JavaScript |
| UI 框架 | React + Ink | 19 + 6 | 终端 UI 组件化 |
| AI 框架 | LangChain | 1.1+ | 统一的 LLM 调用接口 |
| 验证 | Zod | 4.x | 运行时类型验证 |
| 测试 | Jest + Bun Test | - | 单元测试和集成测试 |

### 为什么选择这些技术？

- **Bun**: 原生 TypeScript 支持，无需编译步骤；启动速度快，包管理效率高
- **React + Ink**: 使用熟悉的 React 模式构建 CLI 应用，组件化易于维护
- **LangChain**: 提供统一的 LLM 接口，轻松切换不同模型提供商
- **Zod**: 运行时类型验证，确保 API 响应数据的正确性

---

## 核心模块

### Agent 模块

Agent 是 Dexter 的核心，负责接收用户查询、规划任务、调用工具、生成答案。

#### 代理循环流程

```
用户查询
    ↓
Agent.run(query)
    ↓
构建初始提示（含历史上下文）
    ↓
┌─────────────────────────────────────┐
│         代理循环（最多 10 次迭代）    │
│                                     │
│  1. 调用 LLM 获取响应                │
│         ↓                           │
│  2. 检查是否有工具调用               │
│         ↓                           │
│     有 → 执行工具 → 记录结果 → 继续  │
│     无 → 生成最终答案 → 结束         │
└─────────────────────────────────────┘
    ↓
返回答案和工具调用记录
```

#### 关键类和方法

**Agent 类** (`src/agent/agent.ts`)

```typescript
class Agent {
  // 创建 Agent 实例
  static create(config: AgentConfig): Agent
  
  // 运行代理，返回事件流
  async *run(query: string, history?: InMemoryChatHistory): AsyncGenerator<AgentEvent>
}
```

**AgentConfig 配置**

```typescript
interface AgentConfig {
  model?: string;           // 模型名称，如 'gpt-4'
  modelProvider?: string;   // 提供商，如 'openai'
  maxIterations?: number;   // 最大迭代次数，默认 10
  signal?: AbortSignal;     // 用于取消执行
}
```

#### 事件类型

Agent 在执行过程中会产生以下事件：

| 事件类型 | 说明 | 数据 |
|----------|------|------|
| `thinking` | 代理正在思考 | `message: string` |
| `tool_start` | 开始调用工具 | `tool: string, args: object` |
| `tool_end` | 工具调用完成 | `tool: string, result: string, duration: number` |
| `tool_error` | 工具调用失败 | `tool: string, error: string` |
| `answer_start` | 开始生成答案 | - |
| `done` | 执行完成 | `answer: string, toolCalls: array, iterations: number` |

#### 安全机制

Agent 模块内置了多重安全机制，符合项目宪法中"自主与可控"的原则：

- **循环检测**: 防止代理陷入无限循环
- **步骤限制**: 默认最多 10 次迭代，防止资源耗尽
- **错误恢复**: 工具调用失败时有合理的降级策略
- **执行透明**: 所有思考过程和决策对用户可见

---

### Tools 模块

Tools 模块提供可组合的数据获取能力，代理可以根据需要选择和调用工具。

#### 工具注册机制

所有工具通过 `registry.ts` 统一注册：

```typescript
// src/tools/registry.ts
interface RegisteredTool {
  name: string;                    // 工具名称
  tool: StructuredToolInterface;   // 工具实例
  description: string;             // 详细描述（供 LLM 理解）
}

function getToolRegistry(model: string): RegisteredTool[]
function getTools(model: string): StructuredToolInterface[]
```

#### 现有工具

| 工具名称 | 用途 | 数据源 |
|----------|------|--------|
| `financial_search` | 查询金融数据（财报、价格、指标等） | Financial Datasets API |
| `web_search` | 网络搜索（新闻、研究报告等） | Exa / Tavily |

#### 添加新工具指南

1. **创建工具文件** 在 `src/tools/` 下创建新目录或文件

2. **实现工具逻辑**

```typescript
import { tool } from '@langchain/core/tools';
import { z } from 'zod';

export const myTool = tool(
  async ({ param1, param2 }) => {
    // 工具实现逻辑
    return JSON.stringify(result);
  },
  {
    name: 'my_tool',
    description: '工具的简短描述',
    schema: z.object({
      param1: z.string().describe('参数1说明'),
      param2: z.number().describe('参数2说明'),
    }),
  }
);
```

3. **编写工具描述** 在 `src/tools/descriptions/` 创建描述文件：

```typescript
export const MY_TOOL_DESCRIPTION = `
## my_tool

### When to use
- 使用场景1
- 使用场景2

### When NOT to use
- 不适用场景

### Parameters
- param1: 参数说明
- param2: 参数说明
`;
```

4. **注册工具** 在 `src/tools/registry.ts` 中注册：

```typescript
import { myTool } from './my-tool/index.js';
import { MY_TOOL_DESCRIPTION } from './descriptions/index.js';

export function getToolRegistry(model: string): RegisteredTool[] {
  const tools = [
    // ... 现有工具
    {
      name: 'my_tool',
      tool: myTool,
      description: MY_TOOL_DESCRIPTION,
    },
  ];
  return tools;
}
```

---

### Components 模块

Components 使用 React + Ink 构建 CLI 界面，提供良好的用户体验。

#### 组件体系

```
CLI (cli.tsx)
├── Intro                 # 欢迎信息和模型显示
├── HistoryItemView[]     # 历史对话展示
│   ├── Query             # 用户查询
│   ├── EventListView     # 事件列表
│   │   ├── ThinkingEvent
│   │   └── ToolEvent
│   └── AnswerBox         # 回答展示
├── WorkingIndicator      # 工作状态指示
├── Input                 # 用户输入框
└── DebugPanel            # 调试面板
```

#### 主要组件

| 组件 | 文件 | 职责 |
|------|------|------|
| `CLI` | `cli.tsx` | 主应用组件，组合所有子组件 |
| `Input` | `Input.tsx` | 用户输入处理，支持历史导航 |
| `HistoryItemView` | `HistoryItemView.tsx` | 单条对话展示（查询+事件+回答） |
| `WorkingIndicator` | `WorkingIndicator.tsx` | 显示当前工作状态（思考中/调用工具） |
| `ModelSelector` | `ModelSelector.tsx` | 模型和提供商选择界面 |
| `AnswerBox` | `AnswerBox.tsx` | 格式化展示 AI 回答 |
| `DebugPanel` | `DebugPanel.tsx` | 开发调试信息 |

#### UI 数据流

```
用户输入
    ↓
Input.onSubmit(query)
    ↓
useAgentRunner.runQuery(query)
    ↓
Agent.run() 产生事件流
    ↓
useAgentRunner 更新状态 (history, workingState)
    ↓
组件重新渲染
    ↓
HistoryItemView 显示新对话
WorkingIndicator 显示当前状态
```

---

### Hooks 模块

Hooks 封装了状态管理和业务逻辑，遵循 React Hooks 设计模式。

#### 主要 Hooks

| Hook | 文件 | 职责 |
|------|------|------|
| `useAgentRunner` | `useAgentRunner.ts` | 代理执行状态管理 |
| `useModelSelection` | `useModelSelection.ts` | 模型选择逻辑 |
| `useInputHistory` | `useInputHistory.ts` | 输入历史导航（↑/↓） |
| `useDebugLogs` | `useDebugLogs.ts` | 调试日志管理 |
| `useTextBuffer` | `useTextBuffer.ts` | 文本编辑缓冲区 |

#### useAgentRunner

这是最核心的 Hook，管理代理执行的完整状态：

```typescript
interface UseAgentRunnerResult {
  // 状态
  history: HistoryItem[];      // 对话历史
  workingState: WorkingState;  // 当前工作状态
  error: string | null;        // 错误信息
  isProcessing: boolean;       // 是否正在处理
  
  // 操作
  runQuery: (query: string) => Promise<RunQueryResult | undefined>;
  cancelExecution: () => void;
  setError: (error: string | null) => void;
}
```

#### useModelSelection

管理模型选择流程：

```typescript
interface UseModelSelectionResult {
  selectionState: SelectionState;  // 选择状态
  provider: string;                // 当前提供商
  model: string;                   // 当前模型
  
  startSelection: () => void;      // 开始选择
  cancelSelection: () => void;     // 取消选择
  handleProviderSelect: (provider: string) => void;
  handleModelSelect: (model: string) => void;
}
```

---

## 数据流

### 完整的请求处理流程

```
1. 用户输入查询
       ↓
2. Input 组件捕获输入，调用 onSubmit
       ↓
3. CLI 调用 useAgentRunner.runQuery(query)
       ↓
4. useAgentRunner 创建 Agent 实例
       ↓
5. Agent.run() 开始执行
       ↓
   ┌─────────────────────────────────┐
   │ 代理循环                         │
   │   ↓                             │
   │ 调用 LLM (model/llm.ts)         │
   │   ↓                             │
   │ LLM 决定调用工具？               │
   │   是 → 调用工具 (tools/*)       │
   │       ↓                         │
   │       产生 tool_start 事件      │
   │       ↓                         │
   │       执行工具，获取结果         │
   │       ↓                         │
   │       产生 tool_end 事件        │
   │       ↓                         │
   │       继续循环                   │
   │   否 → 生成最终答案              │
   │       ↓                         │
   │       产生 done 事件            │
   └─────────────────────────────────┘
       ↓
6. useAgentRunner 处理事件，更新 history
       ↓
7. 组件重新渲染，显示结果
```

### 工具调用时序

```
Agent                    LLM                     Tool
  │                       │                        │
  │──── prompt ──────────>│                        │
  │                       │                        │
  │<──── tool_calls ──────│                        │
  │                       │                        │
  │──────────────── invoke ───────────────────────>│
  │                       │                        │
  │<─────────────── result ────────────────────────│
  │                       │                        │
  │──── prompt + result ─>│                        │
  │                       │                        │
  │<──── final answer ────│                        │
  │                       │                        │
```

---

## 下一步

了解架构后，你可以：

1. **开始贡献代码** → 阅读 [贡献指南](./contributing.md)
2. **探索代码** → 从 `src/agent/agent.ts` 开始阅读核心逻辑

---

*如果对架构有疑问，欢迎在 [GitHub Discussions](https://github.com/virattt/dexter/discussions) 中讨论。*
