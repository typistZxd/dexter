## Context

Lark channel 已实现消息收发（`runtime.ts`、`outbound.ts`），通过 `@larksuiteoapi/node-sdk` 创建 Client 并建立 WebSocket 连接。认证依赖 `appId` + `appSecret`，但目前用户只能手动写入 `gateway.json` 配置文件，没有验证凭证有效性的步骤，也没有 CLI 入口。

WhatsApp channel 有完整的登录模式：`gateway:login` script → `index.ts` 的 `login` 分支 → `login.ts` 执行 QR 扫码 → 成功后 `saveGatewayConfig()`。Lark 需要对齐这个模式，但认证机制不同——Lark 使用 App 凭证（appId/appSecret）而非 QR 扫码。

## Goals / Non-Goals

**Goals:**
- 提供交互式 CLI 流程：提示用户输入 `appId` 和 `appSecret`，可选输入 `encryptKey`
- 调用 Lark Open API 验证凭证有效性（获取 `tenant_access_token`）
- 验证通过后将凭证持久化到 `gateway.json`，自动启用账户
- 在 `lark-entry.ts` 增加 `login` 子命令分发
- 在 `package.json` 新增 `gateway:lark:login` script

**Non-Goals:**
- OAuth 2.0 浏览器授权流程（Lark 自建应用使用 appId/appSecret 即可）
- 多账户交互式切换（使用 `default` 账户，与 WhatsApp 一致）
- Lark Marketplace 应用支持（仅 Self-built App）
- 凭证加密存储（与 WhatsApp 一致，明文存入 gateway.json）

## Decisions

### D1: 使用 `tenant_access_token` API 验证凭证

调用 `POST https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal`，传入 `app_id` 和 `app_secret`。成功返回 200 + token 表示凭证有效，失败返回错误码。

**替代方案**: 用 SDK 的 `client.auth.tenantAccessToken.internal()` 方法 — 但这个方法在某些 SDK 版本中未暴露或行为不一致。直接 HTTP 调用更明确、可控。

**结论**: 使用原生 `fetch` 调用 Lark API endpoint，不依赖 SDK 内部 auth 方法，保持验证逻辑显式可见。

### D2: 使用 Node.js readline 进行交互式输入

使用 `node:readline` 的 `createInterface` 进行终端交互输入。对 `appSecret` 不做掩码处理（与 WhatsApp 登录打印 QR 码到终端的隐私级别一致）。

**替代方案**: 使用 Ink 组件 — 但登录是一次性操作，不需要 React 渲染，readline 更轻量且与 WhatsApp 的 `console.log` 风格一致。

### D3: 凭证存储在 `gateway.json` 的 `channels.lark.accounts` 下

与现有配置结构完全一致。写入 `accounts.default` 下的 `appId`、`appSecret`、`encryptKey`（可选），并设置 `enabled: true`。

### D4: `lark-entry.ts` 增加命令分发

参照 `src/gateway/index.ts` 的模式，解析 `process.argv`，支持 `login` 和 `run`（默认）子命令。

## Risks / Trade-offs

- **[凭证明文存储]** → 与 WhatsApp 的 `creds.json` 一致，gateway.json 已在 `.gitignore`。未来可统一加密方案。
- **[Feishu domain 硬编码]** → `runtime.ts` 已使用 `lark.Domain.Feishu`，login 验证 endpoint 也指向 feishu.cn。如需支持国际版 Lark 需要后续扩展 domain 参数。
- **[网络错误处理]** → fetch 调用可能因网络问题失败，需要区分网络错误和凭证错误，给出清晰提示。
