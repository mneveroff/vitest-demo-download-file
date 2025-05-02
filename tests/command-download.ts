import fs from "node:fs";
import path from "node:path";
import { BrowserCommand } from "vitest/node";
import type { Download } from "playwright-core"; // Import the Download type

export const listenForFileDownload: BrowserCommand<[]> = async (
  ctx
): Promise<Download> => {
  const page = ctx.page;

  const downloadPromise = page.waitForEvent("download");

  return downloadPromise;
};

export const finishFileDownload: BrowserCommand<[Promise<Download>]> = async (
  _,
  downloadPromise
): Promise<string> => {
  const download = await downloadPromise;
  const filename = download.suggestedFilename();

  // Target directory needs to be within the project root due to server:fs security restrictions, see https://vitest.dev/guide/browser/commands.html
  const targetDirectory = path.resolve(process.cwd(), "./tests/__downloads__/");
  fs.mkdirSync(targetDirectory, { recursive: true });

  const targetPath = path.join(targetDirectory, filename);

  await download.saveAs(targetPath);

  return targetPath;
};

export const downloadFile: BrowserCommand<[]> = async (
  ctx
): Promise<string> => {
  const downloadPromise = listenForFileDownload(ctx);
  return finishFileDownload(ctx, downloadPromise);
};

export const triggerAndDownloadFile: BrowserCommand<[string]> = async (
  ctx,
  elementText
): Promise<string> => {
  const downloadPromise = listenForFileDownload(ctx);

  const element = ctx.iframe.getByText(elementText);
  await element.click();

  return finishFileDownload(ctx, downloadPromise);
};
