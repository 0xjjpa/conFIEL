
// Takes a long hash string and truncates it.
export function truncate(
  hash: string,
  length = 38,
  initialCharsLength = 6
): string {
  return hash && hash.replace(hash.substring(initialCharsLength, length), '...')
}

// Takes a generic amount of args and creates a string
export function genKey(...args: string[]): string {
  return args.reduce((val, accum) => accum += "-" + val, "");
}

// If a word is excessively long, we shorten it up
export function shorten(_word: string, limit = 10, maxChars = 6): string {
  if (_word.length > limit) return truncate(_word, _word.length - maxChars, maxChars);
  return _word;
}

// Ensures title case on strings
export function titleCase(anyCase: string): string {
  return ((camelCase) => camelCase
    .replace(/\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
  )(anyCase)
}