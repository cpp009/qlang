

const TokenType = {
  PLUS: 'PLUS',
  MINUS: "MINUS",
  SLASH: 'SLASH',
  STAR: 'STAR',
  NUMBER: 'NUMBER',
  STRING: 'STRING',
  LEFT_PAREN: 'LEFT_PAREN',
  RIGT_PAREN: 'RIGT_PAREN',
  LEFT_BRACE: 'LEFT_BRACE',
  RIGT_BRACE: 'RIGT_BRACE',
  IDENTIFIER: 'IDENTIFIER',
  SEMICOLON: 'SEMICOLON',
  PRINT: 'PRINT',
  EQUAL: 'EQUAL',
  VAR: 'VAR',
  OR: 'OR',
  EOF: 'EOF'
}

const keywords = {
  or: TokenType.OR,
  print: TokenType.PRINT,
  var: TokenType.VAR
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
      case '{': addToken(TokenType.LEFT_BRACE); break;
      case '}': addToken(TokenType.RIGT_BRACE); break;
      case ';': addToken(TokenType.SEMICOLON); break;
      case '=': 
        if (peek() === '=') {

        } else if (peek() === '>') {

        } else if (peek() === '<'){

        } else if (peek() == '=') {

        } else {
          addToken(TokenType.EQUAL)
        }
        break;
      default:
        // 
        if (isDigit(ch)) {
          number()
        } else if (isAlpha(ch)) {
          identifier()
        }
    }
  }

  function number() {
    while(isDigit(peek())) advance()

    if (peek() === '.') {
      advance()
      while(isDigit(peek())) advance()
    }
    const lexeme = code.slice(start, current)
    tokens.push(new Token(TokenType.NUMBER, lexeme, parseFloat(lexeme), line))
  }

  function identifier() {
    while(isAlphaOrDigit(peek())) advance()

    const lexeme = code.slice(start, current)
    let type = keywords[lexeme]
    if (!type) type = TokenType.IDENTIFIER 
    addToken(type)
  }

  function isDigit(ch) {
    return ch >= '0' && ch <='9'
  }

  function isAlpha(ch) {
    return ch >= 'a' && ch <= 'z' || ch >= 'A' && ch <= 'Z' || ch === '_'
  }

  function isAlphaOrDigit(ch) {
    return isAlpha(ch) || isDigit(ch)
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