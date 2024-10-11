import chokidar from 'chokidar'
import path from "path"
import { addMd, changeMd, delMd } from '../scripts/handleMd'

const updateCache = (server) => {
    server.ws.send({
        type: 'prune', paths: ['../../cache/casual/*']
    })
}
export const viteConfig = {
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "../../theme"),
            "@casual": path.resolve(__dirname, "../../cache/casual")
        },
    },
    server: {
        port: 2512,
    },
    plugins: [{
        name: 'md-file-watcher',
        configureServer(server) {
            const watcher = chokidar.watch(path.join(process.cwd(), 'posts'))
            watcher.on('add', (e) => { addMd(e); updateCache(server) })
                .on('change', (e) => { changeMd(e); updateCache(server) })
                .on('unlink', (e) => { delMd(e); updateCache(server) })
        }
    }],

}