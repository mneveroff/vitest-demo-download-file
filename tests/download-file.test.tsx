import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { userEvent, commands, server } from "@vitest/browser/context";
import { screen, render, cleanup } from "@testing-library/react";
import App from "../src/App";
import React from "react";

const TIMEOUT = 5_000;
const { readFile, removeFile } = server.commands;

describe("Download file", () => {
  beforeEach(async () => {
    render(<App />);
  });

  afterEach(async () => {
    cleanup();
  });

  /** Attempting to retrieve the download promise from listenForFileDownload
   * and passing it to finishFileDownload, but it's not working.
   * Likely due to serialisation / hand-off issues between the test runner and the browser.
   */
  it.fails(
    "🔴 will not be able to pass Download promise to finishFileDownload",
    { timeout: TIMEOUT },
    async () => {
      const downloadPromise = commands.listenForFileDownload();

      const downloadButton = screen.getByText("Download immediately");
      expect(downloadButton).toBeVisible();
      await userEvent.click(downloadButton);

      const targetPath = await commands.finishFileDownload(downloadPromise);
      expect(targetPath).toBeDefined();
      expect(targetPath.length).toBeGreaterThan(0);

      const fileContent = await readFile(targetPath);
      expect(fileContent).toBeDefined();
      expect(fileContent.length).toBeGreaterThan(0);
    }
  );

  /** Approach allowing to keep user interactions within vitest
   * however requires to rely on timeout / longer export times for
   * download event listener to be set before it's initiated.
   */
  it(
    "🟢 should download a file with timeout",
    { timeout: TIMEOUT },
    async () => {
      const downloadButton = screen.getByText("Download with timeout");
      expect(downloadButton).toBeVisible();
      await userEvent.click(downloadButton);

      const targetPath = await commands.downloadFile();
      expect(targetPath).toBeDefined();
      expect(targetPath.length).toBeGreaterThan(0);

      const fileContent = await readFile(targetPath);
      expect(fileContent).toBeDefined();
      expect(fileContent.length).toBeGreaterThan(0);
      await removeFile(targetPath);
    }
  );

  /** Approach that allow for a non-timeout assertion
   * but requires handing off the element trigger to be
   * handed off to playwright command.
   */
  it(
    "🟢 should download a file without a timeout",
    { timeout: TIMEOUT },
    async () => {
      const targetPath = await commands.triggerAndDownloadFile(
        "Download immediately"
      );
      expect(targetPath).toBeDefined();
      expect(targetPath.length).toBeGreaterThan(0);

      const fileContent = await readFile(targetPath);
      expect(fileContent).toBeDefined();
      expect(fileContent.length).toBeGreaterThan(0);
      await removeFile(targetPath);
    }
  );
});
