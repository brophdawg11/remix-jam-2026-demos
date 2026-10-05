import { defineConfig } from 'vite'

const port = Number(process.env.PORT) || 44100

export default defineConfig({
  server: { port, strictPort: true },
  preview: { port, strictPort: true },
})
