const { parser } = require("./parser_test");
const { char_stream, tokenizer } = require("./repl");



const cs = char_stream('123 + 321 + 1000 + 23')
const t = tokenizer(cs)
const ast = parser(t)
console.log(ast)

