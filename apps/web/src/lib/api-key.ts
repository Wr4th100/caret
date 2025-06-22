import crypto from 'crypto';

// const ENCRYPTION_KEY = process.env.API_KEY_SECRET!;
const ENCRYPTION_KEY = crypto.createHash('sha256').update(process.env.API_KEY_SECRET!).digest();
const IV_LENGTH = 16;

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function decrypt(text: string): string {
  const [ivText, encryptedText] = text.split(':');
  const iv = Buffer.from(ivText!, 'hex');
  const encrypted = Buffer.from(encryptedText!, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}
