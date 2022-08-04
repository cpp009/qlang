const env = {
    '+': function (args) {
        let result = 0
        for (item of args) {
            result += item.val
        }
    }
}

const make_env = (parent_env = null) => {
    return {
        parent: parent_env,
        kv: {}
    }
}

const get_env = (env, name) => {
    let cur = env
    while (cur !== null) {
        const value = cur.kv[name]
        if (value) {
            return value
        }
        cur = cur.parent
    }

    throw new Error('undefined variable: ' + name)
}


const put_env = (env, name, value) => {
    env.kv[name] = value
}


//-------------------- tokenize --------------------

const tokens = [{ type: 'kw', value: 'if' }, { type: 'punc', value: '(' }]

const numRege = /[0-9]/
const idRege = /[_a-zA-Z0-9]/
const idStartReg = /[_a-zA-Z]/


function char_stream(input = '') {
    let i = 0
    let line = 1, row = 1

    function next() {
        const ch = peek()
        if (eof()) {
            return ch
        }
        if (ch === "\n") {
            line++
        }
        row++
        i++
        return ch
    }

    function peek() {
        return input.charAt(i)
    }

    function eof() {
        return peek() === ''
    }

    function error() {

    }
    return {
        next,
        peek,
        eof,
        error
    }

}


function tokenizer(cs = char_stream('')) {
    let cur

    function is_space(ch) {
        return /\s/.test(ch)
    }

    function is_num(ch) {
        return /[0-9]/.test(ch)
    }

    function is_id_start(ch) {
        return /[_a-zA-Z]/.test(ch)
    }

    function is_id(ch) {
        return /[_a-zA-Z0-9]/.test(ch)
    }

    function is_op(ch) {
        return '+'.includes(ch)
    }

    function read_while(predic) {
        let str = ''
        while (!cs.eof() && predic(cs.peek())) {
            str += cs.next()
        }
        return str
    }


    function next() {
        if (eof()) {
            return cur
        }
        read_while(is_space)
        const ch = cs.peek()

        let token
        if (is_num(ch)) {
            const value = read_while(is_num)
            token =  {
                type: 'num',
                value
            }
        } else if (is_id_start(ch)) {
            token =  {
                type: 'id',
                value: read_while(is_id)
            }
        } else if(is_op) {
            value = read_while(is_op)
            token = {
                type: 'op',
                value
            }
        }

        cur = token
        return token;
    }

    function peek() {
        return cur ? cur : next()
    }


    function error() {

    }

    function eof() {
        return cs.eof()
    }

    return {
        peek,
        next,
        eof,
        error
    }
}

//-------------------- parser --------------------


function parse(input) {




}

const root_env = make_env(null)

//-------------------- api's api --------------------

function list_of_values(elements = [], env) {
    return elements.map(element => eval(element, env), elements)
}

function eval_assignment(element, env) {
    const value = eval(element.right)
    assign(element.right, value, env)

    // 返回右边的值
    return value
}


//-------------------- api --------------------
/**
 * 执行 lambda
 * 
 * @param {*} func lambda
 * @param {*} args 参数的值
 * @returns 
 */
function apply(func, args) {
    const newEnv = make_env(func.env)
    for (let i = 0; i < args.length; i++) {
        if (func.args[i]) {
            put_env(newEnv, func.args[i].name, args[i])
        }
    }
    return eval(func.body, newEnv)
}


function eval(element, env) {
    switch (element.type) {
        case 'num':
            return element.value;
        case 'name':
            return get_env(env, element.name);
        case 'apply':
            return apply(eval(element.func, env), list_of_values(element.args, env))
        case 'cond':
            return eval(element.pre, env) === true ? eval(element.ifCond, env) : eval(element.thenCond, env)
        case 'op':
            return eval(element.left, env) + eval(element.right, env)
        case 'assign':
            return put_env(env, element.name, eval(element.value, env))
        case 'block':
            const blockEnv = make_env(env)
            let value
            for (let i = 0; i < element.exprs.length; i++) {
                value = eval(element.exprs[i], blockEnv)
            }
            return value;
        case 'lambda':
            return make_lambda(element, env);
        default:
            throw new Error('unknown element type: ' + element.type)
    }
}

function make_lambda(element, parent_env) {
    const env = make_env(parent_env)
    return {
        ...element,
        env
    }
}



module.exports = {
    tokenizer,
    char_stream,
}