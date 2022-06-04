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
        var currentlyOpenTabfilePath = getActiveWindowName(active);
        informationMassage(currentlyOpenTabfilePath);

        var txt = endOfFileReplacment(active);
        var textRange = getRange(active);
        emptythefile(active, textRange);

        await retypetxt(txt, active);
      }
    })
  );

  // create a new status bar item that we can now manage
}

function informationMassage(currentlyOpenTabfilePath: string) {
  vscode.window.showInformationMessage(
    `Recording Started! ${currentlyOpenTabfilePath}`
  );
}

function getActiveWindowName(active: vscode.TextEditor) {
  return active.document.fileName;
}

function endOfFileReplacment(active: vscode.TextEditor) {
  return active.document.getText().replace(/\r\n/g, "\n");
}

function getRange(active: vscode.TextEditor) {
  var firstLine = active.document.lineAt(0);
  var lastLine = active.document.lineAt(active.document.lineCount - 1);
  var textRange = new vscode.Range(firstLine.range.start, lastLine.range.end);
  return textRange;
}

function emptythefile(active: vscode.TextEditor, textRange: vscode.Range) {
  active.edit((editBuilder) => {
    editBuilder.replace(textRange, "");
  });
}

async function retypetxt(txt: string, active: vscode.TextEditor) {
  for (let i = -1; i < txt.length; i++) {
    await delay(20);
    await insertCharachter(i);
  }

  async function insertCharachter(i: number) {
    await active.edit((editBuilder) => {
      const doc = active.document;
      editBuilder.insert(
        new vscode.Position(doc.lineAt(doc.lineCount - 1).lineNumber + 1, 0),
        txt.charAt(i)
      );
    });
  }
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
