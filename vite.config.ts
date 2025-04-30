import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { listenForFileDownload, finishFileDownload, downloadFile, triggerAndDownloadFile } from './tests/command-download';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
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
