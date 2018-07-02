// The module 'vscode' contains the VS Code extensibility API
// Import the necessary extensibility types to use in your code below
import { ExtensionContext } from "vscode";
import { ProgressWatcher } from "./progress";

// This method is called when your extension is activated. Activation is
// controlled by the activation events defined in package.json.
export function activate(context: ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error).
  // This line of code will only be executed once when your extension is activated.
  console.log(
    'Congratulations, your extension "webpack-progress-log" is now active!'
  );

  // create a new word counter
  let watcher = new ProgressWatcher();
  watcher.initializeWatcher();

  // Add to a list of disposables which are disposed when this extension is deactivated.
  context.subscriptions.push(watcher);
}
