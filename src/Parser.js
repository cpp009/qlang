const InputStream = require("./InputStream")
const TokenStream = require("./TokenStream")



const FALSE = {
    type: 'bool',
    value: false
}

const PRECEDENCE = {
    '=': 1,
    '||': 2,
    '&&': 3,
    '<': 7, '>': 7, '<=': 7, '>=': 7, '==': 7, '!=': 7,
    '+': 10, '-': 10,
    '*': 20, '/': 20, '%': 20
}

function parse(input) {


    parse_toplevel()


    function is_punc(ch) {
        const tok = input.peek()
        // tok 必须存在，ch 不存在 type 正确就行，ch 存在必须 value 也相等，最后返回 tok
        return tok && tok.type === 'punc' && (!ch || tok.value === ch) && tok
    }

    function is_op(ch) {
        const tok = input.peek()
        return tok && tok.type === 'op' && (!ch || ch.value === ch) && tok
    }
    function skip_punc(ch) {
        if (is_punc(ch)) input.next()
        else error()
    }

    function error(msg) {
        input.croak(msg || 'error')
    }

    function maybe_binary(left, my_prec) {
        const tok = is_op()
        if (tok) {

            const his_prec = PRECEDENCE[tok.value]
            if (his_prec > my_prec) {
                input.next()
                return maybe_binary({
                    type: tok.value === '=' ? 'assign' : 'binary',
                    left,
                    right: maybe_binary(parse_atom(), his_prec)
                }, my_prec)
            }

        }

        return left
    }

    function parse_expression() {
        maybe_call(function () {
            maybe_binary(parse_atom(), 0)
        })
    }

    function maybe_call(expr) {
        expr = expr()
        return is_punc('(') ? parse_call() : expr
    }


    function parse_toplevel() {
        const prog = []

        while (!input.eof()) {
            prog.push(parse_expression())
            if (!input.eof()) skip_punc(';')
        }

        return { type: 'prog', prog }
    }

}



/*

sum = lambda(a, b) {
    a + b
}

sum(1, 2)
*/

console.log('hello, cpp')


const textCode = `
    sum = lambda(a, b) {
        a + b;
    };
    sum(1, 2);
`

const is = InputStream(textCode)
const ts = TokenStream(is)
const ast = parse(ts)
console.log(ast)


// while(!ts.eof()) {
//     console.log(ts.next())
// }





