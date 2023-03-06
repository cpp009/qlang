const { TokenType } = require("./Scanner")


class Expr {

}

class BinaryExpr {
  left
  operator
  right

  constructor(left, operator, right) {
    this.left = left
    this.operator = operator
    this.right = right
  }
}

class LiteralExpr {
  value
  constructor(value) {
    this.value = value
  }
}


class GroupingExpr {
  expr
  constructor(expr) {
    this.expr = expr
  }
}

function Parser(source) {
  let current = 0

  function parse() {
    current = 0
    return expression()
  }

  function expression() {
    return term()
  }

  function term() {
    const expr = factor()
    if (match(TokenType.PLUS, TokenType.MINUS)) {
      const operator = previous()
      const right = factor()
      return new BinaryExpr(expr, operator, right)
    }
    return expr
  }

  function factor() {
    const expr = primary()
    if (match(TokenType.SLASH, TokenType.STAR)) {
      const operator = previous()
      const right = factor()
      return new BinaryExpr(expr, operator, right)
    }
    return expr
  }

  function primary() {
    if (match(TokenType.NUMBER, TokenType.STRING)) {
      return new LiteralExpr(previous().value)
    }

    if (match(TokenType.LEFT_PAREN)) {
      const expr = expression()
      consume(TokenType.RIGT_PAREN, 'Expect a ")"')
      return new GroupingExpr(expr)
    }

    throw new Error('Unexpect token: ' + peek().type)
  }

  function consume(type, reason) {
    if (check(type)) {
      return advance()
    }

    throw new Error(reason)
  }

  function match(...types) {
    for (const type of types) {
      if (check(type)) {
        advance()
        return true;
      }
    }
    return false;
  }
  
  function check(type) {
    return !isAtEnd() && peek().type === type
  }

  function isAtEnd() {
    return source[current].type === TokenType.EOF
  }

  function peek()  {
    if (isAtEnd()) return null
    return source[current]
  }

  function advance() {
    if (isAtEnd()) return null
    return source[current++]
  }
  function previous() {
    return source[current - 1]
  }

  return {
    parse
  }
}

module.exports = {
  Parser
}