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

const tokens = [{type: 'kw', value: 'if'}, {type: 'punc', value: '('}]

const numRege = /[0-9]/
const idRege = /[_a-zA-Z0-9]/
const idStartReg = /[_a-zA-Z]/


function tokenize(input) {

    let i = 0
    let tokens = []
    while(i < input.length) {
        if (numRege.test(input[i])) {
            let num = ''
            while(numRege.test(input[i]) && i < input.length) {
                num+=input[i]
                i++
            }
            tokens.push({
                type: 'num',
                value: num
            })
            i++
        } else if (idStartReg.test(input[i])) {
            let id = ''
            while(idRege.test(input[i]) && i < input.length) {
                id+=input[i]
                i++
            }
            tokens.push({
                type: 'id',
                value: id
            })
            i++
        } else {
            i++
        }
    }
    return tokens
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


const result = tokenize('123asdf')

console.log(result)