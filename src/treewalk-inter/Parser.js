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

  accept(visitor) {
    return visitor.visitBinaryExpr(this)
  }

}

class LiteralExpr {
  value
  constructor(value) {
    this.value = value
  }

  accept(visitor) {
    return visitor.visitLiteralExpr(this)
  }
}

class Stmt {

}


class PrintStmt {
  value

  constructor(value) {
    this.value = value
  }

  accept(visitor) {
    return visitor.visitPrintStmt(this)
  }
}


class ExpressionStmt {
  expression

  constructor(expression) {
    this.expression = expression
  }

  accept(visitor) {
    return visitor.visitExpressionStmt(this)
  }
}

class GroupingExpr {
  expression
  constructor(expression) {
    this.expression = expression
  }

  accept(visitor) {
    return visitor.visitGroupingExpr(this)
  }
}

class AssignExpr {
  name
  value

  constructor(name, value) {
    this.name = name
    this.value = value
  }

  accept(visitor) {
    visitor.visitAssignExpr(this)
  }
}


class Var {
  name
  initializer

  constructor(name, initializer) {
    this.name = name
    this.initializer = initializer
  }

  accept(visitor) {
    visitor.visitVar(this)
  }
}

class Variable {
  name

  constructor(name) {
    this.name = name
  }

  accept(visitor) {
    return visitor.visitVariable(this)
  }
}

function Parser(source) {
  let current = 0

  function parse() {
    const stmts = []
    current = 0

    while (!isAtEnd()) {
      stmts.push(declaration())
    }
    return stmts;
  }

  function declaration() {
    if (match(TokenType.VAR)) return varDecl()
    return statement()
  }

  function varDecl() {
    const name = consume(TokenType.IDENTIFIER, 'Expect a identifier after "var"')

    let initializer = null
    if (match(TokenType.EQUAL)) {
      initializer = expression()
    }
    consume(TokenType.SEMICOLON, 'Expect a ";" after declation')
    return new Var(name, initializer)
  }

  function statement() {
    if (match(TokenType.PRINT)) return printStatement()
    return expressionStatement()
  }

  function printStatement() {
    const value = expression()
    consume(TokenType.SEMICOLON, 'Expect ";" after value.')
    return new PrintStmt(value)
  }

  function expressionStatement() {
    const epxr = expression()
    consume(TokenType.SEMICOLON, 'Expect ";" after expression.')
    return new ExpressionStmt(epxr)
  }

  function expression() {
    return assignment()
  }

  function assignment() {
    const expr = term()
    console.log(expr)
    if (match(TokenType.EQUAL)) {
      const equals = previous()
      const value = assignment()

      if (expr instanceof Variable) {
        const nameToken = expr.name
        return new AssignExpr(nameToken, value)
      }

      throw new Error('Invalid assignment target')
    }
    return expr
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

    if (match(TokenType.IDENTIFIER)) {
      return new Variable(previous())
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

  function peek() {
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
