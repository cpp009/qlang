

const TokenType = {
  PLUS: 'PLUS',
  MINUS: "MINUS",
  SLASH: 'SLASH',
  STAR: 'STAR',
  NUMBER: 'NUMBER',
  STRING: 'STRING',
  LEFT_PAREN: 'LEFT_PAREN',
  RIGT_PAREN: 'RIGT_PAREN',
  EOF: 'EOF'
}


function Token(type, lexeme, value, line){
  this.type = type
  this.lexeme = lexeme
  this.value = value
  this.line = line
}



function Scanner(code = '') {
  let current = 0
  let start = 0
  let line = 1
  let tokens = []


  function scanTokens() {
    current = 0
    line = 1
    tokens = []

    while(!isAtEnd()) {
      start = current
      scanToken()
    }

    tokens.push(new Token(TokenType.EOF, '', null, line))
    return tokens
  }

  function scanToken() {

    const ch = advance()
    switch(ch) {
      case '\n':
        line++
        break;
      case ' ':
      case '\t':
        break;
      case '+': addToken(TokenType.PLUS); break;
      case '-': addToken(TokenType.MINUS); break;
      case '*': addToken(TokenType.STAR); break;
      case '/': addToken(TokenType.SLASH); break;
      case '(': addToken(TokenType.LEFT_PAREN); break;
      case ')': addToken(TokenType.RIGT_PAREN); break;
      default:
        // 
        if (isDigit(ch)) {
          number()
        }
    }
  }

  function number() {
    while(isDigit(peek())) advance()
    const lexeme = code.slice(start, current)
    tokens.push(new Token(TokenType.NUMBER, lexeme, parseFloat(lexeme), line))
  }

  function isDigit(ch) {
    return ch >= '0' && ch <='9'
  }

  function addToken(type) {
    const lexeme = code.slice(start, current)
    tokens.push(new Token(type, lexeme, null, line))
  }

  function isAtEnd() {
    return peek() === ''
  }

  function peek() {
    if (current >= code.length) return ''
    return code[current]
  }

  function advance() {
    if (isAtEnd()) return ''
    return code[current++]
  }

  return {
    scanTokens
  }
}


module.exports = {
  Scanner,
  TokenType
}