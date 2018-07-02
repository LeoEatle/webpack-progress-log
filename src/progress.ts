import * as vscode from "vscode";
import * as fs from "fs";
import * as os from "os";
import { EventEmitter } from "events";

export class ProgressWatcher extends EventEmitter {
  private timer: NodeJS.Timer;
  private statusBarItem: vscode.StatusBarItem;
  private progress: vscode.Progress<number>;
  private watcher: fs.FSWatcher;
  private initialLabel: string = "webpack not running";
  initializeWatcher() {
    let tempFile = `${os.tmpdir()}/webpack-progress-log`;
    let lastModify = new Date(200, 10, 10); // initial date
    vscode.window.withProgress(
      { location: vscode.ProgressLocation.Window, title: "webpack progress" },
      p => {
        return new Promise((resolve, reject) => {
          p.report({ message: "Start working..." });
          this.on("progressEnd", () => {
            resolve();
          });
          this.on("progressError", () => {
            reject();
          });
        });
      }
    );
    this.watcher = fs.watch(tempFile, eventType => {
      console.log(`event type is: ${eventType}`);
      if (eventType === "error") {
        this.watcher.close();
        this.emit("progressError");
        console.error("Watch temp file error");
      } else if (eventType === "change") {
        let content = fs
          .readFileSync(tempFile)
          .toString()
          .split(",");
        let percentage = parseFloat(content[0]) || 0;
        let msg = content[1] || "";
      }
    });
  }

  updateProgress(percentage: number, msg: string) {
    if (!this.statusBarItem) {
      this.statusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Left
      );
      this.statusBarItem.text = this.initialLabel;
      this.statusBarItem.show();
    }
    let formatPercentage = (percentage * 100).toFixed(2);
    this.statusBarItem.text = `${formatPercentage}% ${msg}`;
    if (percentage == 100) {
      this.resetProgress();
    }
  }

  resetProgress() {
    this.watcher.close();
    this.statusBarItem.text = this.initialLabel;
    this.emit("progressEnd");
  }

  dispose() {
    this.statusBarItem.dispose();
    this.watcher.close();
  }
}
