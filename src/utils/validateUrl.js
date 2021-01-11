export const validateChannelUrl = (url) => {
    const pattern_normal = /^https:\/\/www.youtube.com\/channel\/([\w-]+)/
    if (url.match(pattern_normal)) {
        if (url.match(pattern_normal)[1].length !== 24) return false
        return url.match(pattern_normal)[1]
    }

    const pattern_old = /^https:\/\/www.youtube.com\/user\/([\w-]+)/
    if (url.match(pattern_old)) return url.match(pattern_old)[1]

    const pattern_new = /^https:\/\/www.youtube.com\/(c\/)?([\w-]+)/
    if (url.match(pattern_new)) {
        if (url.match(pattern_new)[2] === 'watch') return false
        return url.match(pattern_new)[2]
    }

    return false
}

export const validateVideoUrl = (url) => {
    if (url.match(/^https:\/\/www.youtube.com\/watch\?v=([\w-]{11})(&.*)?$/)) {
        return url.match(/^https:\/\/www.youtube.com\/watch\?v=([\w-]{11})(&.*)?$/)[1]
    }
    if (url.match(/^https:\/\/youtu.be\/([\w-]{11})$/)) {
        return url.match(/^https:\/\/youtu.be\/([\w-]{11})$/)[1]
    }
    return false
}

// const arr = [
//     'https://www.youtube.com/channel/UC5CwaMl1eIgY8h02uZw7u8A',
//     'https://www.youtube.com/c/hiroyukix',
//     'https://www.youtube.com/hiroyukix',
//     'https://www.youtube.com/user/KIYOisGOD',

// ].map((url) => validateChannelUrl(url)).join('\n')

// console.log(arr)