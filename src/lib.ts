import escapeStringRegexp from 'escape-string-regexp';

export function ensureScript(
  baseScript = '',
  addedScript: string,
  oldScript?: string,
): string {
  if (typeof baseScript !== 'string' || baseScript === '') {
    return addedScript;
  }

  if (
    typeof oldScript === 'string' &&
    new RegExp(`(^| && )${escapeStringRegexp(oldScript)}($| && )`).test(
      baseScript,
    )
  ) {
    return baseScript.replace(
      new RegExp(`(^| && )(${escapeStringRegexp(oldScript)})($| && )`),
      `$1${addedScript}$3`,
    );
  }

  if (
    new RegExp(`(^| && )${escapeStringRegexp(addedScript)}($| && )`).test(
      baseScript,
    )
  ) {
    return baseScript;
  }

  return `${baseScript ? `${baseScript} && ` : baseScript}${addedScript}`;
}
