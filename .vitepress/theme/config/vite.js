import chokidar from 'chokidar'
import path from "path"
import { addMd, changeMd, delMd } from '../scripts/index'


export const viteConfig = {
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./theme"),
        },
    },
    server: {
        port: 9877,
    },
    plugins: [{
        name: 'md-file-watcher',
        configureServer(server) {
            const watcher = chokidar.watch(path.join(process.cwd(), 'posts'))
            watcher.on('add', (e) => { addMd(e) })
                .on('change', (e) => { changeMd(e) })
                .on('unlink', (e) => { delMd(e) })
        }
    }],

}