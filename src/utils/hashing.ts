import * as crypto from 'crypto';

export function hashPassword(password: string): string {
  const hash = crypto.createHash('md5');
  hash.update(password);
  return hash.digest('hex');
}
