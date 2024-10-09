/**
 * 从文件名生成数字 ID
 * @param {string} fileName - 文件名
 * @returns {number} - 生成的数字ID
 */
export const generateId = (fileName) => {
    // 将文件名转换为哈希值
    let hash = 0;
    for (let i = 0; i < fileName.length; i++) {
        hash = (hash << 5) - hash + fileName.charCodeAt(i)
    }
    // 将哈希值转换为正整数
    const numericId = Math.abs(hash % 10000000000)
    return numericId
}