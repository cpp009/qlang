


// S -> N V N
// N -> s | t | g | w
// V -> e | d
function parse(input) {
    let i = 0

    parse_s()

    function parse_s() {
        parse_n()
        parse_v()
        parse_n()
    }

    function parse_n() {
        const t = input[i++]
        if ('stgw'.includes(t)) {
            return;
        } else {
            throw new Error('error N: ' + t)
        }
    }

    function parse_v() {
        const t = input[i++]
        if ('ed'.includes(t)) {
            return ;
        } else {
            throw new Error('error V: ' + t)
        }
    }
}


parse('gdw')