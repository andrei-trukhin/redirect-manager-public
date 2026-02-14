import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        globals: true,        // use global APIs like describe/test/expect
        environment: 'node',  // Node testing environment
        include: ['src/**/*.test.{ts,js}'], // pattern for test files
    }
})
