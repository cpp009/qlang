const { Parser } = require('./treewalk-inter/Parser')
const {Scanner} = require('./treewalk-inter/Scanner')

const code = `(123+456)*10`

const scan = Scanner(code)
const tokens = scan.scanTokens()
console.log()
const parser = Parser(tokens)
const ast = parser.parse()
console.log(ast)