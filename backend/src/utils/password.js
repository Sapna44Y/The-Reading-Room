import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

const hash = (plainPassword) => bcrypt.hash(plainPassword, SALT_ROUNDS);

const compare = (plainPassword, passwordHash) =>
  bcrypt.compare(plainPassword, passwordHash);

export default { hash, compare };
