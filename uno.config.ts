// uno.config.ts
import { defineConfig } from 'unocss'

export default defineConfig({
    rules: [
        [/^w-(\d+)vw$/, ([, d]: any) => ({ width: `${d}vw` })],
        [/^w-(\d+)\/(\d+)$/, (match: any) => ({ width: `${match[1] / match[2]}%` })],
        [/^h-(\d+)vh$/, ([, d]: any) => ({ height: `${d}vh` })],
        [/^bgc-([#A-E0-9]+)$/, ([, c]: any) => ({ 'background-color': c })],
        [/^top-neg-(\d+)$/, ([, d]: any) => ({ top: `-${d}px` })],
        [/^row-span-(\d+)$/, ([, d]: any) => ({ 'grid-row': `span ${d} / span ${d}` })],
    ],
})
