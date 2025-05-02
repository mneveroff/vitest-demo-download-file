/// <reference types="@vitest/browser/providers/playwright" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import {
  listenForFileDownload,
  finishFileDownload,
  downloadFile,
  triggerAndDownloadFile,
} from "./tests/command-download";
import { coverageConfigDefaults } from "vitest/config";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    css: {
      include: [/.+/],
      modules: {
        classNameStrategy: "non-scoped",
      },
    },
    reporters: [
      "default",
      ["junit", { outputFile: "./tests/__reports__/unit-report.xml" }],
    ],
    coverage: {
      provider: "istanbul",
      exclude: [...coverageConfigDefaults.exclude, "src/main.tsx"],
      reporter: ["text", "html", "cobertura"],
      reportsDirectory: "./tests/__reports__",
    },
    browser: {
      enabled: true,
      viewport: { width: 1280, height: 720 },
      provider: "playwright",
      ui: false,
      instances: [
        { browser: "chromium", context: { colorScheme: "dark" } },
        { browser: "firefox", context: { colorScheme: "dark" } },
        { browser: "webkit", context: { colorScheme: "dark" } },
      ],
      commands: {
        listenForFileDownload,
        finishFileDownload,
        downloadFile,
        triggerAndDownloadFile,
      },
    },
  },
});
