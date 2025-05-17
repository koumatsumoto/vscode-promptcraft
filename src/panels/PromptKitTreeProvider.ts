import * as vscode from "vscode";
import * as path from "path";

/**
 * Represents a node (folder or file) in the .promptkit tree.
 */
export class PromptKitTreeItem extends vscode.TreeItem {
  constructor(
    public override readonly resourceUri: vscode.Uri,
    public override readonly collapsibleState: vscode.TreeItemCollapsibleState,
  ) {
    super(resourceUri, collapsibleState);
    this.contextValue = this.isDirectory() ? "promptkitFolder" : "promptkitFile";
    this.label = path.basename(resourceUri.fsPath);
    this.iconPath = this.isDirectory() ? new vscode.ThemeIcon("folder") : new vscode.ThemeIcon("markdown");
    if (!this.isDirectory()) {
      this.command = {
        command: "promptkit.openPrompt",
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
 * TreeDataProvider for .promptkit folder.
 */
export class PromptKitTreeProvider implements vscode.TreeDataProvider<PromptKitTreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<PromptKitTreeItem | undefined | void> = new vscode.EventEmitter<
    PromptKitTreeItem | undefined | void
  >();
  readonly onDidChangeTreeData: vscode.Event<PromptKitTreeItem | undefined | void> = this._onDidChangeTreeData.event;

  constructor(private workspaceRoot: vscode.Uri) {}

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: PromptKitTreeItem): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: PromptKitTreeItem): Promise<PromptKitTreeItem[]> {
    let dirUri: vscode.Uri;
    if (element) {
      dirUri = element.resourceUri;
    } else {
      dirUri = vscode.Uri.joinPath(this.workspaceRoot, ".promptkit");
    }

    try {
      const entries = await vscode.workspace.fs.readDirectory(dirUri);
      return entries.map(([name, type]) => {
        const childUri = vscode.Uri.joinPath(dirUri, name);
        return new PromptKitTreeItem(
          childUri,
          type === vscode.FileType.Directory ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None,
        );
      });
    } catch {
      return [];
    }
  }
}
