const {Scanner} = require('./treewalk-inter/Scanner')

const code = `123+456`

const scan = Scanner(code)
console.log(scan.scanTokens())