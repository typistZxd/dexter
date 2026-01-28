# Feature Specification: Dexter 新手上手文档

**Feature Branch**: `001-onboarding-docs`  
**Created**: 2026-01-25  
**Status**: Draft  
**Input**: 为 Dexter 项目创建一份新手上手文档，包括：项目概述和核心功能介绍、安装和环境配置步骤、快速启动指南、代码结构说明、核心模块介绍（Agent、Tools、Components、Hooks）、开发流程和贡献指南

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 首次接触项目的开发者了解 Dexter 是什么 (Priority: P1)

作为一个首次接触 Dexter 项目的开发者，我想要快速了解 Dexter 是什么、它能做什么，以及它的核心价值，以便判断这个项目是否符合我的需求。

**Why this priority**: 这是新手接触项目的第一步，如果开发者无法快速理解项目的价值和用途，就不会继续深入学习和使用。

**Independent Test**: 可以通过让一个从未接触过项目的开发者阅读概述部分，然后询问他们是否能准确描述 Dexter 的核心功能和使用场景来测试。

**Acceptance Scenarios**:

1. **Given** 开发者打开新手文档, **When** 阅读项目概述部分, **Then** 能在 2 分钟内理解 Dexter 是一个自主金融研究代理，具备智能任务规划、自主执行、自我验证等核心能力
2. **Given** 开发者阅读完概述, **When** 被询问项目用途, **Then** 能准确说明 Dexter 适用于金融数据分析、市场研究等场景

---

### User Story 2 - 开发者成功安装并运行 Dexter (Priority: P1)

作为一个想要使用或参与开发 Dexter 的开发者，我需要能够按照文档说明成功安装所有依赖、配置环境并运行项目，以便开始使用或开发工作。

**Why this priority**: 安装和运行是实际使用项目的必要前提，如果开发者无法成功启动项目，后续的一切学习和贡献都无从谈起。

**Independent Test**: 可以通过在一台干净的开发机器上（已安装基本开发工具），按照文档步骤执行安装和启动，验证是否能成功运行。

**Acceptance Scenarios**:

1. **Given** 开发者有一台装有 macOS/Linux/Windows 的电脑, **When** 按照文档步骤安装 Bun 运行时, **Then** 能成功安装并验证 Bun 版本
2. **Given** 开发者已安装 Bun, **When** 执行 `bun install` 安装项目依赖, **Then** 所有依赖成功安装无报错
3. **Given** 开发者已配置好必要的 API Key, **When** 执行 `bun start`, **Then** Dexter CLI 成功启动并显示交互界面
4. **Given** 开发者遇到缺少 API Key 的情况, **When** 查阅环境配置说明, **Then** 能找到所有必需和可选 API Key 的获取方式和配置方法

---

### User Story 3 - 开发者理解项目代码结构 (Priority: P2)

作为一个想要深入了解或贡献代码的开发者，我需要理解项目的目录结构和各文件夹的职责，以便快速定位我需要修改或学习的代码位置。

**Why this priority**: 理解代码结构是进行代码贡献的基础，但不影响基本使用，因此优先级略低于安装和运行。

**Independent Test**: 可以通过给开发者一个简单的任务（如"找到工具注册逻辑在哪里"），测试他们能否根据文档快速定位。

**Acceptance Scenarios**:

1. **Given** 开发者阅读代码结构说明, **When** 需要找到 Agent 核心逻辑, **Then** 能准确定位到 `src/agent/` 目录
2. **Given** 开发者阅读代码结构说明, **When** 需要了解 CLI 界面组件, **Then** 能准确定位到 `src/components/` 目录
3. **Given** 开发者阅读代码结构说明, **When** 需要添加新的金融数据工具, **Then** 能准确定位到 `src/tools/finance/` 目录

---

### User Story 4 - 开发者理解核心模块的工作原理 (Priority: P2)

作为一个想要扩展或修改 Dexter 功能的开发者，我需要理解 Agent、Tools、Components、Hooks 这四个核心模块的设计思想和工作流程，以便能够正确地进行功能扩展。

**Why this priority**: 核心模块介绍对于功能扩展至关重要，但对于基本使用不是必须的。

**Independent Test**: 可以通过让开发者描述"用户提问后到收到回答的完整数据流"来测试对核心模块的理解。

**Acceptance Scenarios**:

1. **Given** 开发者阅读 Agent 模块介绍, **When** 被询问代理循环流程, **Then** 能描述出"接收查询→调用 LLM→执行工具→汇总结果→生成回答"的基本流程
2. **Given** 开发者阅读 Tools 模块介绍, **When** 想要添加新工具, **Then** 知道需要在 `registry.ts` 中注册并编写工具描述
3. **Given** 开发者阅读 Components 模块介绍, **When** 想要修改 UI 显示, **Then** 知道组件基于 Ink 框架，并了解主要组件的职责
4. **Given** 开发者阅读 Hooks 模块介绍, **When** 想要修改状态管理逻辑, **Then** 能找到对应的 Hook 文件并理解其作用

---

### User Story 5 - 开发者成功提交代码贡献 (Priority: P3)

作为一个想要为 Dexter 项目贡献代码的开发者，我需要了解项目的开发规范、分支策略和 PR 流程，以便我的贡献能够被顺利接受。

**Why this priority**: 贡献流程对于维护项目健康很重要，但对于大多数初次使用的开发者来说不是首要需求。

**Independent Test**: 可以通过让开发者完成一个小功能的开发并成功提交 PR 来测试。

**Acceptance Scenarios**:

1. **Given** 开发者想要贡献代码, **When** 阅读贡献指南, **Then** 了解需要 Fork 仓库、创建功能分支、提交小而专注的 PR
2. **Given** 开发者修改了代码, **When** 提交前检查, **Then** 知道需要运行 `bun typecheck` 进行类型检查
3. **Given** 开发者的 PR 被合并, **When** 查看贡献指南, **Then** 了解后续如何同步上游代码

---

### Edge Cases

- 开发者使用的操作系统不在常见支持范围内（如某些 Linux 发行版）时，文档应提供通用的 Bun 安装方式或指向官方文档
- 开发者的网络环境无法访问某些 API（如 OpenAI）时，文档应说明如何使用本地模型（如 Ollama）作为替代
- 开发者在安装过程中遇到常见错误（如权限问题、依赖冲突）时，文档应提供故障排除指南或常见问题解答

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: 文档必须包含项目概述，清晰说明 Dexter 是什么、核心功能和适用场景
- **FR-002**: 文档必须包含完整的环境要求列表，包括运行时版本、必需和可选的 API Key
- **FR-003**: 文档必须提供在 macOS、Linux 和 Windows 上安装 Bun 运行时的步骤
- **FR-004**: 文档必须提供项目克隆、依赖安装和环境配置的完整步骤
- **FR-005**: 文档必须提供启动项目的命令（`bun start` 和 `bun dev`）及其区别说明
- **FR-006**: 文档必须包含项目目录结构图，说明各目录和文件的职责
- **FR-007**: 文档必须介绍 Agent 模块的核心职责和工作流程
- **FR-008**: 文档必须介绍 Tools 模块的设计思想和如何注册新工具
- **FR-009**: 文档必须介绍 Components 模块的组件体系和主要组件职责
- **FR-010**: 文档必须介绍 Hooks 模块的设计模式和主要 Hook 的作用
- **FR-011**: 文档必须包含开发流程说明，包括分支策略和 PR 提交规范
- **FR-012**: 文档必须使用中文编写，以符合目标用户群体的语言需求

### Key Entities

- **新手文档（Onboarding Documentation）**: 面向首次接触项目的开发者的入门指南，包含从了解项目到贡献代码的完整路径
- **环境配置（Environment Configuration）**: 运行 Dexter 所需的运行时、依赖项和 API Key 等配置信息
- **核心模块（Core Modules）**: Agent、Tools、Components、Hooks 四大模块，构成 Dexter 的技术架构
- **贡献指南（Contribution Guide）**: 描述如何参与项目开发的规范和流程

## Assumptions

- **假设 1**: 目标读者具备基本的前端/Node.js 开发经验，熟悉命令行操作
- **假设 2**: 目标读者能够访问 GitHub 并了解基本的 Git 操作
- **假设 3**: 目标读者有能力获取必要的 API Key（OpenAI、Financial Datasets 等）
- **假设 4**: 现有 README.md 的内容可以作为参考但需要扩展为更详细的新手文档

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 90% 的新开发者能在阅读文档后 30 分钟内成功完成项目安装和首次运行
- **SC-002**: 80% 的开发者能在阅读文档后准确描述 Dexter 的核心功能和适用场景
- **SC-003**: 70% 的开发者能在阅读文档后独立定位到需要修改的代码文件
- **SC-004**: 首次贡献者能在参考文档后成功提交符合规范的 PR
- **SC-005**: 新手文档的完整阅读时间控制在 15-20 分钟以内
