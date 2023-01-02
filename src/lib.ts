import escapeStringRegexp from 'escape-string-regexp';

export function ensureScript(baseScript = '', addedScript: string): string {
  return new RegExp(`(^| && )${escapeStringRegexp(addedScript)}($| && )`).test(
    baseScript,
  )
    ? baseScript
    : `${baseScript ? `${baseScript} && ` : baseScript}${addedScript}`;
}
