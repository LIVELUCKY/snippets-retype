// import * as vscode from "vscode";

import * as vscode from "vscode";

const commandId = "youtube-snippet-videos-maker.start";

async function delay(milliseconds: number) {
  await new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export function activate({ subscriptions }: vscode.ExtensionContext) {
  snippetBtn(subscriptions);
  subscriptions.push(
    vscode.commands.registerCommand(commandId, async () => {
      const active = vscode.window.activeTextEditor;
      if (active) {
        const tabName = getActiveWindowName(active);
        informationMassage(tabName);

        const txt = endOfFileRemove(active);
        const textRange = getRange(active);
        emptyTheFile(active, textRange);

        await retypeText(txt, active);
      }
    })
  );

  // create a new status bar item that we can now manage
}

function informationMassage(tabName: string) {
  vscode.window.showInformationMessage(`Recording Started! ${tabName}`);
}

function getActiveWindowName(active: vscode.TextEditor) {
  return active.document.fileName;
}

function endOfFileRemove(active: vscode.TextEditor) {
  return active.document.getText().replace(/\r\n/g, "\n");
}

function getRange(active: vscode.TextEditor) {
  const firstLine = active.document.lineAt(0);
  const lastLine = active.document.lineAt(active.document.lineCount - 1);
  return new vscode.Range(firstLine.range.start, lastLine.range.end);
}

function emptyTheFile(active: vscode.TextEditor, textRange: vscode.Range) {
  active.edit((editBuilder) => {
    editBuilder.replace(textRange, "");
  });
}

async function retypeText(txt: string, active: vscode.TextEditor) {
  for (let i = -1; i < txt.length; i++) {
    await delay(10);
    await insertChar(i);
  }

  async function insertChar(i: number) {
    await active.edit((editBuilder) => {
      const doc = active.document;
      const p = new vscode.Position(
        doc.lineAt(doc.lineCount - 1).lineNumber + 1,
        0
      );
      active.revealRange(new vscode.Range(p, p));

      editBuilder.insert(p, txt.charAt(i));
    });
  }
}

function snippetBtn(subscriptions: { dispose(): any }[]) {
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
