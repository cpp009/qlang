






/**
 * (a + 3) / 2
 */
const tokens = [
  {
    type: 'punc',
    value: '(',
  },
  {
    type: 'id',
    value: 'name'
  },
  {
    type: 'op',
    value: '+'
  },
  {
    type: 'num',
    value: '3'
  },
  {
    type: 'punc',
    value: ')'
  },
  {
    type: 'op',
    value: '/'
  },
  {
    type: 'num',
    value: 2
  }
]

function parser(t) {



  function numeric_literal() {
    const token = t.peek()
    if (token.type === 'num') {
      t.next()
      return token
    }
  }

  function operator() {
    const token = t.peek()
    if(token.type === 'op') {
      t.next()
      return token
    }
  }

  function binary_expression() {
    const left = numeric_literal()
    if (!left) return null

    return e_prim(left)
  }


  function e_prim(left) {
    const op = operator()
    if(!op) return left;
    const right = numeric_literal()
    if (!right) return null

    const node =  {
      type: 'binary_exp',
      left,
      right,
      op
    }

    return e_prim(node)
  }

  const p = binary_expression()
  if (!p) {
    throw new Error('invalid program')
  }

  return p
}

module.exports = {
  parser
}
