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

class BlockStmt {
  statements = []

  constructor(statements) {
    this.statements = statements
  }

  accept(visitor) {
    return visitor.visitBlockStmt(this);
  }
}

class IfStmt {
  condition
  thenBranch
  elseBranch

  constructor(condition, thenBranch, elseBranch) {
    this.condition = condition
    this.thenBranch = thenBranch
    this.elseBranch = elseBranch
  }

  accept(visitor) {
    visitor.visitIfStmt(this)
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
    if (match(TokenType.IF)) return ifStatement()
    if (match(TokenType.PRINT)) return printStatement()
    if (match(TokenType.LEFT_BRACE)) {
      const b = block()
      consume(TokenType.RIGT_BRACE, 'Expect a "}" after block')
      return new BlockStmt(b)
    }

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

  function ifStatement() {
      consume(TokenType.LEFT_PAREN, 'Expect a "(" after if')
      const condition = expression()
      consume(TokenType.RIGT_PAREN, 'Expect a ")" after if condition')
      const thenBranch = statement()
      let elseBranch = null
      if (match(TokenType.ELSE)) {
        elseBranch = statement()
      }

      return new IfStmt(condition, thenBranch, elseBranch)
  }

  function expression() {
    return assignment()
  }

  function assignment() {
    const expr = term()
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

  function block() {
    const stmts = []
    while (!isAtEnd() && !check(TokenType.RIGT_BRACE)) {
      stmts.push(declaration())
    }
    return stmts
  }

  function consume(type, reason) {
    if (check(type)) {
      return advance()
    }

    throw new Error(reason + ' but "' + peek().type + '", at line: '+ peek().line)
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
