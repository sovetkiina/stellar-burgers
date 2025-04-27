import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      browser: '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser'; // Путь к браузеру Brave на macOS
    }
  }
});
