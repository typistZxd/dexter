## ADDED Requirements

### Requirement: Interactive credential input
The system SHALL prompt the user to enter Lark app credentials (`appId`, `appSecret`) via the terminal when the `login` command is invoked. The system SHALL optionally accept an `encryptKey` input (press Enter to skip).

#### Scenario: User provides all credentials
- **WHEN** user runs `bun run gateway:lark:login`
- **THEN** system prompts for `appId`, `appSecret`, and `encryptKey` in sequence, accepting each on Enter

#### Scenario: User skips optional encryptKey
- **WHEN** user presses Enter without typing a value at the `encryptKey` prompt
- **THEN** system proceeds without setting `encryptKey` in the configuration

### Requirement: Credential validation via Lark API
The system SHALL validate the provided `appId` and `appSecret` by calling the Lark tenant_access_token API endpoint (`POST https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal`) before persisting any configuration.

#### Scenario: Valid credentials
- **WHEN** the API returns HTTP 200 with a `tenant_access_token` in the response body
- **THEN** system prints a success message including the app name (if available) and proceeds to save configuration

#### Scenario: Invalid credentials
- **WHEN** the API returns a non-zero error code (e.g., invalid `app_id` or `app_secret`)
- **THEN** system prints an error message describing the failure and exits without modifying configuration

#### Scenario: Network failure
- **WHEN** the fetch request fails due to network error (timeout, DNS failure, etc.)
- **THEN** system prints a network error message and exits without modifying configuration

### Requirement: Configuration persistence
The system SHALL save validated credentials to `gateway.json` under `channels.lark.accounts.default` and set `channels.lark.enabled` to `true`.

#### Scenario: First-time login with no existing config
- **WHEN** `gateway.json` does not exist
- **THEN** system creates the file with default structure and the Lark account under `channels.lark.accounts.default` with `enabled: true`

#### Scenario: Login with existing config
- **WHEN** `gateway.json` already exists with other configuration
- **THEN** system merges the Lark account into existing config without overwriting other channels or settings

#### Scenario: Re-login overwrites previous Lark credentials
- **WHEN** `channels.lark.accounts.default` already exists in config
- **THEN** system overwrites `appId`, `appSecret`, and `encryptKey` with the newly provided values

### Requirement: CLI command entry point
The system SHALL support a `login` subcommand in `lark-entry.ts` and expose it as `gateway:lark:login` script in `package.json`.

#### Scenario: Login command invocation
- **WHEN** user runs `tsx src/gateway/lark-entry.ts login` or `bun run gateway:lark:login`
- **THEN** system executes the Lark login flow

#### Scenario: Default command remains run
- **WHEN** user runs `tsx src/gateway/lark-entry.ts` without arguments or with `run`
- **THEN** system starts the Lark gateway as before (no behavioral change)
