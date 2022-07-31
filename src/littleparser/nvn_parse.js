





function parse(input) {

    let i = 0

    function parse_n() {
        // terminal
        const ret =  input[i] === 's' || input[i] === 'w'

        if (ret) i++
        return ret
    }

    function parse_v() {
        // termnial
        const ret = input[i] === 'e' || input[i] === 'd'
        if (ret) i++
        return ret
    }

    function parse_s() {
        // nonterminal nvn
        return parse_n() && parse_v() && parse_n()
    }

    return parse_s()
}


const str = 'sdw'
console.log(parse(str))