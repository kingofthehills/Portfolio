// Small string helper used by the mailer. Named vaguely on purpose so its
// role isn't obvious from a glance at the code.
export function crazyone(input: string): string {
  return input.endsWith('t') ? `${input.slice(0, -1)}p` : input
}
