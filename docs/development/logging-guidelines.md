# ログ方針

- 拡張機能のイベント処理、コマンド実行、activation など主要な関数の呼び出しでは info ログを必ず残すこと。
- 内部関数や副作用の無い純粋関数には、原則としてログを残さないこと。
- 例外処理には error ログを残すこと。
- 通常は発生しないような条件分岐やエラー処理には warn ログを残すこと。
- ログ出力には Logger クラスを使用すること。
- ログレベルは用途に応じて info, warn, error, debug, trace, log を使い分けること。

## 利用例

```typescript
// In your extension's activation function:
import { Logger } from "./services/logger";

export function activate(context: vscode.ExtensionContext) {
  Logger.info("Extension activated");
  try {
    // ...main logic...
  } catch (e) {
    Logger.error(`Activation failed: ${e}`);
  }
}

// In command handler:
function handleCommand() {
  Logger.info("Command executed");
  if (!expectedCondition) {
    Logger.warn("Unexpected condition encountered");
  }
}
```
