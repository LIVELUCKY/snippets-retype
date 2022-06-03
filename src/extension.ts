// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

const commandId = "youtube-snippet-videos-maker.start";
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
async function delay(milliseconds: number) {
  await new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export function activate({ subscriptions }: vscode.ExtensionContext) {
  // register a command that is invoked when the status bar
  // item is selected

  barbtn(subscriptions);
  subscriptions.push(
    vscode.commands.registerCommand(commandId, async () => {
      const active = vscode.window.activeTextEditor;
      if (active) {
        var currentlyOpenTabfilePath = active.document.fileName;
        vscode.window.showInformationMessage(
          `Recording Started! ${currentlyOpenTabfilePath}`
        );
        var txt = active.document.getText().replace(/\r\n/g, "\n");
        var firstLine = active.document.lineAt(0);
        var lastLine = active.document.lineAt(active.document.lineCount - 1);
        var textRange = new vscode.Range(
          firstLine.range.start,
          lastLine.range.end
        );
        active.edit((editBuilder) => {
          editBuilder.replace(textRange, "");
        });

        for (let i = 0; i < txt.length; i++) {
          await delay(80);
          await active.edit((editBuilder) => {
            editBuilder.insert(active.selection.active, txt.charAt(i));
          });
        }
      }
    })
  );

  // create a new status bar item that we can now manage
}

function barbtn(subscriptions: { dispose(): any }[]) {
  const myStatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    0
  );
  myStatusBarItem.command = commandId;
  subscriptions.push(myStatusBarItem);
  myStatusBarItem.text = "snippet-camera";
  myStatusBarItem.show();
}

// this method is called when your extension is deactivated
export function deactivate() {}
