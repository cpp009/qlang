const InputStream = require("./InputStream")
const TokenStream = require("./TokenStream")



console.log('calParser')



function parse(input) {

    parse_top()

    function parse_top() {

    }
}



const codeTxt = `
    sum = lambda(a, b) {
        a + b
    }
`
const formularTxt = `3 + 5 * 2`

const is = InputStream(formularTxt)
const ts = TokenStream(is)

// while(!ts.eof()) {
//     console.log(ts.next())
// }

const ast = parse_formular(ts)
console.log(ast)

function parse_formular(input) {

    parse_expr()
    function is_punc(tk, ch) {
        return tk && tk.type === 'punc' && tk.value === ch
    }
    function skip_punc(ch) {
        const tk = input.peek()
        if (is_punc(ch)) {
            input.next()
        } else {
            error('punc error: ' + ch)
        }
    }
    function is_num(tk) {
        return tk && tk.type === 'num'
    }
    function parse_factor() {
        const tk = input.peek()
        if (is_punc(tk, '(')) {
            skip_punc('(')
            const ret = parse_exp()
            skip_punc(')')
            return ret
        } else if(is_num(tk)) {
            input.next()
            return tk
        } else {
            error('factor type error: ' + tk)
        }
    }

    // expr -> term expr'
    function parse_expr() {
        if(parse_term()) {
            return parse_eprime()
        } else {
            error('eprim error')
        }
    }


    // expr' -> + term expr'
    //          | - term expr'
    function parse_eprime() {

        const tk = input.peek()
        if (tk.value === '+' || tk.value === '-') {
            input.next()
            if (parse_term()) {
                return parse_eprime()
            }
        }
    }

    // term -> factor term'
    function parse_term() {
        if (parse_factor()) {
            return parse_tprime()
        } else {
            error('term error')
        }
    }

    function parse_tprime() {
        const tk = input.peek()
        if (tk.value=== '/' || tk.value === '*') {

        } else {
            error()
        }
    }

    function error(txt) {
        input.croak(txt)
    }

}