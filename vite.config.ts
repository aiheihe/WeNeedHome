import { defineConfig, loadEnv, ConfigEnv, UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Unocss from 'unocss/vite'
import UnocssIcons from '@unocss/preset-icons'
import { presetAttributify, presetUno } from 'unocss'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import { wrapperEnv } from './build/utils'
import { OUTPUT_DIR } from './build/constant'

function pathResolve(dir: string) {
    return resolve(process.cwd(), '.', dir)
}

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }: ConfigEnv): UserConfig => {
    const root = process.cwd()

    const env = loadEnv(mode, root)

    const viteEnv = wrapperEnv(env)

    const { VITE_PORT, VITE_PUBLIC_PATH, VITE_DROP_CONSOLE } = viteEnv

    const isBuild = command === 'build'

    console.log(isBuild, viteEnv)

    return {
        base: VITE_PUBLIC_PATH,
        root,
        resolve: {
            alias: [
                // /@/xxxx => src/xxxx
                {
                    find: /\/@\//,
                    replacement: pathResolve('src') + '/',
                },
                // /#/xxxx => types/xxxx
                {
                    find: /\/#\//,
                    replacement: pathResolve('types') + '/',
                },
            ],
        },
        server: {
            host: true,
            port: VITE_PORT,
        },
        build: {
            target: 'es2015',
            outDir: OUTPUT_DIR,
            terserOptions: {
                compress: {
                    keep_infinity: true,
                    // Used to delete console in production environment
                    drop_console: VITE_DROP_CONSOLE,
                },
            },
            // Turning off brotliSize display can slightly reduce packaging time
            brotliSize: false,
            chunkSizeWarningLimit: 2000,
        },
        plugins: [
            Icons({
                defaultClass: 'inline',
                defaultStyle: 'vertical-align: sub;',
            }),
            Unocss({
                presets: [
                    UnocssIcons({
                        extraProperties: {
                            display: 'inline-block',
                            height: '1.2em',
                            width: '1.2em',
                            'vertical-align': 'text-bottom',
                        },
                    }),
                    presetAttributify(),
                    presetUno(),
                ],
            }),
            AutoImport({
                resolvers: [ElementPlusResolver()],
            }),
            Components({
                resolvers: [ElementPlusResolver(), IconsResolver({
                    componentPrefix: 'i',
                })],
            }),
            vue(),
        ],
    }
})
