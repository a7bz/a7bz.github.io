/**
 * Meting
 * @param {id} string - 歌曲ID
 * @param {server} string - 服务器
 * @param {type} string - 类型
 * @returns {Promise<Object>} - 音乐详情
 */
export const getMetingMusicList = async (url, id, server = "netease", type = "playlist") => {
    const result = await fetch(`${url}?server=${server}&type=${type}&id=${id}`)
    const list = await result.json()
    return list.map((song) => {
        const { pic, ...data } = song
        return { ...data, cover: pic, }
    })
}

/**
 * 获取音乐列表
 */
export const getMusicList = async () => {
    const result = await fetch(`https://www.zwymw.top/api/music.json`)
    const list = await result.json()
    return list.map((song) => {
        const { pic, ...data } = song
        return { cover: pic, ...data, }
    })
}