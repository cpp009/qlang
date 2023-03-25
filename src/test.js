const { Parser } = require('./treewalk-inter/Parser')
const { Scanner } = require('./treewalk-inter/Scanner')
const { Interpreter, Env } = require('./treewalk-inter/Interpreter')

const code = `(123+456)*10`

function test1(code) {
  const scan = Scanner(code)
  const tokens = scan.scanTokens()

  const parser = Parser(tokens)
  const ast = parser.parse()
  console.log(ast)
  return 
  const interpreter = new Interpreter()
  const ret = interpreter.interpret(ast)
  console.log(ret)
}

const code1 = `
var foo = true;
if (foo) {
  print 123;
} else {
  print 321;
}
`
test1(code1)