import { cp, mkdir, rm } from 'node:fs/promises'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const sitesMetadata = () => ({
  name: 'sites-metadata',
  apply: 'build',
  async closeBundle() {
    const outputDirectory = resolve('dist', '.openai')
    await rm(outputDirectory, { recursive: true, force: true })
    await mkdir(outputDirectory, { recursive: true })
    await cp(resolve('.openai', 'hosting.json'), resolve(outputDirectory, 'hosting.json'))
  },
})

export default defineConfig(async () => {
  const isSitesBuild = process.env.SITES_BUILD === '1'
  const plugins = [react(), tailwindcss()]

  if (isSitesBuild) {
    const { cloudflare } = await import('@cloudflare/vite-plugin')
    plugins.push(
      sitesMetadata(),
      cloudflare({
        config: {
          name: 'server',
          main: './worker/index.js',
          compatibility_date: '2026-08-12',
          assets: {
            binding: 'ASSETS',
            not_found_handling: 'single-page-application',
          },
        },
      }),
    )
  }

  return {
    base: isSitesBuild ? '/' : '/mothertheresa/dist/',
    plugins,
  }
})
