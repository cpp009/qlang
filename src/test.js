const { Parser } = require('./treewalk-inter/Parser')
const { Scanner } = require('./treewalk-inter/Scanner')
const { Interpreter, Env } = require('./treewalk-inter/Interpreter')

const code = `(123+456)*10`

function test1(code) {
  const scan = Scanner(code)
  const tokens = scan.scanTokens()

  // console.log(tokens)
  const parser = Parser(tokens)
  const ast = parser.parse()
  // console.log(ast)

  const interpreter = new Interpreter()
  const ret = interpreter.interpret(ast)
  // console.log(ret)
}

const code1 = `var foo = 123;
var bar = 321;
bar = 123;
print foo + bar;`
test1(code1)