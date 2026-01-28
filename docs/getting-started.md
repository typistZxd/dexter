<!--
文档版本: 1.0.0
最后更新: 2026-01-25
适用代码版本: 3.0.2
-->

# 安装与配置指南

本指南将帮助你在本地环境中安装和运行 Dexter。按照以下步骤操作，你将在 30 分钟内完成从零到成功运行的全部流程。

## 环境要求

### 操作系统支持

Dexter 支持以下操作系统：

- **macOS**: 10.15 (Catalina) 或更高版本
- **Linux**: Ubuntu 20.04+, Debian 10+, Fedora 33+, 以及其他主流发行版
- **Windows**: Windows 10 或更高版本（推荐使用 WSL2）

### 运行时要求

| 组件 | 版本要求 | 说明 |
|------|----------|------|
| Bun | v1.0 或更高 | JavaScript/TypeScript 运行时 |
| Git | 任意版本 | 用于克隆仓库 |

### 可选依赖

- **Ollama**: 如果你希望使用本地模型而非云端 API

---

## 安装 Bun

Bun 是 Dexter 的运行时环境，提供原生 TypeScript 支持和高性能执行。

### macOS / Linux

打开终端，执行以下命令：

```bash
curl -fsSL https://bun.sh/install | bash
```

安装完成后，重启终端或执行：

```bash
source ~/.bashrc  # 如果使用 bash
source ~/.zshrc   # 如果使用 zsh
```

### Windows

**方法 1: 使用 PowerShell（推荐）**

以管理员身份打开 PowerShell，执行：

```powershell
powershell -c "irm bun.sh/install.ps1|iex"
```

**方法 2: 使用 WSL2**

如果你已安装 WSL2，可以在 WSL 环境中使用 Linux 安装方式。

### 验证安装

安装完成后，验证 Bun 是否正确安装：

```bash
bun --version
```

如果显示版本号（如 `1.0.0` 或更高），说明安装成功。

---

## 安装 Dexter

### 1. 克隆仓库

```bash
git clone https://github.com/virattt/dexter.git
cd dexter
```

### 2. 安装依赖

```bash
bun install
```

这将安装所有必要的依赖包，包括：
- LangChain（AI 框架）
- React + Ink（CLI 界面）
- Zod（类型验证）

---

## 环境配置

Dexter 需要配置 API Key 才能正常工作。

### 创建配置文件

```bash
cp env.example .env
```

### 必需的 API Key

以下 API Key 是运行 Dexter 所必需的：

| API Key | 用途 | 获取地址 |
|---------|------|----------|
| `OPENAI_API_KEY` | OpenAI 模型（GPT-4 等） | [platform.openai.com](https://platform.openai.com/api-keys) |
| `FINANCIAL_DATASETS_API_KEY` | 金融数据查询 | [financialdatasets.ai](https://financialdatasets.ai) |

在 `.env` 文件中配置：

```bash
OPENAI_API_KEY=sk-your-openai-api-key
FINANCIAL_DATASETS_API_KEY=your-financial-datasets-api-key
```

### 可选的 API Key

你可以根据需要配置以下可选的 API Key：

**替代 LLM 提供商**

| API Key | 用途 | 获取地址 |
|---------|------|----------|
| `ANTHROPIC_API_KEY` | Claude 模型 | [console.anthropic.com](https://console.anthropic.com) |
| `GOOGLE_API_KEY` | Google Gemini | [makersuite.google.com](https://makersuite.google.com) |
| `XAI_API_KEY` | xAI Grok | [x.ai](https://x.ai) |

**本地模型**

| 配置项 | 用途 | 默认值 |
|--------|------|--------|
| `OLLAMA_BASE_URL` | Ollama 本地服务地址 | `http://127.0.0.1:11434` |

**网络搜索**

| API Key | 用途 | 获取地址 |
|---------|------|----------|
| `EXA_API_KEY` | Exa 搜索（推荐） | [exa.ai](https://exa.ai) |
| `TAVILY_API_KEY` | Tavily 搜索（备选） | [tavily.com](https://tavily.com) |

---

## 运行项目

### 生产模式

```bash
bun start
```

启动后，你将看到 Dexter 的交互界面，可以开始输入金融研究问题。

### 开发模式

```bash
bun dev
```

开发模式启用了文件监视（watch mode），当你修改代码时，会自动重新加载。

### 切换模型

在运行时，输入 `/model` 命令可以切换不同的 LLM 模型：

```
> /model
```

系统将显示可用的模型列表供你选择。

---

## 使用本地模型（Ollama）

如果你希望在本地运行模型而不使用云端 API，可以使用 Ollama。

### 1. 安装 Ollama

访问 [ollama.ai](https://ollama.ai) 下载并安装 Ollama。

### 2. 下载模型

```bash
ollama pull llama3.2
```

或其他支持的模型，如 `mistral`、`codellama` 等。

### 3. 启动 Ollama 服务

```bash
ollama serve
```

### 4. 配置 Dexter

在 `.env` 文件中设置：

```bash
OLLAMA_BASE_URL=http://127.0.0.1:11434
```

### 5. 选择本地模型

启动 Dexter 后，使用 `/model` 命令选择 Ollama 提供商和对应的模型。

---

## 常见问题

### API Key 错误

**问题**: 启动时提示 "API Key not found" 或 "Invalid API Key"

**解决方案**:
1. 确认 `.env` 文件存在于项目根目录
2. 检查 API Key 是否正确复制（无多余空格）
3. 确认 API Key 已激活且有余额
4. 重启终端后再次尝试

### 网络连接问题

**问题**: 无法连接到 API 服务

**解决方案**:
1. 检查网络连接是否正常
2. 如果在中国大陆，可能需要配置代理
3. 尝试使用本地模型（Ollama）作为替代

### 权限问题

**问题**: macOS/Linux 上安装 Bun 时提示权限不足

**解决方案**:
```bash
# 不要使用 sudo 安装 Bun
# 如果之前使用 sudo 安装，先删除
sudo rm -rf ~/.bun

# 重新安装
curl -fsSL https://bun.sh/install | bash
```

### 依赖安装失败

**问题**: `bun install` 失败

**解决方案**:
1. 确保 Bun 版本 >= 1.0
2. 删除 `node_modules` 和 `bun.lock`，重新安装：
   ```bash
   rm -rf node_modules bun.lock
   bun install
   ```

### Windows 特定问题

**问题**: Windows 上脚本执行被阻止

**解决方案**:
以管理员身份打开 PowerShell，执行：
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

## 下一步

安装完成后，你可以：

1. **了解项目架构** → 阅读 [架构与核心模块](./architecture.md)
2. **开始贡献代码** → 阅读 [贡献指南](./contributing.md)

---

*如果在安装过程中遇到其他问题，请在 [GitHub Issues](https://github.com/virattt/dexter/issues) 中报告。*
