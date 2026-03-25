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
    new RegExp(`(^| && )${RegExp.escape(oldScript)}($| && )`).test(
      baseScript,
    )
  ) {
    return baseScript.replace(
      new RegExp(`(^| && )(${RegExp.escape(oldScript)})($| && )`),
      `$1${addedScript}$3`,
    );
  }

  if (
    new RegExp(`(^| && )${RegExp.escape(addedScript)}($| && )`).test(
      baseScript,
    )
  ) {
    return baseScript;
  }

  return `${baseScript ? `${baseScript} && ` : baseScript}${addedScript}`;
}
