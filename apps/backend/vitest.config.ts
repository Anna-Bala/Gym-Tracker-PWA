import { defineProject } from "vitest/config";

export default defineProject({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    setupFiles: ["./tests/globalSetup.ts"],
    alias: {
      "@": "/src",
    },
  },
});
