import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { listenForFileDownload, finishFileDownload, downloadFile, triggerAndDownloadFile } from './tests/command-download';
import { coverageConfigDefaults } from 'vitest/config';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    reporters: [
      'default',
      ['junit', { outputFile: './tests/__reports__/unit-report.xml' }],
    ],
    coverage: {
      provider: 'istanbul',
      exclude: [
        ...coverageConfigDefaults.exclude,
      ],
      reporter: [
        'text',
        'html',
        'clover',
        'json',
        'cobertura',
        ['lcov', { projectRoot: './src' }],
      ],
      reportsDirectory: './tests/__reports__',
    },
    browser: {
      enabled: true,
      provider: 'playwright',
      ui: false,
      instances: [
        { browser: 'chromium' },
        { browser: 'firefox' },
        { browser: 'webkit' },
      ],
      commands: {
        listenForFileDownload,
        finishFileDownload,
        downloadFile,
        triggerAndDownloadFile
      }
    },
  }
})
