import * as bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

// export async function generatePassword(): Promise<string> {
//   const now = new Date();

//   const day = String(now.getDate()).padStart(2, '0');
//   const month = String(now.getMonth() + 1).padStart(2, '0');
//   const year = String(now.getFullYear());

//   return `${day}${month}${year}`;
// }

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
