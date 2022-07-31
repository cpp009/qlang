


function TokenStream(input = new InputStream()) {
    let current = null
    let keywords = ' if the else lambda true false '

    return {
        peek,
        next,
        eof,
        croak: input.croak
    }

    function is_whitespace(ch) {
        return " \t\n".indexOf(ch) >= 0
    }

    function is_comment_start(ch) {
        return ch === '#'
    }

    function read_while(predicate) {
        let str = ''
        while (!input.eof() && predicate(input.peek())) {
            str += input.next()
        }
        return str
    }

    function skip_comment_read() {
        read_while(ch => {
            return ch !== "\n"
        })
        return read_next() // Start read a new token when skip a fregment of comment
    }

    function is_string_start(ch) {
        return ch === '"'
    }

    function read_string() {
        return { type: 'str', value: read_escaped('"') }
    }

    function read_escaped(end) {
        let str = '', escaped = false
        input.next() // skip over quote
        while (!input.eof()) {
            const ch = input.next()
            if (escaped) {
                str += ch
                escaped = false
            } else if (ch === "\\") {
                escaped = true
            } else if (ch === end) {
                break
            } else {
                str += ch
            }
        }
        return str
    }

    function is_digit(ch)  {
        return /[0-9]/.test(ch)
    }

    function read_number() {
        let dot_visited = false
        const num = read_while(ch => {
            if (ch === '.') {
                if (dot_visited) {
                    return false
                } else {
                    dot_visited = true
                    return true
                }
            } 
            return is_digit(ch)
        })

        return {type: 'num', value: parseFloat(num)}
    }

    function is_ident_start(ch) {
        return /[a-z_]/i.test(ch)
    }

    function is_ident(ch) {
        return is_ident_start(ch) || '1234567890!'.indexOf(ch) >= 0
    }

    function is_kw(ch) {
        return keywords.indexOf(' ' + ch + ' ') >= 0
    }

    function read_ident() {

        const ident = read_while(ch => {
            return is_ident(ch)
        })

        return {
            type: is_kw(ident) ? 'kw' : 'var',
            value: ident
        }

    }

    function is_punc(ch) {
        return '[](){},;'.indexOf(ch) >= 0
    }

    function read_punc() {
        return {type: 'punc', value: input.next()}
    }

    function is_op(ch)  {
        return '+-*/<>=%|&!'.indexOf(ch) >= 0
    }

    function read_op() {
        return {type: 'op', value: read_while(is_op)} // >= is one operator
    }

    function read_next() {
        read_while(is_whitespace)
        if (input.eof()) return null
        const ch = input.peek() // Return current pos then move pos to next

        if (is_comment_start(ch)) return skip_comment_read() // Comment
        if (is_string_start(ch)) return read_string() // String
        if (is_digit(ch)) return read_number() // Number
        if (is_ident_start(ch)) return read_ident() // Identifier
        if (is_punc(ch)) return read_punc() // Punctuation
        if (is_op(ch)) return read_op() // Operator

        input.croak("Can't read character " + ch)
    }

    function peek() {
        return current || (current = next())
    }

    function next() {
        let tok = current
        current = null
        return tok || read_next()
    }

    function eof() {
        return peek() === null
    }

}

module.exports = TokenStream