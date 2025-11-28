import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig({
    plugins: [
        svelte(),
        viteStaticCopy({
            targets: [
                {
                    src: 'node_modules/@crestron/ch5-crcomlib/build_bundles/umd/cr-com-lib.js',
                    dest: ''
                }
            ]
        }),
        viteSingleFile(),
    ],
})
