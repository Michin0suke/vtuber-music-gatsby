const validateChannelUrl = (rawUrl) => {
    const url = encodeURI(rawUrl)

    const pattern_normal = /^https:\/\/www.youtube.com\/channel\/([\w-]+)/
    if (url.match(pattern_normal)) {
        if (url.match(pattern_normal)[1].length !== 24) return false
        return url.match(pattern_normal)[1]
    }

    const pattern_old = /^https:\/\/www.youtube.com\/user\/([\w-%]+)/
    if (url.match(pattern_old)) return url.match(pattern_old)[1]

    const pattern_new = /^https:\/\/www.youtube.com\/(c\/)?([\w-%]+)/
    if (url.match(pattern_new)) {
        console.log(JSON.stringify(url.match(pattern_new), null, 2))
        if (url.match(pattern_new)[2] === 'watch') return false
        return url.match(pattern_new)[2]
    }

    return false
}

const validateVideoUrl = (url) => {
    if (url.match(/^https:\/\/www.youtube.com\/watch\?v=([\w-]{11})(&.*)?$/)) {
        return url.match(/^https:\/\/www.youtube.com\/watch\?v=([\w-]{11})(&.*)?$/)[1]
    }
    if (url.match(/^https:\/\/youtu.be\/([\w-]{11})$/)) {
        return url.match(/^https:\/\/youtu.be\/([\w-]{11})$/)[1]
    }
    return false
}

module.exports = {
    validateChannelUrl,
    validateVideoUrl,
}

const arr = [
    'https://www.youtube.com/channel/UC5CwaMl1eIgY8h02uZw7u8A',
    'https://www.youtube.com/c/hiroyukix',
    'https://www.youtube.com/hiroyukix',
    'https://www.youtube.com/user/KIYOisGOD',
    'https://www.youtube.com/c/%E5%A4%A9%E4%BD%BF%E3%82%BB%E3%82%A6',
    'https://www.youtube.com/c/あいうえお'

].map((url) => validateChannelUrl(url)).join('\n')

console.log('')

console.log(arr)