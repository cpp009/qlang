
function InputStream (input = '') {
    let pos = 0, line = 1, col = 0


    return {
        peek,
        next,
        eof,
        croak
    }

    function peek() {
        return input.charAt(pos)
    }

    function next() {
        let ch = input.charAt(pos++)
        if (ch === "\n") {
            line++
            col = 0
        }
        return ch
    }

    function eof() {
        return peek() === ""
    }

    function croak(msg) {
        throw new Error(msg + ' (' + line + ':' + col + ')')
    }

}

module.exports =  InputStream