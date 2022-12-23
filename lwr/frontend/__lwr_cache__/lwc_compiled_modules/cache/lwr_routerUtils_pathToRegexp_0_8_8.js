/*
The MIT License (MIT)

Copyright (c) 2014 Blake Embrey (hello@blakeembrey.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

/**
 * Tokenizer results.
 */

/**
 * Tokenize input string.
 */
function lexer(str) {
  const tokens = [];
  let i = 0;
  while (i < str.length) {
    const char = str[i];
    if (char === '*' || char === '+' || char === '?') {
      tokens.push({
        type: 'MODIFIER',
        index: i,
        value: str[i++]
      });
      continue;
    }
    if (char === '\\') {
      tokens.push({
        type: 'ESCAPED_CHAR',
        index: i++,
        value: str[i++]
      });
      continue;
    }
    if (char === '{') {
      tokens.push({
        type: 'OPEN',
        index: i,
        value: str[i++]
      });
      continue;
    }
    if (char === '}') {
      tokens.push({
        type: 'CLOSE',
        index: i,
        value: str[i++]
      });
      continue;
    }
    if (char === ':') {
      let name = '';
      let j = i + 1;
      while (j < str.length) {
        const code = str.charCodeAt(j);
        if (
        // `0-9`
        code >= 48 && code <= 57 ||
        // `A-Z`
        code >= 65 && code <= 90 ||
        // `a-z`
        code >= 97 && code <= 122 ||
        // `_`
        code === 95) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name) throw new TypeError(`Missing parameter name at ${i}`);
      tokens.push({
        type: 'NAME',
        index: i,
        value: name
      });
      i = j;
      continue;
    }
    if (char === '(') {
      let count = 1;
      let pattern = '';
      let j = i + 1;
      if (str[j] === '?') {
        throw new TypeError(`Pattern cannot start with "?" at ${j}`);
      }
      while (j < str.length) {
        if (str[j] === '\\') {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ')') {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === '(') {
          count++;
          if (str[j + 1] !== '?') {
            throw new TypeError(`Capturing groups are not allowed at ${j}`);
          }
        }
        pattern += str[j++];
      }
      if (count) throw new TypeError(`Unbalanced pattern at ${i}`);
      if (!pattern) throw new TypeError(`Missing pattern at ${i}`);
      tokens.push({
        type: 'PATTERN',
        index: i,
        value: pattern
      });
      i = j;
      continue;
    }
    tokens.push({
      type: 'CHAR',
      index: i,
      value: str[i++]
    });
  }
  tokens.push({
    type: 'END',
    index: i,
    value: ''
  });
  return tokens;
}
/**
 * Escape a regular expression string.
 */

function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, '\\$1');
}
/**
 * Get the flags for a regexp from the options.
 */

function flags(options) {
  return options && options.sensitive ? '' : 'i';
}

/**
 * Parse a string for the raw tokens.
 */
export function parse(str, options = {}) {
  const tokens = lexer(str);
  const {
    prefixes = './'
  } = options;
  const defaultPattern = `[^${escapeString(options.delimiter || '/#?')}]+?`;
  const result = [];
  let key = 0;
  let i = 0;
  let path = '';
  const tryConsume = type => {
    if (i < tokens.length && tokens[i].type === type) return tokens[i++].value;
  };
  const mustConsume = type => {
    const value = tryConsume(type);
    if (value !== undefined) return value;
    const {
      type: nextType,
      index
    } = tokens[i];
    throw new TypeError(`Unexpected ${nextType} at ${index}, expected ${type}`);
  };
  const consumeText = () => {
    let result = '';
    let value; // tslint:disable-next-line

    while (value = tryConsume('CHAR') || tryConsume('ESCAPED_CHAR')) {
      result += value;
    }
    return result;
  };
  while (i < tokens.length) {
    const char = tryConsume('CHAR');
    const name = tryConsume('NAME');
    const pattern = tryConsume('PATTERN');
    if (name || pattern) {
      let prefix = char || '';
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = '';
      }
      if (path) {
        result.push(path);
        path = '';
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: '',
        pattern: pattern || defaultPattern,
        modifier: tryConsume('MODIFIER') || ''
      });
      continue;
    }
    const value = char || tryConsume('ESCAPED_CHAR');
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = '';
    }
    const open = tryConsume('OPEN');
    if (open) {
      const prefix = consumeText();
      const name = tryConsume('NAME') || '';
      const pattern = tryConsume('PATTERN') || '';
      const suffix = consumeText();
      mustConsume('CLOSE');
      result.push({
        name: name || (pattern ? key++ : ''),
        pattern: name && !pattern ? defaultPattern : pattern,
        prefix,
        suffix,
        modifier: tryConsume('MODIFIER') || ''
      });
      continue;
    }
    mustConsume('END');
  }
  return result;
}

/**
 * Expose a method for transforming tokens into the path function.
 */
export function tokensToFunction(tokens, options = {}) {
  const reFlags = flags(options);
  const {
    encode = x => x,
    validate = true
  } = options; // Compile all the tokens into regexps.

  const matches = tokens.map(token => {
    if (typeof token === 'object') {
      return new RegExp(`^(?:${token.pattern})$`, reFlags);
    }
  }); // eslint-disable-next-line @typescript-eslint/no-explicit-any

  return data => {
    let path = '';
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if (typeof token === 'string') {
        path += token;
        continue;
      }
      const value = data ? data[token.name] : undefined;
      const optional = token.modifier === '?' || token.modifier === '*';
      const repeat = token.modifier === '*' || token.modifier === '+';
      if (Array.isArray(value)) {
        if (!repeat) {
          throw new TypeError(`Expected "${token.name}" to not repeat, but got an array`);
        }
        if (value.length === 0) {
          if (optional) continue;
          throw new TypeError(`Expected "${token.name}" to not be empty`);
        }
        for (let j = 0; j < value.length; j++) {
          const segment = encode(value[j], token);
          if (validate && !matches[i].test(segment)) {
            throw new TypeError(`Expected all "${token.name}" to match "${token.pattern}", but got "${segment}"`);
          }
          path += token.prefix + segment + token.suffix;
        }
        continue;
      }
      if (typeof value === 'string' || typeof value === 'number') {
        const segment = encode(String(value), token);
        if (validate && !matches[i].test(segment)) {
          throw new TypeError(`Expected "${token.name}" to match "${token.pattern}", but got "${segment}"`);
        }
        path += token.prefix + segment + token.suffix;
        continue;
      }
      if (optional) continue;
      const typeOfMessage = repeat ? 'an array' : 'a string';
      throw new TypeError(`Expected "${token.name}" to be ${typeOfMessage}`);
    }
    return path;
  };
}
/**
 * Compile a string to a template function for the path.
 */

export function compile(str, options) {
  return tokensToFunction(parse(str, options), options);
}

/**
 * Create a path match function from `path-to-regexp` output.
 */
export function regexpToFunction(re, keys, options = {}) {
  const {
    decode = x => x
  } = options;
  return function (pathname) {
    const m = re.exec(pathname);
    if (!m) return false;
    const {
      0: path,
      index
    } = m;
    const params = Object.create(null);
    for (let i = 1; i < m.length; i++) {
      // tslint:disable-next-line
      if (m[i] === undefined) continue;
      const key = keys[i - 1];
      if (key.modifier === '*' || key.modifier === '+') {
        params[key.name] = m[i].split(key.prefix + key.suffix).map(value => {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i], key);
      }
    }
    return {
      path,
      index,
      params
    };
  };
}
/**
 * Metadata about a key.
 */

/**
 * Pull out keys from a regexp.
 */
function regexpToRegexp(path, keys) {
  if (!keys) return path; // Use a negative lookahead to match only capturing groups.

  const groups = path.source.match(/\((?!\?)/g);
  if (groups) {
    for (let i = 0; i < groups.length; i++) {
      keys.push({
        name: i,
        prefix: '',
        suffix: '',
        modifier: '',
        pattern: ''
      });
    }
  }
  return path;
}

/**
 * Expose a function for taking tokens and returning a RegExp.
 */
export function tokensToRegexp(tokens, keys, options = {}) {
  const {
    strict = false,
    start = true,
    end = true,
    encode = x => x
  } = options;
  const endsWith = `[${escapeString(options.endsWith || '')}]|$`;
  const delimiter = `[${escapeString(options.delimiter || '/#?')}]`;
  let route = start ? '^' : ''; // Iterate over the tokens and create our regexp string.

  for (const token of tokens) {
    if (typeof token === 'string') {
      route += escapeString(encode(token));
    } else {
      const prefix = escapeString(encode(token.prefix));
      const suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys) keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === '+' || token.modifier === '*') {
            const mod = token.modifier === '*' ? '?' : '';
            route += `(?:${prefix}((?:${token.pattern})(?:${suffix}${prefix}(?:${token.pattern}))*)${suffix})${mod}`;
          } else {
            route += `(?:${prefix}(${token.pattern})${suffix})${token.modifier}`;
          }
        } else {
          route += `(${token.pattern})${token.modifier}`;
        }
      } else {
        route += `(?:${prefix}${suffix})${token.modifier}`;
      }
    }
  }
  if (end) {
    if (!strict) route += `${delimiter}?`;
    route += !options.endsWith ? '$' : `(?=${endsWith})`;
  } else {
    const endToken = tokens[tokens.length - 1];
    const isEndDelimited = typeof endToken === 'string' ? delimiter.indexOf(endToken[endToken.length - 1]) > -1 :
    // tslint:disable-next-line
    endToken === undefined;
    if (!strict) {
      route += `(?:${delimiter}(?=${endsWith}))?`;
    }
    if (!isEndDelimited) {
      route += `(?=${delimiter}|${endsWith})`;
    }
  }
  return new RegExp(route, flags(options));
}
/**
 * Create a path regexp from string input.
 */

function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options);
}
/**
 * Supported `path-to-regexp` input types.
 */

/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 */
export function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp) return regexpToRegexp(path, keys); // eslint disable reason: co-dependent functions
  // eslint-disable-next-line @typescript-eslint/no-use-before-define

  if (Array.isArray(path)) return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}
/**
 * Create path match function from `path-to-regexp` spec.
 */

export function match(str, options) {
  const keys = [];
  const re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
/**
 * Transform an array into a regexp.
 */

function arrayToRegexp(paths, keys, options) {
  const parts = paths.map(path => pathToRegexp(path, keys, options).source);
  return new RegExp(`(?:${parts.join('|')})`, flags(options));
}