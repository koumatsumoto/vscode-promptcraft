import * as vscode from "vscode";
import { Logger } from "./services/logger";
import { PromptcraftTreeProvider } from "./panels/promptcraftTreeProvider";

let outputChannel: vscode.OutputChannel | undefined;

// This method is called when your extension is activated
let treeProvider: PromptcraftTreeProvider | undefined;

export function activate(context: vscode.ExtensionContext) {
  outputChannel = vscode.window.createOutputChannel("PromptCraft");
  Logger.initialize(outputChannel);

  Logger.info('Extension "promptcraft" activated');

  // Create .promptcraft directory in workspace root if not exists
  createPromptcraftDirectory();

  // Register PromptCraft sidebar tree view
  const folders = vscode.workspace.workspaceFolders;
  const rootFolder = folders && folders.length > 0 ? folders[0] : undefined;
  if (rootFolder) {
    treeProvider = new PromptcraftTreeProvider(rootFolder.uri);
    vscode.window.registerTreeDataProvider("promptcraftView", treeProvider);
  }

  const disposable = vscode.commands.registerCommand("promptcraft.helloWorld", () => {
    Logger.info('Command "promptcraft.helloWorld" executed');
    try {
      vscode.window.showInformationMessage("Hello World from PromptCraft!");
    } catch (e) {
      Logger.error(`Command execution failed: ${e}`);
    }
  });

  const createPromptDisposable = vscode.commands.registerCommand("promptcraft.createPrompt", async () => {
    try {
      const folders = vscode.workspace.workspaceFolders;
      const rootFolder = folders && folders.length > 0 ? folders[0] : undefined;
      if (!rootFolder) {
        vscode.window.showErrorMessage("No workspace folder found.");
        return;
      }
      const now = new Date();
      const yyyy = now.getFullYear().toString();
      const mm = (now.getMonth() + 1).toString().padStart(2, "0");
      const dd = now.getDate().toString().padStart(2, "0");
      const dateFolder = `${yyyy}${mm}${dd}`;
      const hh = now.getHours().toString().padStart(2, "0");
      const min = now.getMinutes().toString().padStart(2, "0");
      const ss = now.getSeconds().toString().padStart(2, "0");
      const fileName = `${hh}${min}${ss}.md`;

      const rootUri = rootFolder.uri;
      const promptcraftUri = vscode.Uri.joinPath(rootUri, ".promptcraft");
      const dateUri = vscode.Uri.joinPath(promptcraftUri, dateFolder);
      const fileUri = vscode.Uri.joinPath(dateUri, fileName);

      // Ensure date folder exists
      try {
        await vscode.workspace.fs.stat(dateUri);
      } catch {
        await vscode.workspace.fs.createDirectory(dateUri);
      }

      // Prompt template
      const template = `# プロンプトタイトル

## 目的
ここにプロンプトの目的や背景を記述してください。

## 指示
- ここにAIへの具体的な指示を記述してください。

## 例
- 入力例: 
- 出力例: 
`;

      await vscode.workspace.fs.writeFile(fileUri, Buffer.from(template, "utf8"));
      const doc = await vscode.workspace.openTextDocument(fileUri);
      await vscode.window.showTextDocument(doc);

      Logger.info(`Created new prompt: ${fileUri.fsPath}`);

      // Refresh the tree view
      if (treeProvider) {
        treeProvider.refresh();
      }
    } catch (e) {
      Logger.error(`Failed to create prompt: ${e}`);
      vscode.window.showErrorMessage("プロンプトファイルの作成に失敗しました");
    }
  });

  const openPromptDisposable = vscode.commands.registerCommand("promptcraft.openPrompt", async (resourceUri: vscode.Uri) => {
    try {
      const doc = await vscode.workspace.openTextDocument(resourceUri);
      await vscode.window.showTextDocument(doc);
      Logger.info(`Opened prompt: ${resourceUri.fsPath}`);
    } catch (e) {
      Logger.error(`Failed to open prompt: ${e}`);
      vscode.window.showErrorMessage("プロンプトファイルのオープンに失敗しました");
    }
  });

  context.subscriptions.push(disposable, createPromptDisposable, openPromptDisposable, outputChannel);
}

/**
 * Create .promptcraft directory in the workspace root if it does not exist.
 */
async function createPromptcraftDirectory() {
  try {
    const folders = vscode.workspace.workspaceFolders;
    const rootFolder = folders && folders.length > 0 ? folders[0] : undefined;
    if (!rootFolder) {
      Logger.warn("No workspace folder found. .promptcraft directory not created.");
      return;
    }
    const rootUri = rootFolder.uri;
    const promptcraftUri = vscode.Uri.joinPath(rootUri, ".promptcraft");
    // Check if directory exists
    try {
      await vscode.workspace.fs.stat(promptcraftUri);
      Logger.info(".promptcraft directory already exists.");
    } catch {
      // Directory does not exist, create it
      await vscode.workspace.fs.createDirectory(promptcraftUri);
      Logger.info(".promptcraft directory created.");
    }
  } catch (e) {
    Logger.error(`Failed to create .promptcraft directory: ${e}`);
  }
}

// This method is called when your extension is deactivated
export function deactivate() {
  Logger.info('Extension "promptcraft" deactivated');
  if (outputChannel) {
    outputChannel.dispose();
    outputChannel = undefined;
  }
}
