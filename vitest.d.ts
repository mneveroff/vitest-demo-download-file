import { Download } from "playwright-core";

declare module '@vitest/browser/context' {
  interface BrowserCommands {
    listenForFileDownload: () => Promise<Download>;
    finishFileDownload: (downloadPromise: Promise<Download>) => Promise<string>;
    downloadFile: () => Promise<string>;
    triggerAndDownloadFile: (elementText: string) => Promise<string>;
  }
}
