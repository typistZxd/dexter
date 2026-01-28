<!--
文档版本: 1.0.0
最后更新: 2026-01-25
适用代码版本: 3.0.2
-->

# 贡献指南

感谢你对 Dexter 项目的关注！本指南将帮助你了解如何为项目做出贡献。

---

## 开发环境设置

### 推荐的 IDE

- **VS Code** 或 **Cursor**（推荐）
  - TypeScript 支持优秀
  - 丰富的扩展生态

### 推荐的扩展/插件

| 扩展名称 | 用途 |
|----------|------|
| ESLint | 代码检查 |
| Prettier | 代码格式化 |
| TypeScript Vue Plugin | TypeScript 增强 |

### 开发依赖

确保你已安装：
- Bun v1.0+
- Git

---

## 开发流程

### 1. Fork 仓库

访问 [github.com/virattt/dexter](https://github.com/virattt/dexter)，点击右上角的 "Fork" 按钮。

### 2. 克隆你的 Fork

```bash
git clone https://github.com/YOUR_USERNAME/dexter.git
cd dexter
```

### 3. 添加上游远程

```bash
git remote add upstream https://github.com/virattt/dexter.git
```

### 4. 创建功能分支

```bash
# 从最新的 main 分支创建
git checkout main
git pull upstream main
git checkout -b feat/your-feature-name
```

**分支命名规范**：
- 新功能：`feat/YYMMDD/feature-name` 或 `feat/feature-name`
- Bug 修复：`fix/YYMMDD/issue-description` 或 `fix/issue-description`
- 文档：`docs/description`

### 5. 安装依赖

```bash
bun install
```

### 6. 进行开发

编写代码，实现你的功能或修复。

### 7. 运行测试

```bash
# 类型检查
bun typecheck

# 运行测试
bun test

# 开发模式测试
bun dev
```

### 8. 提交代码

```bash
git add .
git commit -m "feat: 添加新功能的简短描述"
```

### 9. 推送到你的 Fork

```bash
git push origin feat/your-feature-name
```

### 10. 创建 Pull Request

在 GitHub 上打开你的 Fork，点击 "Compare & pull request"。

---

## 代码规范

### 文件命名约定

| 类型 | 命名规范 | 示例 |
|------|----------|------|
| React 组件 | PascalCase，`.tsx` 扩展名 | `ModelSelector.tsx` |
| Hook | camelCase，`use` 前缀，`.ts` 扩展名 | `useAgentRunner.ts` |
| 工具函数 | kebab-case，`.ts` 扩展名 | `ai-message.ts` |
| 类型定义 | `types.ts` | `types.ts` |
| 模块导出 | `index.ts` | `index.ts` |

### 代码风格

- **组件**: 使用函数式组件和 Hooks，避免类组件
- **类型**: 充分利用 TypeScript 类型系统，避免 `any`
- **导出**: 每个模块通过 `index.ts` 导出公共 API
- **组合优于继承**: 优先使用组合模式

### TypeScript 规范

```typescript
// ✅ 好的做法
interface UserProps {
  name: string;
  age: number;
}

function User({ name, age }: UserProps) {
  return <Text>{name}</Text>;
}

// ❌ 避免的做法
function User(props: any) {  // 不要使用 any
  return <Text>{props.name}</Text>;
}
```

### 导入顺序

1. React / 第三方库
2. 内部模块（绝对路径）
3. 相对路径导入
4. 类型导入

```typescript
// 1. 第三方库
import React from 'react';
import { Box, Text } from 'ink';

// 2. 内部模块
import { Agent } from '../agent/index.js';

// 3. 相对路径
import { useAgentRunner } from './useAgentRunner.js';

// 4. 类型导入
import type { AgentConfig } from '../agent/types.js';
```

---

## 测试

### 运行测试

```bash
# 运行所有测试
bun test

# 监视模式
bun test --watch
```

### 类型检查

```bash
bun typecheck
```

**重要**: 提交代码前，确保类型检查通过！

### 添加新测试

测试文件放在与被测试文件相同的目录，使用 `.test.ts` 后缀：

```
src/
├── utils/
│   ├── helper.ts
│   └── helper.test.ts
```

---

## 提交规范

### Commit 消息格式

使用语义化提交消息：

```
<type>: <subject>

[optional body]
```

**Type 类型**：

| Type | 说明 |
|------|------|
| `feat` | 新功能 |
| `fix` | Bug 修复 |
| `docs` | 文档更新 |
| `style` | 代码格式（不影响逻辑） |
| `refactor` | 代码重构 |
| `test` | 测试相关 |
| `chore` | 构建/工具变更 |

**示例**：

```bash
feat: 添加 Ollama 模型支持
fix: 修复 API Key 验证逻辑
docs: 更新安装指南
refactor: 优化工具注册机制
```

### Pull Request 规范

**标题格式**：与 Commit 消息格式相同

**描述内容**：
- 说明变更的目的和背景
- 列出主要变更点
- 如果是 Bug 修复，附上复现步骤
- 如果有相关 Issue，引用它

**示例 PR 描述**：

```markdown
## 变更说明

添加了对 Ollama 本地模型的支持，用户可以在不使用云端 API 的情况下运行 Dexter。

## 主要变更

- 新增 `@langchain/ollama` 依赖
- 在 ModelSelector 中添加 Ollama 选项
- 更新环境变量配置

## 测试

- [x] 本地测试通过
- [x] 类型检查通过

Closes #123
```

### PR 最佳实践

- **保持 PR 小而聚焦**：一个 PR 只做一件事
- **提供清晰的描述**：让审查者快速理解变更
- **及时响应反馈**：对审查意见积极回应

---

## 代码审查

### 审查流程

1. 提交 PR 后，等待维护者审查
2. 根据反馈进行修改
3. 所有检查通过后，PR 将被合并

### 审查标准

- 代码是否符合项目规范？
- 是否有充分的测试覆盖？
- 是否符合项目宪法中的核心原则？
- 变更是否向后兼容？

---

## 同步上游代码

当上游仓库有更新时，同步到你的 Fork：

### 1. 获取上游更新

```bash
git fetch upstream
```

### 2. 合并到本地 main

```bash
git checkout main
git merge upstream/main
```

### 3. 推送到你的 Fork

```bash
git push origin main
```

### 4. 更新功能分支（如果需要）

```bash
git checkout feat/your-feature-name
git rebase main
```

### 解决冲突

如果在 rebase 过程中遇到冲突：

1. 打开冲突文件，手动解决冲突
2. 标记为已解决：`git add <file>`
3. 继续 rebase：`git rebase --continue`

---

## 寻求帮助

- **问题讨论**: [GitHub Discussions](https://github.com/virattt/dexter/discussions)
- **Bug 报告**: [GitHub Issues](https://github.com/virattt/dexter/issues)
- **联系维护者**: [@virattt](https://twitter.com/virattt)

---

## 行为准则

参与本项目即表示你同意遵守项目的行为准则：

- 尊重他人，保持友好的交流氛围
- 提供建设性的反馈
- 专注于技术讨论

---

*感谢你的贡献！每一个 PR 都让 Dexter 变得更好。*
