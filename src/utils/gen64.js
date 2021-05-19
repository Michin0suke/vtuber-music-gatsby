const gen64 = () => {
  let chars = ''
  chars += '0123456789'
  chars += 'abcdefghijklmnopqrstuvwxyz'
  chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  chars += '-_'

  const range64 = {
    min: 4398046511104,
    max: 281474976710655
  }

  const encode = (num) => {
    const cn = chars.length
    const str = []
    let a1, a2
    while (num !== 0) {
      a1 = parseInt(num / cn)
      a2 = num - (a1 * cn)
      str.unshift(chars.substr(a2, 1))
      num = a1
    }
    let res = str.join('')
    res = (!res) ? '0' : res
    return res
  }

  // const decode = (num) => {
  //     let char2 = {};
  //     let cn = chars.length;
  //     for (let i=0; i< cn; i++) {
  //         char2[chars[i]] = i;
  //     }
  //     let str = 0;
  //     for (let i=0; i<num.toString().length; i++) {
  //         str += char2[num.substr((i+1)*-1, 1)] * Math.pow(cn, i);
  //     }
  //     return str;
  // }

  const randomInt = Math.random() * (range64.max - range64.min) + range64.min
  return encode(randomInt)
}

module.exports = gen64
