const { TokenType } = require("./Scanner")



class Env {
  values = new Map()

  get(key) {
    if (this.values.has(key)) {
      return this.values.get(key)
    }

    throw new Error('Undefined variable: "' + key + '".')
  }

  set(key, value) {
    this.values.set(key, value)
  }
}

class Interpreter {
  env = new Env()

  constructor(env) {
    if (env) {
      this.env = env
    }
  }

  interpret(stmts) {
    for (const stmt of stmts) {
      this.execute(stmt)
    }
  }

  execute(stmt) {
    stmt.accept(this)
  }

  visitLiteralExpr(expr) {
    return expr.value
  }

  visitGroupingExpr(expr) {
    return this.evaluate(expr.expression)
  }

  visitBinaryExpr(expr) {
    const left = this.evaluate(expr.left)
    const right = this.evaluate(expr.right)

    switch (expr.operator.type) {
      case TokenType.PLUS:
        if (typeof left === 'number' && typeof right === 'number') {
          return parseFloat(left) + parseFloat(right)
        }

        if (typeof left === 'string' && typeof right === 'string') {
          return String(left) + String(right)
        }
      case TokenType.MINUS:
        return parseFloat(left) - parseFloat(right)
      case TokenType.SLASH:
        return parseFloat(left) / parseFloat(right)
      case TokenType.STAR:
        return parseFloat(left) * parseFloat(right)
    }

    // Unreachable
    return null
  }

  visitAssignExpr(expr) {
    const name = expr.name
    const value = this.evaluate(expr.value)

    this.env.set(name.lexeme, value)
  }


  visitExpressionStmt(stmt) {
    this.evaluate(stmt.expression)
    return null;
  }

  visitPrintStmt(stmt) {
    const value = this.evaluate(stmt.value)
    console.log(">>> " + value)
    return null
  }

  visitVar(stmt) {
    const name = stmt.name
    let value = null
    if (stmt.initializer !== null) {
      value = this.evaluate(stmt.initializer)
    }
    this.env.set(name.lexeme, value)
  }

  visitVariable(stmt) {
    const name = stmt.name
    return this.env.get(name.lexeme)
  }

  evaluate(expr) {
    return expr.accept(this)
  }
}

module.exports = {
  Interpreter,
  Env
}