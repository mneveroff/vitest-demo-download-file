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

  /** Getting test coverage for the error handling */
  it(
    "🟢 should display an error message when download fails",
    { timeout: TIMEOUT },
    async () => {
      const errorButton = screen.getByText("Trigger download error");
      expect(errorButton).toBeVisible();
      await userEvent.click(errorButton);

      // Assert that the error message is displayed
      const errorMessage = await screen.findByText(
        /Error: Simulated download generation failure/
      );
      expect(errorMessage).toBeVisible();

      // Assert that the downloading message is not present
      const downloadingMessage = screen.queryByText("Downloading...");
      expect(downloadingMessage).toBeNull();

      // We don't expect a download to happen, so we don't call downloadFile or listenForFileDownload
    }
  );

  /** Getting test coverage for the error handling */
  it(
    "🟢 should display a generic error message when download fails with non-Error",
    { timeout: TIMEOUT },
    async () => {
      const nonErrorButton = screen.getByText(
        "Trigger non-Error download error"
      );
      expect(nonErrorButton).toBeVisible();
      await userEvent.click(nonErrorButton);

      // Assert that the generic error message is displayed
      const errorMessage = await screen.findByText(
        /Error: An unknown error occurred/
      );
      expect(errorMessage).toBeVisible();

      // Assert that the downloading message is not present
      const downloadingMessage = screen.queryByText("Downloading...");
      expect(downloadingMessage).toBeNull();
    }
  );
});
