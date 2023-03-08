const { TokenType } = require("./Scanner")



class Interpreter {

  interpret(expr) {
    return expr.accept(this)
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

  evaluate(expr) {
    return expr.accept(this)
  }
}

module.exports = {
  Interpreter
}