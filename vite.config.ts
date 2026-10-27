import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// يُبنى التطبيق كملف HTML واحد لسهولة مشاركته كعرض تجريبي
export default defineConfig({
  plugins: [react(), viteSingleFile()],
})
