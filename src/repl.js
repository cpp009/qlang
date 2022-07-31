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



function parse(input) {


    const el2 = {
        type: 'num',
        value: 100
    }

    const el4 = {
        type: 'name',
        name: 'name'
    }

    const el5 = {
        type: 'assign',
        name: 'name',
        value: {
            type: 'num',
            value: 'hello summer, maybe it is y'
        },
    }

    const el3 = {
        type: 'block',
        exprs: [
            el5,
            el4
        ]
    }

    const el1 = {
        type: "lambda",
        params: [

        ],
        body: [
            el5,
            el4
        ]
    }

    const el6 = {
        type: 'apply',
        func: {
            type: 'name',
            name: 'fn1'
        },
        args: [],
    }

    const el9 = {
        type: 'block',
        exprs: [
            {
                type: 'assign',
                name: 'fn1',
                value: el1
            },
            el6
        ]
    }


    const eltest = {
        type: 'apply',
        func: {
            type: 'lambda',
            args: [
                {
                    name: 'a'
                },
                {
                    name: 'b'
                }
            ],
            body: {
                type: 'block',
                exprs: [
                    {
                        type: 'op',
                        op: '+',
                        left: {
                            type: 'name',
                            name: 'a'
                        },
                        right: {
                            type: 'name',
                            name: 'b'
                        }

                    }
                ]
            }
        },
        args: [
            {
                type: 'num',
                value: 1
            },
            {
                type: 'num',
                value: 4
            }
        ]
    }

    return eltest
}

const root_env = make_env(null)

//-------------------- api's api --------------------

function list_of_values(elements = [], env) {
    return elements.map(element => eval(element, env), elements)
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
const result = eval(parse('123'), root_env)
console.log(result)