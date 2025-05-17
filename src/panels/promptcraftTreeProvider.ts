// src/panels/promptcraftTreeProvider.ts

import * as vscode from "vscode";
import * as path from "path";

/**
 * Represents a node (folder or file) in the .promptcraft tree.
 */
export class PromptcraftTreeItem extends vscode.TreeItem {
  constructor(
    public override readonly resourceUri: vscode.Uri,
    public override readonly collapsibleState: vscode.TreeItemCollapsibleState,
  ) {
    super(resourceUri, collapsibleState);
    this.contextValue = this.isDirectory() ? "promptcraftFolder" : "promptcraftFile";
    this.label = path.basename(resourceUri.fsPath);
    this.iconPath = this.isDirectory() ? new vscode.ThemeIcon("folder") : new vscode.ThemeIcon("markdown");
    if (!this.isDirectory()) {
      this.command = {
        command: "promptcraft.openPrompt",
        title: "Open Prompt",
        arguments: [this.resourceUri],
      };
    }
  }

  isDirectory(): boolean {
    return this.collapsibleState !== vscode.TreeItemCollapsibleState.None;
  }
}

/**
 * TreeDataProvider for .promptcraft folder.
 */
export class PromptcraftTreeProvider implements vscode.TreeDataProvider<PromptcraftTreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<PromptcraftTreeItem | undefined | void> = new vscode.EventEmitter<
    PromptcraftTreeItem | undefined | void
  >();
  readonly onDidChangeTreeData: vscode.Event<PromptcraftTreeItem | undefined | void> = this._onDidChangeTreeData.event;

  constructor(private workspaceRoot: vscode.Uri) {}

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: PromptcraftTreeItem): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: PromptcraftTreeItem): Promise<PromptcraftTreeItem[]> {
    let dirUri: vscode.Uri;
    if (element) {
      dirUri = element.resourceUri;
    } else {
      dirUri = vscode.Uri.joinPath(this.workspaceRoot, ".promptcraft");
    }

    try {
      const entries = await vscode.workspace.fs.readDirectory(dirUri);
      return entries.map(([name, type]) => {
        const childUri = vscode.Uri.joinPath(dirUri, name);
        return new PromptcraftTreeItem(
          childUri,
          type === vscode.FileType.Directory ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None,
        );
      });
    } catch {
      return [];
    }
  }
}
