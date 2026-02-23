## 1. Login 核心逻辑

- [x] 1.1 创建 `src/gateway/channels/lark/login.ts`，实现 `loginLark()` 函数：使用 `node:readline` 提示用户输入 `appId`、`appSecret`、`encryptKey`（可选）
- [x] 1.2 在 `loginLark()` 中实现凭证验证：通过 `fetch` 调用 `POST https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal`，成功返回凭证信息，失败抛出明确错误
- [x] 1.3 区分错误类型：API 返回凭证无效 vs 网络错误（fetch 抛出异常），给出不同的提示信息

## 2. CLI 入口与 Script

- [x] 2.1 修改 `src/gateway/lark-entry.ts`：解析 `process.argv`，支持 `login` 和 `run`（默认）子命令，`login` 分支调用 `loginLark()` 并将结果持久化到配置
- [x] 2.2 在 `lark-entry.ts` 的 `login` 分支中实现配置持久化：调用 `loadGatewayConfig()` → 合并 Lark 账户到 `channels.lark.accounts.default` → 设置 `enabled: true` → `saveGatewayConfig()`
- [x] 2.3 在 `package.json` 的 `scripts` 中新增 `"gateway:lark:login": "tsx src/gateway/lark-entry.ts login"`

## 3. Gateway 模型配置修复

- [x] 3.1 修改 `src/gateway/gateway.ts`：新增 `resolveGatewayModel()` 从 `.dexter/settings.json` 读取 `modelId` 和 `provider`，替换 WhatsApp 和 Lark handler 中硬编码的 `gpt-5.2` / `openai`

## 4. 验证与测试

- [x] 4.1 手动运行 `bun run gateway:lark:login` 验证完整流程：输入凭证 → API 验证 → 配置写入 → 确认 `gateway.json` 内容正确
- [x] 4.2 验证 `bun run gateway:lark`（无参数）仍然正常启动 gateway，行为无变化
