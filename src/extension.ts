import * as vscode from "vscode";

const commandId: string = "snippet-retyper.start";
var millisecondForCharachter: number = 20;

async function delay() {
  await new Promise((resolve) => setTimeout(resolve, millisecondForCharachter));
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
        await inputBox(txt, active);
        emptyTheFile(active, textRange);
      }
    })
  );
}

async function inputBox(txt: string, active: vscode.TextEditor) {
  await vscode.window
    .showInputBox({
      prompt: "Seconds for retype",
      placeHolder: "the total seconds for retype",
      value: "1",
      title: "Snippet Retyper",
    })
    .then(async (value) => {
      if (!(value === undefined || value === "")) {
        assignMilliSecForChar(value);
      } else {
        return;
      }
      if (millisecondForCharachter > 0) {
        await retypeText(txt, active);
      }
    });

  function assignMilliSecForChar(value: string) {
    millisecondForCharachter = (Number(value) * 1000) / txt.length;
  }
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
    await delay();
    await insertChar(i);
  }

  async function insertChar(i: number) {
    // i = -1
    await active.edit((editBuilder) => {
      const doc = active.document; // get the current document
      const p = new vscode.Position( // create a new position
        doc.lineAt(doc.lineCount - 1).lineNumber + 1, // line number
        0
      );
      active.revealRange(new vscode.Range(p, p)); // reveal the position

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
  myStatusBarItem.text = "Snippet Retyper";
  myStatusBarItem.show();
}

// this method is called when your extension is deactivated
export function deactivate() {}
