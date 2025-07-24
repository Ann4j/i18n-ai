import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/cli.ts'],
  format: ['esm'],
  dts: true,
  splitting: false,
  clean: true,
  removeNodeProtocol: false // для корректной работы node:test и esm
}) 