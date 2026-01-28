# Quickstart: Dexter 新手上手文档

**Feature**: 001-onboarding-docs  
**Date**: 2026-01-25  
**Purpose**: 快速参考卡片，供开发者在实施阶段查阅

---

## 文档清单

| 文档 | 路径 | 状态 | 字数目标 |
|------|------|------|----------|
| 主入口 | `/README.md` | 待更新 | 800-1000 |
| 安装指南 | `/docs/getting-started.md` | 待创建 | 1500-2000 |
| 架构说明 | `/docs/architecture.md` | 待创建 | 2500-3000 |
| 贡献指南 | `/docs/contributing.md` | 待创建 | 1200-1500 |

**总计**: 6000-7500 字 / 15-20 分钟阅读

---

## 快速参考

### 项目技术栈

```
运行时:     Bun v1.0+
语言:       TypeScript 5.9+
UI 框架:    React 19 + Ink 6
AI 框架:    LangChain (@langchain/core, @langchain/openai, ...)
验证:       Zod 4
测试:       Jest + Bun Test
```

### 目录结构速查

```
src/
├── agent/           # 代理核心（Agent 类、提示词、Scratchpad）
├── components/      # UI 组件（Input、HistoryItemView、WorkingIndicator...）
├── hooks/           # 状态管理（useAgentRunner、useModelSelection...）
├── model/           # LLM 配置（llm.ts）
├── tools/           # 工具实现
│   ├── descriptions/  # 工具描述
│   ├── finance/       # 金融数据工具
│   └── search/        # 搜索工具
└── utils/           # 通用工具函数
```

### 核心模块速查

| 模块 | 入口文件 | 核心职责 |
|------|----------|----------|
| Agent | `src/agent/agent.ts` | 代理循环、工具执行 |
| Tools | `src/tools/registry.ts` | 工具注册和管理 |
| Components | `src/components/index.ts` | UI 组件导出 |
| Hooks | `src/hooks/useAgentRunner.ts` | 代理执行状态 |

### 命令速查

```bash
# 安装
bun install

# 运行
bun start          # 生产模式
bun dev            # 开发模式（watch）

# 开发
bun typecheck      # 类型检查
bun test           # 运行测试
bun test --watch   # 测试 watch 模式
```

### API Key 速查

**必需**:
| Key | 用途 | 获取地址 |
|-----|------|----------|
| `OPENAI_API_KEY` | OpenAI 模型 | platform.openai.com |
| `FINANCIAL_DATASETS_API_KEY` | 金融数据 | financialdatasets.ai |

**可选**:
| Key | 用途 | 获取地址 |
|-----|------|----------|
| `ANTHROPIC_API_KEY` | Claude 模型 | console.anthropic.com |
| `GOOGLE_API_KEY` | Google AI | makersuite.google.com |
| `XAI_API_KEY` | xAI 模型 | x.ai |
| `OLLAMA_BASE_URL` | 本地模型 | ollama.ai |
| `EXA_API_KEY` | 网络搜索 | exa.ai |
| `TAVILY_API_KEY` | 网络搜索（备选） | tavily.com |

---

## 用户故事对应

| 用户故事 | 对应文档 | 对应章节 |
|----------|----------|----------|
| US1: 了解 Dexter | README.md | 简介 |
| US2: 安装运行 | getting-started.md | 全部 |
| US3: 代码结构 | architecture.md | 项目结构 |
| US4: 核心模块 | architecture.md | 核心模块 |
| US5: 代码贡献 | contributing.md | 全部 |

---

## 关键代码引用

### Agent 循环（agent.ts）

```typescript
async *run(query: string, inMemoryHistory?: InMemoryChatHistory): AsyncGenerator<AgentEvent>
```

事件类型：`thinking` | `tool_start` | `tool_end` | `tool_error` | `answer_start` | `done`

### 工具注册（registry.ts）

```typescript
export interface RegisteredTool {
  name: string;
  tool: StructuredToolInterface;
  description: string;
}

export function getToolRegistry(model: string): RegisteredTool[]
```

### 主 Hook（useAgentRunner.ts）

```typescript
export interface UseAgentRunnerResult {
  history: HistoryItem[];
  workingState: WorkingState;
  error: string | null;
  isProcessing: boolean;
  runQuery: (query: string) => Promise<RunQueryResult | undefined>;
  cancelExecution: () => void;
  setError: (error: string | null) => void;
}
```

---

## 验收标准速查

| 标准 | 指标 |
|------|------|
| SC-001 | 90% 开发者 30 分钟内完成安装运行 |
| SC-002 | 80% 开发者能描述核心功能 |
| SC-003 | 70% 开发者能定位代码文件 |
| SC-004 | 首次贡献者能成功提交 PR |
| SC-005 | 完整阅读时间 15-20 分钟 |

---

## 下一步

1. 执行 `/speckit.tasks` 生成任务分解
2. 按优先级（P1 → P2 → P3）编写文档内容
3. 进行用户测试验证验收标准
