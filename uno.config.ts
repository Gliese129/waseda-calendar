// uno.config.ts
import { defineConfig } from 'unocss'

export default defineConfig({
    rules: [
        [/^w-(\d+)vw$/, ([, d]: any) => ({ width: `${d}vw` })],
        [/^w-(\d+)\/(\d+)$/, (match: any) => ({ width: `${match[1] / match[2]}%` })],
        [/^h-(\d+)vh$/, ([, d]: any) => ({ height: `${d}vh` })],
        [/^bgc-([#A-E0-9]+)$/, ([, c]: any) => ({ 'background-color': c })],
    ],
})
