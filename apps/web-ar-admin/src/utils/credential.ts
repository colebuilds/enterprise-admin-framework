const ACCOUNT_CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789';
const PASSWORD_LOWER_CHARS = 'abcdefghjkmnpqrstuvwxyz';
const PASSWORD_UPPER_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
const PASSWORD_DIGIT_CHARS = '23456789';
const PASSWORD_ALL_CHARS =
  PASSWORD_LOWER_CHARS + PASSWORD_UPPER_CHARS + PASSWORD_DIGIT_CHARS;

function getRandomIndex(max: number) {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.getRandomValues === 'function'
  ) {
    const values = new Uint32Array(1);
    crypto.getRandomValues(values);
    return values[0] % max;
  }
  return Math.floor(Math.random() * max);
}

function pickRandomChars(chars: string, length: number) {
  return Array.from({ length }, () => chars[getRandomIndex(chars.length)]).join(
    '',
  );
}

function shuffleChars(chars: string[]) {
  const nextChars = [...chars];
  for (let index = nextChars.length - 1; index > 0; index -= 1) {
    const randomIndex = getRandomIndex(index + 1);
    [nextChars[index], nextChars[randomIndex]] = [
      nextChars[randomIndex],
      nextChars[index],
    ];
  }
  return nextChars;
}

export function generateQuickAccount(prefix = 'user') {
  const normalizedPrefix =
    prefix
      .toLowerCase()
      .replaceAll(/[^a-z0-9_]/g, '')
      .replaceAll(/^_+|_+$/g, '')
      .slice(0, 8) || 'user';

  const separator = normalizedPrefix ? '_' : '';
  const randomLength = Math.max(6, 14 - normalizedPrefix.length);
  const randomPart = pickRandomChars(ACCOUNT_CHARS, randomLength);

  return `${normalizedPrefix}${separator}${randomPart}`.slice(0, 20);
}

export function generateQuickPassword(length = 12) {
  const targetLength = Math.max(8, length);
  const requiredChars = [
    pickRandomChars(PASSWORD_LOWER_CHARS, 1),
    pickRandomChars(PASSWORD_UPPER_CHARS, 1),
    pickRandomChars(PASSWORD_DIGIT_CHARS, 1),
  ];
  const randomChars = [
    ...pickRandomChars(PASSWORD_ALL_CHARS, targetLength - requiredChars.length),
  ];

  return shuffleChars([...requiredChars, ...randomChars]).join('');
}
