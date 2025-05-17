import * as vscode from "vscode";
import { Logger } from "./services/logger";

let outputChannel: vscode.OutputChannel | undefined;

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
  outputChannel = vscode.window.createOutputChannel("PromptCraft");
  Logger.initialize(outputChannel);

  Logger.info('Extension "promptcraft" activated');

  const disposable = vscode.commands.registerCommand("promptcraft.helloWorld", () => {
    Logger.info('Command "promptcraft.helloWorld" executed');
    try {
      vscode.window.showInformationMessage("Hello World from PromptCraft!");
    } catch (e) {
      Logger.error(`Command execution failed: ${e}`);
    }
  });

  context.subscriptions.push(disposable, outputChannel);
}

// This method is called when your extension is deactivated
export function deactivate() {
  Logger.info('Extension "promptcraft" deactivated');
  if (outputChannel) {
    outputChannel.dispose();
    outputChannel = undefined;
  }
}
