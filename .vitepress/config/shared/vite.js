import chokidar from 'chokidar'
import path from "path"
import { addMd, changeMd, delMd } from '../scripts/handleMd'

export const viteConfig = {
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "../../theme"),
            "@casual": path.resolve(__dirname, "../../../casual")
        },
    },
    server: {
        port: 2512,
    },
    plugins: [{
        name: 'md-file-watcher',
        configureServer(server) {
            const watcher = chokidar.watch(path.join(process.cwd(), 'posts'))
            watcher.on('add', (e) => { addMd(e); server.ws.send({ type: 'full-reload' }) })
                .on('change', (e) => { changeMd(e) })
                .on('unlink', (e) => { delMd(e) })
        }
    }],
    build: {
        minify: "terser",
        terserOptions: {
            compress: {
                pure_funcs: ["console.log"],
            },
        },
    },
}