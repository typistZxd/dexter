# Data Model: Dexter 新手上手文档

**Feature**: 001-onboarding-docs  
**Date**: 2026-01-25  
**Status**: Complete

## 文档信息架构

本文档定义新手上手文档的结构模型，包括各文档的章节组织、内容要素和关联关系。

---

## 1. 文档实体定义

### 1.1 README.md（主入口）

**定位**: 项目首页，提供快速概览和入门指引

**结构**:
```markdown
# Dexter

## 简介
- 项目定位（一句话）
- 核心能力（3-5 个要点）
- 适用场景

## 快速开始
- 前置条件
- 安装步骤（简化版）
- 运行命令

## 文档导航
- 链接到 docs/ 下的详细文档

## 贡献
- 简要贡献指南
- 链接到详细贡献文档

## 许可证
```

**字数目标**: 800-1000 字（5 分钟阅读）

### 1.2 docs/getting-started.md（详细安装指南）

**定位**: 完整的安装和配置指南，覆盖各种环境和场景

**结构**:
```markdown
# 安装与配置指南

## 环境要求
- 操作系统支持
- Bun 版本要求
- 可选依赖

## 安装 Bun
- macOS 安装
- Linux 安装
- Windows 安装
- 验证安装

## 安装 Dexter
- 克隆仓库
- 安装依赖

## 环境配置
- 必需的 API Key
  - OPENAI_API_KEY
  - FINANCIAL_DATASETS_API_KEY
- 可选的 API Key
  - ANTHROPIC_API_KEY
  - GOOGLE_API_KEY
  - XAI_API_KEY
  - OLLAMA_BASE_URL
  - EXA_API_KEY / TAVILY_API_KEY

## 运行项目
- 生产模式：bun start
- 开发模式：bun dev
- 使用本地模型（Ollama）

## 常见问题
- API Key 错误
- 网络连接问题
- 权限问题
```

**字数目标**: 1500-2000 字（10 分钟阅读）

### 1.3 docs/architecture.md（架构说明）

**定位**: 代码结构和核心模块的深入介绍

**结构**:
```markdown
# 架构与核心模块

## 项目结构
- 目录树图
- 各目录职责说明

## 技术栈
- Bun 运行时
- TypeScript
- React + Ink
- LangChain

## 核心模块

### Agent 模块
- 职责概述
- 代理循环流程图
- 关键类和方法
- 事件类型说明

### Tools 模块
- 工具注册机制
- 现有工具介绍
- 添加新工具指南

### Components 模块
- 组件体系概述
- 主要组件列表
- UI 数据流

### Hooks 模块
- 设计模式说明
- 主要 Hooks 介绍
- 状态管理机制

## 数据流
- 用户输入到响应的完整流程
- 工具调用时序图
```

**字数目标**: 2500-3000 字（15 分钟阅读）

### 1.4 docs/contributing.md（贡献指南）

**定位**: 开发流程和贡献规范

**结构**:
```markdown
# 贡献指南

## 开发环境设置
- 推荐的 IDE 和插件
- 开发依赖

## 开发流程
- Fork 和克隆
- 创建功能分支
- 开发和测试
- 提交代码

## 代码规范
- 文件命名约定
- 代码风格
- TypeScript 使用规范

## 测试
- 运行测试：bun test
- 类型检查：bun typecheck
- 添加新测试

## 提交规范
- Commit 消息格式
- PR 规范
- 代码审查流程

## 同步上游
- 添加上游远程
- 拉取最新代码
- 解决冲突
```

**字数目标**: 1200-1500 字（8 分钟阅读）

---

## 2. 内容关系图

```
README.md
    │
    ├──→ docs/getting-started.md  （"详细安装指南"链接）
    │
    ├──→ docs/architecture.md     （"了解更多"链接）
    │
    └──→ docs/contributing.md     （"贡献指南"链接）

docs/getting-started.md
    │
    └──→ docs/architecture.md     （"下一步：了解架构"链接）

docs/architecture.md
    │
    └──→ docs/contributing.md     （"开始贡献"链接）
```

---

## 3. 章节内容要素

### 3.1 项目概述（README.md）

| 要素 | 内容 | 来源 |
|------|------|------|
| 项目名称 | Dexter | 现有 README |
| 一句话定位 | 自主金融研究代理 | 现有 README |
| 核心能力 | 智能任务规划、自主执行、自我验证、实时金融数据 | 现有 README |
| 安全特性 | 循环检测、步骤限制 | 宪法 + 代码分析 |
| 适用场景 | 金融数据分析、市场研究 | 规范定义 |

### 3.2 环境配置（getting-started.md）

| 要素 | 内容 | 来源 |
|------|------|------|
| Bun 版本 | v1.0+ | package.json 分析 |
| 必需 API Key | OPENAI_API_KEY, FINANCIAL_DATASETS_API_KEY | env.example |
| 可选 API Key | ANTHROPIC_API_KEY, GOOGLE_API_KEY, XAI_API_KEY, OLLAMA_BASE_URL, EXA_API_KEY, TAVILY_API_KEY | env.example |
| 安装命令 | bun install | 现有 README |
| 运行命令 | bun start, bun dev | package.json |

### 3.3 代码结构（architecture.md）

| 要素 | 内容 | 来源 |
|------|------|------|
| agent/ | 代理核心：任务规划、执行、反思 | 代码分析 |
| components/ | React/Ink UI 组件 | 代码分析 |
| hooks/ | React 自定义 Hooks | 代码分析 |
| tools/ | 工具实现（金融、搜索） | 代码分析 |
| utils/ | 通用工具函数 | 代码分析 |
| model/ | LLM 配置和实例化 | 代码分析 |

### 3.4 核心模块（architecture.md）

| 模块 | 关键文件 | 核心职责 |
|------|----------|----------|
| Agent | agent.ts, prompts.ts, scratchpad.ts | 代理循环、工具执行、答案生成 |
| Tools | registry.ts, finance/, search/ | 工具注册、数据获取 |
| Components | CLI.tsx, Input.tsx, HistoryItemView.tsx | 终端 UI 渲染 |
| Hooks | useAgentRunner.ts, useModelSelection.ts | 状态管理、业务逻辑 |

---

## 4. 验证规则

### 4.1 完整性验证

- [ ] 每个文档都有明确的定位和目标读者
- [ ] 每个章节都有具体的内容要素
- [ ] 文档间有清晰的导航链接
- [ ] 技术细节有代码引用支撑

### 4.2 一致性验证

- [ ] 术语使用一致（Agent、Tools、Components、Hooks）
- [ ] 命令格式一致（使用代码块）
- [ ] 文件路径格式一致（使用反引号）
- [ ] 版本号与实际代码匹配

### 4.3 可用性验证

- [ ] 安装步骤可在干净环境复现
- [ ] 代码示例可直接运行
- [ ] 链接指向正确目标
- [ ] 阅读时间符合预期

---

## 5. 状态转换（文档生命周期）

```
Draft（草稿）
    ↓ 内容编写完成
Review（审核）
    ↓ 技术准确性验证
Published（发布）
    ↓ 代码更新
Outdated（过时）
    ↓ 内容更新
Review（审核）
    ↓
Published（发布）
```

---

## 6. 元数据

每个文档应包含以下元数据（以注释形式）：

```markdown
<!--
文档版本: 1.0.0
最后更新: 2026-01-25
适用代码版本: 3.0.2
作者: [Author]
-->
```
