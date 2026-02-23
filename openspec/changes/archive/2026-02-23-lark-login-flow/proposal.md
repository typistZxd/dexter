## Why

Lark (飞书) channel 已经实现了基本的消息收发（runtime、outbound），但缺少登录/凭证验证流程。WhatsApp channel 有完整的 `login` 命令用于 QR 扫码认证，而 Lark 用户目前只能手动将 `appId` / `appSecret` 写入配置文件，无法验证凭证是否有效，也没有对应的 CLI 入口。需要补齐这个缺口，让 Lark channel 的配置体验与 WhatsApp 对齐。

## What Changes

- 新增 `src/gateway/channels/lark/login.ts`：实现交互式登录流程，引导用户输入 `appId` 和 `appSecret`，调用 Lark API 验证凭证有效性（如获取 tenant_access_token），验证通过后持久化到 gateway 配置文件。
- 扩展 `src/gateway/lark-entry.ts`：增加 `login` 子命令分发，与 WhatsApp 的 `src/gateway/index.ts` login 命令模式对齐。
- 在 `package.json` 中新增 `gateway:lark:login` script，提供一键登录入口。
- 登录成功后自动将账户标记为 `enabled: true` 并更新配置。

## Capabilities

### New Capabilities
- `lark-login`: Lark channel 的交互式登录流程，包括凭证输入、API 验证、配置持久化。

### Modified Capabilities
<!-- 无现有 spec 需要修改 -->

## Impact

- **代码**: `src/gateway/channels/lark/` 新增 `login.ts`；修改 `lark-entry.ts` 添加命令分发。
- **配置**: `src/gateway/config.ts` 可能需要补充 Lark 账户配置的写入辅助函数。
- **依赖**: 使用已有的 `@larksuiteoapi/node-sdk` 调用 Lark Open API 验证凭证，无新依赖。
- **Scripts**: `package.json` 新增 `gateway:lark:login`。
