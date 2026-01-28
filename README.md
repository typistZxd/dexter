<!--
文档版本: 1.0.0
最后更新: 2026-01-25
适用代码版本: 3.0.2
-->

# Dexter 🤖

**Dexter 是一个自主金融研究代理**，能够像专业分析师一样思考、规划和执行金融研究任务。它将复杂的金融问题分解为结构化的研究步骤，自动获取实时市场数据，并生成数据驱动的研究报告。

<img width="1098" alt="Dexter CLI 界面" src="https://github.com/user-attachments/assets/3bcc3a7f-b68a-4f5e-8735-9d22196ff76e" />

---

## 核心能力

| 能力 | 说明 |
|------|------|
| 🧠 **智能任务规划** | 自动将复杂查询分解为结构化的研究步骤 |
| 🔧 **自主执行** | 选择并调用正确的工具来获取金融数据 |
| 🔄 **自我验证** | 检查自身工作，迭代优化直到任务完成 |
| 📊 **实时数据** | 访问收入报表、资产负债表、现金流量表等财务数据 |
| 🛡️ **安全机制** | 内置循环检测和步骤限制，防止失控执行 |

## 适用场景

- **金融数据分析**: 快速获取和分析上市公司财务数据
- **市场研究**: 结合财务数据和网络信息进行综合研究
- **投资决策支持**: 基于实时数据生成分析报告

<img width="875" alt="Dexter 工作流程" src="https://github.com/user-attachments/assets/72d28363-69ea-4c74-a297-dfa60aa347f7" />

---

## 快速开始

### 前置条件

- [Bun](https://bun.sh) 运行时 (v1.0+)
- [OpenAI API Key](https://platform.openai.com/api-keys)
- [Financial Datasets API Key](https://financialdatasets.ai)

### 安装

```bash
# 1. 克隆仓库
git clone https://github.com/virattt/dexter.git
cd dexter

# 2. 安装依赖
bun install

# 3. 配置环境变量
cp env.example .env
# 编辑 .env 文件，填入你的 API Key
```

### 运行

```bash
# 生产模式
bun start

# 开发模式（支持热重载）
bun dev
```

启动后，输入你的金融研究问题，Dexter 将自动规划和执行研究任务。

> 📖 **详细安装指南**: 如需了解更多配置选项（如使用本地模型、配置其他 LLM 提供商），请查看 [安装与配置指南](./docs/getting-started.md)

---

## 文档导航

| 文档 | 内容 |
|------|------|
| [安装与配置指南](./docs/getting-started.md) | 完整的环境配置、多平台安装、本地模型使用、常见问题 |
| [架构与核心模块](./docs/architecture.md) | 项目结构、技术栈、Agent/Tools/Components/Hooks 模块详解 |
| [贡献指南](./docs/contributing.md) | 开发流程、代码规范、PR 提交、代码审查 |

---

## 技术栈

| 组件 | 技术 |
|------|------|
| 运行时 | Bun |
| 语言 | TypeScript |
| UI 框架 | React + Ink |
| AI 框架 | LangChain |
| 验证 | Zod |

---

## 贡献

我们欢迎社区贡献！

1. Fork 仓库
2. 创建功能分支
3. 提交你的变更
4. 推送到分支
5. 创建 Pull Request

**重要**: 请保持 PR 小而聚焦，这将使代码审查更加高效。

> 📖 **详细贡献指南**: 请查看 [贡献指南](./docs/contributing.md) 了解完整的开发流程和代码规范。

---

## 支持

- 📣 关注 Twitter: [![Twitter Follow](https://img.shields.io/twitter/follow/virattt?style=social)](https://twitter.com/virattt)
- 💬 问题讨论: [GitHub Discussions](https://github.com/virattt/dexter/discussions)
- 🐛 Bug 报告: [GitHub Issues](https://github.com/virattt/dexter/issues)

---

## 许可证

本项目采用 MIT 许可证。
