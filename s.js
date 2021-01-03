const print = async (str) => {
    new Promise(resolve => {
        setTimeout(() => {
            console.log(str)
            resolve()
        }, Math.random() * 1000)
    })
}
// ['a', 'b', 'c'].reduce



const asyncFunc = async () => {
    await Promise.all(['a', 'b', 'c'].map(async str => await print(str)))
}

asyncFunc()